const { pool } = require('./postgres');

async function createTablesAndSeed() {
  const client = await pool.connect();
  try {
    console.log('--- Creating customer_holds and stock_transfers tables in PostgreSQL ---');

    // 1. Create customer_holds table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customer_holds (
        id SERIAL PRIMARY KEY,
        hold_no VARCHAR(50) NOT NULL,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) DEFAULT '',
        customer_email VARCHAR(150) DEFAULT '',
        item_code VARCHAR(100) NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
        unit_price NUMERIC(12, 2) DEFAULT 0,
        total_amount NUMERIC(14, 2) DEFAULT 0,
        hold_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '4 hours'),
        status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'EXPIRING_SOON', 'BILLED', 'CANCELLED'
        invoice_no VARCHAR(50) DEFAULT '',
        notes TEXT DEFAULT '',
        created_by VARCHAR(100) DEFAULT 'Staff',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT customer_holds_comp_branch_holdno_key UNIQUE (company_id, branch_code, hold_no)
      );
    `);
    console.log('✓ customer_holds table verified.');

    // 2. Create stock_transfers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_transfers (
        id SERIAL PRIMARY KEY,
        transfer_no VARCHAR(50) NOT NULL,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        from_branch VARCHAR(50) NOT NULL,
        to_branch VARCHAR(50) NOT NULL,
        item_code VARCHAR(100) NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
        unit_price NUMERIC(12, 2) DEFAULT 0,
        total_value NUMERIC(14, 2) DEFAULT 0,
        vehicle_no VARCHAR(100) DEFAULT 'GJ-01-TR-4501',
        driver_name VARCHAR(150) DEFAULT 'Ramesh Patel',
        driver_phone VARCHAR(50) DEFAULT '+91 98250 12345',
        status VARCHAR(50) DEFAULT 'In Transit', -- 'Pending', 'In Transit', 'Received', 'Cancelled'
        transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
        received_date TIMESTAMP WITH TIME ZONE,
        dispatch_notes TEXT DEFAULT '',
        received_notes TEXT DEFAULT '',
        created_by VARCHAR(100) DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT stock_transfers_comp_transno_key UNIQUE (company_id, transfer_no)
      );
    `);
    console.log('✓ stock_transfers table verified.');

    // 3. Seed initial holds if empty
    const holdsCountRes = await client.query('SELECT COUNT(*) FROM customer_holds');
    if (parseInt(holdsCountRes.rows[0].count, 10) === 0) {
      console.log('Seeding initial customer holds...');
      await client.query(`
        INSERT INTO customer_holds 
          (hold_no, company_id, branch_code, customer_name, customer_phone, customer_email, item_code, item_name, qty, unit_price, total_amount, expires_at, status, notes)
        VALUES
          ('RSV-2026-000123', 'comp_mann', 'AMD-01', 'ABC Safety Solutions Pvt Ltd', '+91 98250 88712', 'purchase@abcsafety.com', 'FE-ABC-4', 'ABC Dry Powder Extinguisher 4kg', 3, 1321.60, 3964.80, CURRENT_TIMESTAMP + INTERVAL '3 hours', 'ACTIVE', 'Customer requested counter hold until 4 PM payment release'),
          ('RSV-2026-000124', 'comp_mann', 'AMD-01', 'Walk-in Client (Phone Hold)', '+91 94280 11223', 'client@gmail.com', 'FE-CO2-2', 'CO2 Fire Extinguisher 2kg', 1, 2450.00, 2450.00, CURRENT_TIMESTAMP + INTERVAL '25 minutes', 'EXPIRING_SOON', 'Urgent call-in booking for factory inspection'),
          ('RSV-2026-000125', 'comp_mann', 'BRD-02', 'Gujarat Refinery Safety Dept', '+91 99090 33445', 'safety@refinery.guj.gov', 'SH-M201', 'Industrial Safety Helmet Yellow', 15, 340.00, 5100.00, CURRENT_TIMESTAMP + INTERVAL '5 hours', 'ACTIVE', 'Holding against purchase approval memo'),
          ('RSV-2026-000126', 'comp_mann', 'AMD-01', 'Mehta Textiles Mills', '+91 98790 55667', 'store@mehtatextiles.com', 'SG-CL01', 'Anti-Fog Safety Goggles Clear', 20, 115.00, 2300.00, CURRENT_TIMESTAMP - INTERVAL '1 day', 'BILLED', 'Billed and collected via POS INV-2026-0182');
      `);
      console.log('✓ Initial customer holds seeded.');
    }

    // 4. Seed initial transfers if empty
    const transCountRes = await client.query('SELECT COUNT(*) FROM stock_transfers');
    if (parseInt(transCountRes.rows[0].count, 10) === 0) {
      console.log('Seeding initial stock transfers...');
      await client.query(`
        INSERT INTO stock_transfers 
          (transfer_no, company_id, from_branch, to_branch, item_code, item_name, qty, unit_price, total_value, vehicle_no, driver_name, driver_phone, status, transfer_date, received_date, dispatch_notes)
        VALUES
          ('STR-0045', 'comp_mann', 'AMD-01', 'BRD-02', 'FE-ABC-4', 'ABC Dry Powder Extinguisher 4kg', 12, 1321.60, 15859.20, 'GJ-01-XX-9821', 'Ramesh Patel', '+91 98250 12345', 'In Transit', CURRENT_DATE, NULL, 'Urgent transfer for regional petrochemical order'),
          ('STR-0044', 'comp_mann', 'BRD-02', 'AMD-01', 'FE-CO2-2', 'CO2 Fire Extinguisher 2kg', 5, 2450.00, 12250.00, 'GJ-06-AB-3341', 'Dilip Vaghela', '+91 97240 66789', 'Received', CURRENT_DATE - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '18 hours', 'Surplus rebalancing to flagship hub'),
          ('STR-0043', 'comp_mann', 'AMD-01', 'AND-01', 'SH-M201', 'Industrial Safety Helmet Yellow', 25, 340.00, 8500.00, 'GJ-01-YY-1234', 'Mahesh Rathod', '+91 99040 22114', 'Received', CURRENT_DATE - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Quarterly stock replenishment'),
          ('STR-0042', 'comp_mann', 'SRU-02', 'AMD-01', 'SG-CL01', 'Anti-Fog Safety Goggles Clear', 50, 115.00, 5750.00, 'GJ-05-ZZ-5522', 'Sanjay Solanki', '+91 98244 88990', 'Received', CURRENT_DATE - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Central distribution dispatch');
      `);
      console.log('✓ Initial stock transfers seeded.');
    }

    console.log('--- All tables and seeded data successfully created! ---');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    client.release();
    pool.end();
  }
}

createTablesAndSeed();
