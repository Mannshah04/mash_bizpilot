const { pool } = require('./postgres.js');

async function setupBranchStock() {
  const client = await pool.connect();
  try {
    console.log('--- Setting up Branch-Specific Stock with Common Item Catalog ---');
    await client.query('BEGIN');

    // 1. Create branch_stock table
    await client.query(`
      CREATE TABLE IF NOT EXISTS branch_stock (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        branch_code VARCHAR(50) NOT NULL,
        pid VARCHAR(100) NOT NULL,
        current_stock NUMERIC(12, 2) DEFAULT 0,
        min_stock NUMERIC(12, 2) DEFAULT 10,
        status VARCHAR(50) DEFAULT 'OK',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_branch_stock UNIQUE (company_id, branch_code, pid)
      );
    `);

    // 2. Fetch all common products
    const productsRes = await client.query(`SELECT id, company_id, pid, min_stock FROM product ORDER BY id ASC`);
    const products = productsRes.rows;

    console.log(`Loaded ${products.length} master common products from catalog.`);

    // 3. Define branch stock distribution multiplier/profiles for variety (high, medium, low, out)
    // For comp_mann: AMD-01 (Flagship: High), BRD-02 (Medium/Mixed), SUR-02 (Different spread), VAD-03 (Selective)
    const mannBranches = ['AMD-01', 'BRD-02', 'SUR-02', 'VAD-03'];
    const mashtechBranches = ['AND-01', 'SRU-02'];

    // Specific varied quantities per product & branch for realistic distribution
    const seedMap = {
      // comp_mann products
      'FE-ABC-4': { 'AMD-01': 48, 'BRD-02': 12, 'SUR-02': 25, 'VAD-03': 0 },   // High at AMD, Low at BRD, Out at VAD
      'FE-CO2-2': { 'AMD-01': 32, 'BRD-02': 6,  'SUR-02': 18, 'VAD-03': 14 },  // High at AMD, Low at BRD
      'SG-CL01':  { 'AMD-01': 65, 'BRD-02': 22, 'SUR-02': 40, 'VAD-03': 8 },   // High at AMD, Low at VAD
      'SH-M201':  { 'AMD-01': 10, 'BRD-02': 45, 'SUR-02': 15, 'VAD-03': 30 },  // Low at AMD, High at BRD
      'SM-DET1':  { 'AMD-01': 0,  'BRD-02': 28, 'SUR-02': 35, 'VAD-03': 12 },  // Out at AMD, High at SUR
      'FA-KIT1':  { 'AMD-01': 24, 'BRD-02': 8,  'SUR-02': 0,  'VAD-03': 18 },  // Low at BRD, Out at SUR
      'FR-SUT5':  { 'AMD-01': 15, 'BRD-02': 3,  'SUR-02': 8,  'VAD-03': 0 },   // Critical at BRD, Out at VAD
      'SP-HDR-68': { 'AMD-01': 85, 'BRD-02': 14, 'SUR-02': 55, 'VAD-03': 16 }, // High at AMD, Medium at SUR
      'HR-SWV-30': { 'AMD-01': 6,  'BRD-02': 20, 'SUR-02': 10, 'VAD-03': 4 },  // Low at AMD, High at BRD
      'HT-GLV-500': { 'AMD-01': 50, 'BRD-02': 4,  'SUR-02': 22, 'VAD-03': 0 },  // High at AMD, Low at BRD, Out at VAD
      'EX-LED-BAT': { 'AMD-01': 20, 'BRD-02': 35, 'SUR-02': 0,  'VAD-03': 25 }, // High at BRD, Out at SUR
      'CF-EXT-50': { 'AMD-01': 5,  'BRD-02': 15, 'SUR-02': 40, 'VAD-03': 8 },  // Low at AMD, High at SUR
      'CS-BOOT-9': { 'AMD-01': 30, 'BRD-02': 0,  'SUR-02': 18, 'VAD-03': 12 }, // Out at BRD, High at AMD
      'FB-HVY-2':  { 'AMD-01': 14, 'BRD-02': 22, 'SUR-02': 6,  'VAD-03': 16 }, // Low at SUR, Medium at AMD
      'GM-FFP3':   { 'AMD-01': 90, 'BRD-02': 15, 'SUR-02': 45, 'VAD-03': 0 },  // High at AMD, Out at VAD
      'HAZ-TYP3':  { 'AMD-01': 12, 'BRD-02': 7,  'SUR-02': 20, 'VAD-03': 2 },  // Low at BRD & VAD

      // comp_mashtech products
      'CAT6A-100M': { 'AND-01': 45, 'SRU-02': 12 },
      'ESD-MAT-01': { 'AND-01': 8,  'SRU-02': 30 },
      'SRV-RCK-42': { 'AND-01': 14, 'SRU-02': 0 },
      'UPS-3KVA-ON': { 'AND-01': 5, 'SRU-02': 18 },
      'FBR-SFP-10': { 'AND-01': 22, 'SRU-02': 6 },
      'FW-GW-10G':  { 'AND-01': 0,  'SRU-02': 15 },
      'LSR-SFT-GLS': { 'AND-01': 35, 'SRU-02': 40 },
      'RACK-PDU-16': { 'AND-01': 12, 'SRU-02': 4 }
    };

    for (const prod of products) {
      const branches = prod.company_id === 'comp_mann' ? mannBranches : mashtechBranches;
      const minStock = parseFloat(prod.min_stock) || 10;

      for (const bCode of branches) {
        let stock = 15;
        if (seedMap[prod.pid] && seedMap[prod.pid][bCode] !== undefined) {
          stock = seedMap[prod.pid][bCode];
        } else {
          // pseudo-random deterministic distribution based on char code
          const hash = (prod.pid.charCodeAt(0) + bCode.charCodeAt(0)) % 4;
          stock = hash === 0 ? 0 : hash === 1 ? 5 : hash === 2 ? 20 : 45;
        }

        let status = 'OK';
        if (stock === 0) status = 'Out';
        else if (stock <= minStock) status = 'Low';

        await client.query(`
          INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
          ON CONFLICT (company_id, branch_code, pid) DO UPDATE SET
            current_stock = EXCLUDED.current_stock,
            min_stock = EXCLUDED.min_stock,
            status = EXCLUDED.status,
            updated_at = CURRENT_TIMESTAMP;
        `, [prod.company_id, bCode, prod.pid, stock, minStock, status]);
      }
    }

    await client.query('COMMIT');
    console.log('✓ branch_stock created and populated with distinct branch quantities!');

    // Show sample comparison
    const sample = await client.query(`
      SELECT pid, branch_code, current_stock, status
      FROM branch_stock
      WHERE pid IN ('FE-ABC-4', 'FE-CO2-2', 'SH-M201', 'SM-DET1')
      ORDER BY pid, branch_code;
    `);
    console.log('Sample Branch Stock Distribution:');
    console.table(sample.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Setup failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

setupBranchStock();
