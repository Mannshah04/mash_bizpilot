const { pool } = require('./postgres');

async function runMigration() {
  console.log('Creating branches table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS branches (
      id SERIAL PRIMARY KEY,
      company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
      code VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) DEFAULT 'Gujarat',
      type VARCHAR(50) DEFAULT 'BRANCH_OFFICE',
      latitude NUMERIC(10, 6) NOT NULL DEFAULT 23.0225,
      longitude NUMERIC(10, 6) NOT NULL DEFAULT 72.5714,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_company_branch_code UNIQUE (company_id, code)
    );

    INSERT INTO branches (company_id, code, name, city, state, type, latitude, longitude, status)
    VALUES
      ('comp_mann', 'AMD-01', 'Amd-Branch (Ahmedabad)', 'Ahmedabad', 'Gujarat', 'CENTRAL_HUB', 23.0225, 72.5714, 'Active'),
      ('comp_mann', 'BRD-02', 'Brd-Branch (Baroda)', 'Vadodara', 'Gujarat', 'BRANCH_OFFICE', 22.3072, 73.1812, 'Active'),
      ('comp_mashtech', 'AND-01', 'And-Branch (Anand)', 'Anand', 'Gujarat', 'TECH_CENTRE', 22.5645, 72.9289, 'Active'),
      ('comp_mashtech', 'SRU-02', 'Sru-Branch (Surat)', 'Surat', 'Gujarat', 'BRANCH_DEPOT', 21.1702, 72.8311, 'Active')
    ON CONFLICT (company_id, code) DO UPDATE SET
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      name = EXCLUDED.name,
      city = EXCLUDED.city;
  `);

  const res = await pool.query('SELECT id, company_id, code, name, city, latitude, longitude FROM branches ORDER BY id ASC');
  console.log('Migration successful! Branches in PostgreSQL:');
  console.table(res.rows);
  process.exit(0);
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
