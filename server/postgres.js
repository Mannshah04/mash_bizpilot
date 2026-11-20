const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'bizzpilot',
      password: process.env.PG_PASSWORD || '1551',
      port: parseInt(process.env.PG_PORT || '5432', 10),
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// Initialize table and seed initial data
async function initDatabase() {
  try {
    const client = await pool.connect();
    try {
      console.log('Connecting to PostgreSQL database "bizzpilot"...');

      // Create product table matching standard format (without date_of_in)
      await client.query(`
        CREATE TABLE IF NOT EXISTS product (
          id SERIAL PRIMARY KEY,
          branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
          supplier VARCHAR(255) DEFAULT 'General Supplier',
          name VARCHAR(255) NOT NULL,
          description TEXT DEFAULT '',
          weight VARCHAR(100) DEFAULT '1 kg',
          category VARCHAR(100) DEFAULT 'Fire Extinguishers',
          sub_category VARCHAR(100) DEFAULT 'General',
          pid VARCHAR(100) NOT NULL,
          hsn VARCHAR(50) DEFAULT '8424',
          current_stock NUMERIC(12, 2) DEFAULT 0,
          min_stock NUMERIC(12, 2) DEFAULT 10,
          exp_months NUMERIC(10, 2) DEFAULT 12,
          sale_price NUMERIC(12, 2) DEFAULT 0,
          gst NUMERIC(5, 2) DEFAULT 18,
          purchase_price NUMERIC(12, 2) DEFAULT 0,
          total_without_tax NUMERIC(14, 2) DEFAULT 0,
          total_with_tax NUMERIC(14, 2) DEFAULT 0,
          exp_days INT DEFAULT 360,
          status VARCHAR(50) DEFAULT 'OK',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT uq_product_branch_pid UNIQUE (branch_code, pid)
        );
      `);

      // ── Create users table for Tenant Owner and Branch Managers ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(50) UNIQUE NOT NULL,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
          company_name VARCHAR(255) NOT NULL DEFAULT 'Mann Engineers Fire Safety',
          branch_code VARCHAR(50) NOT NULL,
          branch_name VARCHAR(150) NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Add multi-tenant company and employee columns if they don't already exist
        ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id VARCHAR(50) DEFAULT 'comp_mann';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) DEFAULT 'Mann Engineers Fire Safety';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT 'Staff';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'Operations';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS salary NUMERIC(12, 2) DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE DEFAULT NULL;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
        ALTER TABLE product ADD COLUMN IF NOT EXISTS company_id VARCHAR(50) DEFAULT 'comp_mann';
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id VARCHAR(50) DEFAULT 'comp_mann';
        ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id VARCHAR(50) DEFAULT 'comp_mann';

        -- Common Company Inventory: Unique per company and product SKU
        ALTER TABLE product DROP CONSTRAINT IF EXISTS uq_product_branch_pid;
        ALTER TABLE product DROP CONSTRAINT IF EXISTS uq_product_comp_branch_pid;
        ALTER TABLE product DROP CONSTRAINT IF EXISTS uq_product_comp_pid;
        ALTER TABLE product ADD CONSTRAINT uq_product_comp_pid UNIQUE (company_id, pid);

        -- Branch-Specific Stock table: tracks stock qty per branch for common products
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

        -- Ensure invoices are unique per company & branch so every branch can have its own series (1, 2, 3, 4...)
        ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_invoice_no_key;
        ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_company_branch_invno_key;
        ALTER TABLE invoices ADD CONSTRAINT invoices_company_branch_invno_key UNIQUE (company_id, branch_code, invoice_no);
      `);

      console.log('PostgreSQL tables "product" and "users" verified and multi-tenant schema ready.');

      // ── Create customers table for instant customer directory & autocomplete ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          uid VARCHAR(50) UNIQUE NOT NULL,
          company VARCHAR(255) NOT NULL,
          name VARCHAR(255) DEFAULT '',
          phone VARCHAR(50) DEFAULT '',
          email VARCHAR(150) DEFAULT '',
          address TEXT DEFAULT '',
          gstin VARCHAR(50) DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // ── Create invoices table (matching create_quotation.php reference) ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS invoices (
          id SERIAL PRIMARY KEY,
          invoice_no VARCHAR(50) NOT NULL,
          branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
          customer_uid VARCHAR(50) DEFAULT '',
          customer_name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(150) DEFAULT '',
          customer_phone VARCHAR(50) DEFAULT '',
          customer_email VARCHAR(150) DEFAULT '',
          customer_address TEXT DEFAULT '',
          customer_gstin VARCHAR(50) DEFAULT '',
          invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
          due_date DATE,
          followup_by VARCHAR(150) DEFAULT 'Admin',
          reference_no VARCHAR(100) DEFAULT '',
          revision_no VARCHAR(50) DEFAULT '1',
          total_items INT DEFAULT 1,
          subtotal NUMERIC(14, 2) DEFAULT 0,
          total_tax NUMERIC(14, 2) DEFAULT 0,
          discount_amount NUMERIC(14, 2) DEFAULT 0,
          round_off NUMERIC(8, 2) DEFAULT 0,
          grand_total NUMERIC(14, 2) DEFAULT 0,
          payment_mode VARCHAR(50) DEFAULT 'Cash',
          status VARCHAR(50) DEFAULT 'Posted',
          quote_remark TEXT DEFAULT '',
          terms_conditions TEXT DEFAULT '',
          created_by VARCHAR(100) DEFAULT 'Admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // ── Create invoice_items table for line items ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS invoice_items (
          id SERIAL PRIMARY KEY,
          invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
          invoice_no VARCHAR(50) NOT NULL,
          item_code VARCHAR(100) NOT NULL,
          item_name VARCHAR(255) NOT NULL,
          unit VARCHAR(50) DEFAULT 'NOS',
          hsn_code VARCHAR(50) DEFAULT '',
          qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
          unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
          discount NUMERIC(12, 2) DEFAULT 0,
          effective_price NUMERIC(12, 2) DEFAULT 0,
          tax_rate NUMERIC(5, 2) DEFAULT 18,
          tax_amount NUMERIC(12, 2) DEFAULT 0,
          subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
          remark TEXT DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('PostgreSQL tables "customers", "invoices", and "invoice_items" verified and ready.');

      // ── Create purchases table ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS purchases (
          id SERIAL PRIMARY KEY,
          po_no VARCHAR(50) NOT NULL,
          company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
          branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
          supplier_uid VARCHAR(50) DEFAULT '',
          supplier_name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(150) DEFAULT '',
          supplier_phone VARCHAR(50) DEFAULT '',
          supplier_email VARCHAR(150) DEFAULT '',
          supplier_address TEXT DEFAULT '',
          supplier_gstin VARCHAR(50) DEFAULT '',
          po_date DATE NOT NULL DEFAULT CURRENT_DATE,
          due_date DATE,
          delivery_date DATE,
          reference_no VARCHAR(100) DEFAULT '',
          revision_no VARCHAR(50) DEFAULT '1',
          total_items INT DEFAULT 1,
          subtotal NUMERIC(14, 2) DEFAULT 0,
          total_tax NUMERIC(14, 2) DEFAULT 0,
          discount_amount NUMERIC(14, 2) DEFAULT 0,
          round_off NUMERIC(8, 2) DEFAULT 0,
          grand_total NUMERIC(14, 2) DEFAULT 0,
          payment_terms VARCHAR(50) DEFAULT 'Credit 30 Days',
          status VARCHAR(50) DEFAULT 'Ordered',
          grn_no VARCHAR(100) DEFAULT '',
          po_remark TEXT DEFAULT '',
          terms_conditions TEXT DEFAULT '',
          created_by VARCHAR(100) DEFAULT 'Admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT purchases_company_branch_pono_key UNIQUE (company_id, branch_code, po_no)
        );
      `);

      // ── Create purchase_items table ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS purchase_items (
          id SERIAL PRIMARY KEY,
          purchase_id INT REFERENCES purchases(id) ON DELETE CASCADE,
          po_no VARCHAR(50) NOT NULL,
          item_code VARCHAR(100) NOT NULL,
          item_name VARCHAR(255) NOT NULL,
          unit VARCHAR(50) DEFAULT 'NOS',
          hsn_code VARCHAR(50) DEFAULT '',
          qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
          unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
          discount NUMERIC(12, 2) DEFAULT 0,
          effective_price NUMERIC(12, 2) DEFAULT 0,
          tax_rate NUMERIC(5, 2) DEFAULT 18,
          tax_amount NUMERIC(12, 2) DEFAULT 0,
          subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
          remark TEXT DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // ── Create cash_book table ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS cash_book (
          id SERIAL PRIMARY KEY,
          company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
          branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
          entry_no VARCHAR(50) NOT NULL,
          entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
          type VARCHAR(50) NOT NULL DEFAULT 'Receipt',
          party VARCHAR(255) NOT NULL,
          category VARCHAR(100) DEFAULT 'Counter Sales',
          ref_no VARCHAR(100) DEFAULT '',
          narration TEXT DEFAULT '',
          dr_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
          cr_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
          balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
          payment_mode VARCHAR(50) DEFAULT 'Cash',
          reconciled BOOLEAN DEFAULT false,
          created_by VARCHAR(100) DEFAULT 'Admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT cash_book_company_branch_entryno_key UNIQUE (company_id, branch_code, entry_no)
        );
      `);

      console.log('PostgreSQL tables "purchases", "purchase_items", and "cash_book" verified and ready.');

      // ── Categories & Subcategories Master Table (cat_sub) ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS cat_sub (
          id SERIAL PRIMARY KEY,
          tittle VARCHAR(255) NOT NULL,
          sp_cat VARCHAR(50) NOT NULL,
          type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Ensure unnecessary legacy tables & views are dropped
        DROP TABLE IF EXISTS catalog_products CASCADE;
        DROP TABLE IF EXISTS catalog_categories CASCADE;
        DROP TABLE IF EXISTS catalog_gallery CASCADE;
        DROP TABLE IF EXISTS catalog_catalogues CASCADE;
        DROP VIEW IF EXISTS products CASCADE;
      `);

      console.log('PostgreSQL table "cat_sub" verified and ready.');

      // ── Companies Master Table ──
      await client.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id VARCHAR(100) PRIMARY KEY,
          tenant_id VARCHAR(100),
          name VARCHAR(255) NOT NULL,
          legal_name VARCHAR(255),
          gstin VARCHAR(50),
          pan VARCHAR(20),
          address TEXT DEFAULT '',
          pin_code VARCHAR(20) DEFAULT '',
          state VARCHAR(100) DEFAULT '',
          country VARCHAR(100) DEFAULT 'India',
          primary_color VARCHAR(50) DEFAULT '#0284c7',
          currency VARCHAR(10) DEFAULT 'INR',
          status VARCHAR(50) DEFAULT 'ACTIVE',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO companies (id, tenant_id, name, legal_name, gstin, pan, status)
        VALUES 
          ('comp_mann', 'comp_mann', 'Mann Engineers Fire Safety', 'Mann Engineers Fire Safety Pvt Ltd', '24AABCM8921K1ZK', 'AABCM8921K', 'ACTIVE'),
          ('comp_mashtech', 'comp_mashtech', 'Mash Tech', 'Mash Tech Solutions Pvt Ltd', '24AABCM9988T1Z9', 'AABCM9988T', 'ACTIVE')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('PostgreSQL table "companies" verified and ready.');

      // ── Branches Master Table with GPS Coordinates & Full Contact Details ──
      await client.query(`
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

        -- Add extended contact & data correction columns
        ALTER TABLE branches ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
        ALTER TABLE branches ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';
        ALTER TABLE branches ADD COLUMN IF NOT EXISTS email VARCHAR(150) DEFAULT '';
        ALTER TABLE branches ADD COLUMN IF NOT EXISTS gstin VARCHAR(50) DEFAULT '';
      `);

      // Ensure default branches for Mann Engineers Fire Safety exist with coordinates and contact info
      await client.query(`
        INSERT INTO branches (company_id, code, name, city, state, type, latitude, longitude, address, phone, email, gstin, status, updated_at)
        VALUES 
          ('comp_mann', 'AMD-01', 'Amd-Branch (Ahmedabad)', 'Ahmedabad', 'Gujarat', 'FLAGSHIP_STORE', 23.0225, 72.5714, 'Shop 12-14, Ground Floor, Shivalik Plaza, IIM Road, Panjrapole, Ahmedabad', '+91 79 2630 1100', 'ahmedabad@mannengineers.in', '24AAACM1234F1Z8', 'Active', CURRENT_TIMESTAMP),
          ('comp_mann', 'BRD-02', 'Brd-Branch (Baroda)', 'Vadodara', 'Gujarat', 'REGIONAL_HUB', 22.307159, 73.181219, 'Plot 45, GIDC Industrial Estate, Makarpura, Vadodara', '+91 265 2640 2200', 'baroda@mannengineers.in', '24AAACM1234F2Z7', 'Active', CURRENT_TIMESTAMP)
        ON CONFLICT (company_id, code) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          type = EXCLUDED.type,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          address = CASE WHEN branches.address = '' THEN EXCLUDED.address ELSE branches.address END,
          phone = CASE WHEN branches.phone = '' THEN EXCLUDED.phone ELSE branches.phone END,
          email = CASE WHEN branches.email = '' THEN EXCLUDED.email ELSE branches.email END,
          gstin = CASE WHEN branches.gstin = '' THEN EXCLUDED.gstin ELSE branches.gstin END,
          updated_at = CURRENT_TIMESTAMP;
      `);

      console.log('PostgreSQL table "branches" verified with coordinates & contact details ready.');

      // ── Customer Holds & Pickups Table ──
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
          status VARCHAR(50) DEFAULT 'ACTIVE',
          invoice_no VARCHAR(50) DEFAULT '',
          notes TEXT DEFAULT '',
          created_by VARCHAR(100) DEFAULT 'Staff',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT customer_holds_comp_branch_holdno_key UNIQUE (company_id, branch_code, hold_no)
        );
      `);

      // ── Stock Transfers Table ──
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
          status VARCHAR(50) DEFAULT 'In Transit',
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

      console.log('PostgreSQL tables "customer_holds" and "stock_transfers" verified and ready.');

      // Seed cat_sub table if empty
      const catSubCountRes = await client.query('SELECT COUNT(*) FROM cat_sub');
      if (parseInt(catSubCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding dedicated cat_sub table with actual categories & subcategories...');
        const initialCats = [
          { tittle: 'PPE', type: 'category', sp_cat: 'PPE' },
          { tittle: 'Fire Equipment', type: 'category', sp_cat: 'FEM' },
          { tittle: 'Industrial Safety', type: 'category', sp_cat: 'IDS' },
          { tittle: 'Safety Shoes', type: 'subcategory', sp_cat: 'SFS' },
          { tittle: 'Mask', type: 'subcategory', sp_cat: 'MA' },
          { tittle: 'Fire Extinguisher', type: 'subcategory', sp_cat: 'FES' },
          { tittle: 'Safety Helmet', type: 'subcategory', sp_cat: 'SHM' }
        ];
        for (const c of initialCats) {
          await client.query(
            `INSERT INTO cat_sub (tittle, sp_cat, type) VALUES ($1, $2, $3)`,
            [c.tittle, c.sp_cat, c.type]
          );
        }
      }
      const countRes = await client.query(`SELECT COUNT(*) FROM product WHERE branch_code = 'AMD-01'`);
      const count = parseInt(countRes.rows[0].count, 10);

      if (count === 0) {
        console.log('Seeding initial 7 inventory products into PostgreSQL "product" table...');
        const initialProducts = [
          {
            supplier: 'FireTech Safety India Pvt Ltd',
            name: 'ABC Dry Powder Fire Ext. 4kg',
            description: 'Stored pressure dry chemical powder fire extinguisher 4kg capacity',
            weight: '6.5 kg',
            category: 'Fire Extinguishers',
            sub_category: 'Powder Extinguisher',
            pid: 'FE-ABC-4',
            hsn: '8424',
            current_stock: 45,
            min_stock: 20,
            exp_months: 60,
            sale_price: 1321.60,
            gst: 18,
            purchase_price: 1120.00,
            total_without_tax: 50400.00,
            total_with_tax: 59472.00,
            exp_days: 1800,
            status: 'OK'
          },
          {
            supplier: 'SafeZone Equipments Ltd',
            name: 'CO2 Fire Extinguisher 2kg',
            description: 'Seamless carbon dioxide gas extinguisher with wheel horn',
            weight: '5.2 kg',
            category: 'Fire Extinguishers',
            sub_category: 'Gas Extinguisher',
            pid: 'FE-CO2-2',
            hsn: '8424',
            current_stock: 12,
            min_stock: 15,
            exp_months: 60,
            sale_price: 2891.00,
            gst: 18,
            purchase_price: 2450.00,
            total_without_tax: 29400.00,
            total_with_tax: 34692.00,
            exp_days: 1800,
            status: 'Low'
          },
          {
            supplier: 'Karam Safety Products',
            name: 'Safety Helmet M-201 ISI',
            description: 'High-density polyethylene safety helmet with 4-point ratchet harness',
            weight: '380 g',
            category: 'PPE',
            sub_category: 'Head Protection',
            pid: 'SH-M201',
            hsn: '6506',
            current_stock: 3,
            min_stock: 25,
            exp_months: 36,
            sale_price: 336.30,
            gst: 18,
            purchase_price: 285.00,
            total_without_tax: 855.00,
            total_with_tax: 1008.90,
            exp_days: 1080,
            status: 'Critical'
          },
          {
            supplier: '3M India Safety Division',
            name: 'Safety Goggles Clear Lens',
            description: 'Anti-fog polycarbonate impact resistant splash safety glasses',
            weight: '85 g',
            category: 'PPE',
            sub_category: 'Eye Protection',
            pid: 'SG-CL01',
            hsn: '9004',
            current_stock: 67,
            min_stock: 30,
            exp_months: 36,
            sale_price: 171.10,
            gst: 18,
            purchase_price: 145.00,
            total_without_tax: 9715.00,
            total_with_tax: 11463.70,
            exp_days: 1080,
            status: 'OK'
          },
          {
            supplier: 'MediSafe First Aid Co.',
            name: 'First Aid Kit Industrial',
            description: 'Comprehensive 50-item emergency workplace first aid box',
            weight: '1.8 kg',
            category: 'First Aid',
            sub_category: 'Medical Kits',
            pid: 'FA-KIT1',
            hsn: '3006',
            current_stock: 28,
            min_stock: 10,
            exp_months: 24,
            sale_price: 952.00,
            gst: 12,
            purchase_price: 850.00,
            total_without_tax: 23800.00,
            total_with_tax: 26656.00,
            exp_days: 720,
            status: 'OK'
          },
          {
            supplier: 'DuPont Protection Solutions',
            name: 'Fire Retardant Suit Type 5',
            description: 'Nomex III-A flame resistant boiler suit certified EN ISO 11612',
            weight: '1.4 kg',
            category: 'PPE',
            sub_category: 'Body Protection',
            pid: 'FR-SUT5',
            hsn: '6211',
            current_stock: 8,
            min_stock: 5,
            exp_months: 48,
            sale_price: 5040.00,
            gst: 12,
            purchase_price: 4500.00,
            total_without_tax: 36000.00,
            total_with_tax: 40320.00,
            exp_days: 1440,
            status: 'OK'
          },
          {
            supplier: 'Honeywell Building Technologies',
            name: 'Smoke Detector Photoelectric',
            description: 'Optical photoelectric ceiling sensor with built-in 85dB siren',
            weight: '220 g',
            category: 'Detection',
            sub_category: 'Fire Alarms',
            pid: 'SM-DET1',
            hsn: '8531',
            current_stock: 0,
            min_stock: 10,
            exp_months: 60,
            sale_price: 1416.00,
            gst: 18,
            purchase_price: 1200.00,
            total_without_tax: 0.00,
            total_with_tax: 0.00,
            exp_days: 1800,
            status: 'Out'
          }
        ];

        for (const p of initialProducts) {
          await client.query(`
            INSERT INTO product (
              company_id, branch_code, supplier, name, description, weight,
              category, sub_category, pid, hsn, current_stock, min_stock,
              exp_months, sale_price, gst, purchase_price, total_without_tax,
              total_with_tax, exp_days, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (company_id, pid) DO NOTHING;
          `, [
            'comp_mann', 'COMMON', p.supplier, p.name, p.description, p.weight,
            p.category, p.sub_category, p.pid, p.hsn, p.current_stock, p.min_stock,
            p.exp_months, p.sale_price, p.gst, p.purchase_price, p.total_without_tax,
            p.total_with_tax, p.exp_days, p.status
          ]);
        }
        console.log('Seeded initial products successfully into PostgreSQL for AMD-01!');
      }

      // Seed Surat South Hub (SUR-02) distinct inventory if empty
      const suratCountRes = await client.query(`SELECT COUNT(*) FROM product WHERE branch_code = 'SUR-02'`);
      if (parseInt(suratCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding distinct inventory products for Surat South Hub (SUR-02)...');
        const suratProducts = [
          {
            supplier: 'Hazchem Safety Equipments Surat',
            name: 'Chemical Foam Fire Ext. 50L Trolley',
            description: 'Heavy duty AFFF foam wheeled mobile extinguisher for petrochemical plants',
            weight: '85 kg',
            category: 'Fire Equipment',
            sub_category: 'Fire Extinguisher',
            pid: 'CF-EXT-50',
            hsn: '8424',
            current_stock: 14,
            min_stock: 5,
            exp_months: 60,
            sale_price: 9912.00,
            gst: 18,
            purchase_price: 8400.00,
            total_without_tax: 117600.00,
            total_with_tax: 138768.00,
            exp_days: 1800,
            status: 'OK'
          },
          {
            supplier: 'Textile Fire Shield Ltd Surat',
            name: 'Heavy Duty Fire Blanket 2x2m Fiberglass',
            description: 'Woven fiberglass fabric heat resistant emergency smothering blanket',
            weight: '1.8 kg',
            category: 'Fire Equipment',
            sub_category: 'Industrial Safety',
            pid: 'FB-HVY-2',
            hsn: '7019',
            current_stock: 35,
            min_stock: 15,
            exp_months: 48,
            sale_price: 1475.00,
            gst: 18,
            purchase_price: 1250.00,
            total_without_tax: 43750.00,
            total_with_tax: 51625.00,
            exp_days: 1440,
            status: 'OK'
          },
          {
            supplier: 'Dräger Safety India',
            name: 'Full Face Chemical Gas Mask FFP3',
            description: 'Panoramic polycarbonate mask with dual ABEK1P3 organic vapor canisters',
            weight: '620 g',
            category: 'PPE',
            sub_category: 'Mask',
            pid: 'GM-FFP3',
            hsn: '9020',
            current_stock: 22,
            min_stock: 10,
            exp_months: 36,
            sale_price: 3363.00,
            gst: 18,
            purchase_price: 2850.00,
            total_without_tax: 62700.00,
            total_with_tax: 73986.00,
            exp_days: 1080,
            status: 'OK'
          },
          {
            supplier: 'Tiger Safety Footwear',
            name: 'Chemical Resistant Steel Toe Shoes S3',
            description: 'Acid, alkali & oil resistant nitrile sole with 200J impact steel toe cap',
            weight: '1.2 kg',
            category: 'PPE',
            sub_category: 'Safety Shoes',
            pid: 'CS-BOOT-9',
            hsn: '6403',
            current_stock: 18,
            min_stock: 8,
            exp_months: 24,
            sale_price: 2072.00,
            gst: 12,
            purchase_price: 1850.00,
            total_without_tax: 33300.00,
            total_with_tax: 37296.00,
            exp_days: 720,
            status: 'OK'
          },
          {
            supplier: 'DuPont Personal Protection',
            name: 'Tychem 6000 Hazmat Liquid Suit',
            description: 'Gas-tight chemical protection coverall certified EN 14605 Type 3-B',
            weight: '900 g',
            category: 'PPE',
            sub_category: 'Industrial Safety',
            pid: 'HAZ-TYP3',
            hsn: '6210',
            current_stock: 4,
            min_stock: 10,
            exp_months: 60,
            sale_price: 7168.00,
            gst: 12,
            purchase_price: 6400.00,
            total_without_tax: 25600.00,
            total_with_tax: 28672.00,
            exp_days: 1800,
            status: 'Low'
          }
        ];

        for (const p of suratProducts) {
          await client.query(`
            INSERT INTO product (
              company_id, branch_code, supplier, name, description, weight,
              category, sub_category, pid, hsn, current_stock, min_stock,
              exp_months, sale_price, gst, purchase_price, total_without_tax,
              total_with_tax, exp_days, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (company_id, pid) DO NOTHING;
          `, [
            'comp_mann', 'COMMON', p.supplier, p.name, p.description, p.weight,
            p.category, p.sub_category, p.pid, p.hsn, p.current_stock, p.min_stock,
            p.exp_months, p.sale_price, p.gst, p.purchase_price, p.total_without_tax,
            p.total_with_tax, p.exp_days, p.status
          ]);
        }
        console.log('Seeded distinct inventory products for SUR-02 successfully!');
      }

      // Seed Baroda Branch (BRD-02) under Mann Engineers Fire Safety
      const brdCountRes = await client.query(`SELECT COUNT(*) FROM product WHERE company_id = 'comp_mann' AND branch_code = 'BRD-02'`);
      if (parseInt(brdCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding distinct inventory products for Mann Engineers - Brd-Branch (BRD-02)...');
        const brdProducts = [
          {
            supplier: 'Tyco Fire Protection Products',
            name: 'Pendant Sprinkler Head 68°C Red Bulb',
            description: 'Brass standard response fire sprinkler orifice 1/2 inch NPT thread',
            weight: '120 g',
            category: 'Fire Equipment',
            sub_category: 'Industrial Safety',
            pid: 'SP-HDR-68',
            hsn: '8424',
            current_stock: 85,
            min_stock: 30,
            exp_months: 120,
            sale_price: 767.00,
            gst: 18,
            purchase_price: 650.00,
            total_without_tax: 55250.00,
            total_with_tax: 65195.00,
            exp_days: 3600,
            status: 'OK'
          },
          {
            supplier: 'Newage Fire Fighting Co',
            name: 'Swinging Hose Reel Drum 30m with Nozzle',
            description: 'Wall mounted manual swing type fire hose reel with 19mm braided rubber hose',
            weight: '24 kg',
            category: 'Fire Equipment',
            sub_category: 'Industrial Safety',
            pid: 'HR-SWV-30',
            hsn: '8424',
            current_stock: 8,
            min_stock: 12,
            exp_months: 60,
            sale_price: 7316.00,
            gst: 18,
            purchase_price: 6200.00,
            total_without_tax: 49600.00,
            total_with_tax: 58528.00,
            exp_days: 1800,
            status: 'Low'
          },
          {
            supplier: 'Honeywell Thermal Solutions',
            name: '500°C Heat Resistant Aluminized Gloves',
            description: 'Kevlar backed aluminized radiant heat protection gloves 16 inch length',
            weight: '450 g',
            category: 'PPE',
            sub_category: 'Industrial Safety',
            pid: 'HT-GLV-500',
            hsn: '6116',
            current_stock: 25,
            min_stock: 10,
            exp_months: 36,
            sale_price: 1848.00,
            gst: 12,
            purchase_price: 1650.00,
            total_without_tax: 41250.00,
            total_with_tax: 46200.00,
            exp_days: 1080,
            status: 'OK'
          },
          {
            supplier: 'Schneider Electric Safety',
            name: 'Emergency LED Exit Light 3h Backup',
            description: 'Ceiling/wall mounted green luminaire with Ni-Cd self-contained battery pack',
            weight: '1.1 kg',
            category: 'PPE',
            sub_category: 'Industrial Safety',
            pid: 'EX-LED-BAT',
            hsn: '9405',
            current_stock: 40,
            min_stock: 15,
            exp_months: 60,
            sale_price: 1298.00,
            gst: 18,
            purchase_price: 1100.00,
            total_without_tax: 44000.00,
            total_with_tax: 51920.00,
            exp_days: 1800,
            status: 'OK'
          }
        ];

        for (const p of brdProducts) {
          await client.query(`
            INSERT INTO product (
              company_id, branch_code, supplier, name, description, weight,
              category, sub_category, pid, hsn, current_stock, min_stock,
              exp_months, sale_price, gst, purchase_price, total_without_tax,
              total_with_tax, exp_days, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (company_id, pid) DO UPDATE SET
              name = EXCLUDED.name,
              sale_price = EXCLUDED.sale_price;
          `, [
            'comp_mann', 'BRD-02', p.supplier, p.name, p.description, p.weight,
            p.category, p.sub_category, p.pid, p.hsn, p.current_stock, p.min_stock,
            p.exp_months, p.sale_price, p.gst, p.purchase_price, p.total_without_tax,
            p.total_with_tax, p.exp_days, p.status
          ]);
        }
        console.log('Seeded distinct inventory products for Mann Engineers - BRD-02 successfully!');
      }

      // Seed Mash Tech - And-Branch (AND-01) distinct inventory
      const andCountRes = await client.query(`SELECT COUNT(*) FROM product WHERE company_id = 'comp_mashtech' AND branch_code = 'AND-01'`);
      if (parseInt(andCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding distinct inventory products for Mash Tech - And-Branch (AND-01)...');
        const andProducts = [
          {
            supplier: 'Schneider IT Infrastructure India',
            name: '42U Server Rack Closed Smart Cooling',
            description: 'Perforated front/rear doors with digital temperature monitoring & roof fan unit',
            weight: '115 kg',
            category: 'Server Infrastructure',
            sub_category: 'Racks & Enclosures',
            pid: 'SRV-RCK-42',
            hsn: '8537',
            current_stock: 14,
            min_stock: 5,
            exp_months: 60,
            sale_price: 48500.00,
            gst: 18,
            purchase_price: 41000.00,
            total_without_tax: 574000.00,
            total_with_tax: 677320.00,
            exp_days: 1800,
            status: 'OK'
          },
          {
            supplier: 'APC by Schneider Electric',
            name: '3kVA Online UPS Pure Sine Wave 230V',
            description: 'Double-conversion online UPS with LCD interface and extended runtime battery pack',
            weight: '28 kg',
            category: 'Power Backup',
            sub_category: 'Online UPS',
            pid: 'UPS-3KVA-ON',
            hsn: '8504',
            current_stock: 22,
            min_stock: 8,
            exp_months: 36,
            sale_price: 38200.00,
            gst: 18,
            purchase_price: 32500.00,
            total_without_tax: 715000.00,
            total_with_tax: 843700.00,
            exp_days: 1080,
            status: 'OK'
          },
          {
            supplier: 'Desco ESD Electronics Safety',
            name: 'Anti-Static ESD Grounding Mat 2x1m',
            description: 'Dual layer static dissipative rubber table mat with grounding cord & wrist strap',
            weight: '3.2 kg',
            category: 'Electronic Safety',
            sub_category: 'ESD Protection',
            pid: 'ESD-MAT-01',
            hsn: '3926',
            current_stock: 45,
            min_stock: 15,
            exp_months: 60,
            sale_price: 2450.00,
            gst: 18,
            purchase_price: 2000.00,
            total_without_tax: 90000.00,
            total_with_tax: 106200.00,
            exp_days: 1800,
            status: 'OK'
          },
          {
            supplier: 'D-Link Networking Systems',
            name: '10Gbps Shielded Cat6A Cable Roll 100m',
            description: 'SFTP 23 AWG solid copper 500MHz high speed network cable reel',
            weight: '6.8 kg',
            category: 'Networking',
            sub_category: 'Cables & Patching',
            pid: 'CAT6A-100M',
            hsn: '8544',
            current_stock: 6,
            min_stock: 10,
            exp_months: 120,
            sale_price: 4950.00,
            gst: 18,
            purchase_price: 4200.00,
            total_without_tax: 25200.00,
            total_with_tax: 29736.00,
            exp_days: 3600,
            status: 'Low'
          }
        ];

        for (const p of andProducts) {
          await client.query(`
            INSERT INTO product (
              company_id, branch_code, supplier, name, description, weight,
              category, sub_category, pid, hsn, current_stock, min_stock,
              exp_months, sale_price, gst, purchase_price, total_without_tax,
              total_with_tax, exp_days, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (company_id, pid) DO UPDATE SET
              name = EXCLUDED.name,
              sale_price = EXCLUDED.sale_price;
          `, [
            'comp_mashtech', 'AND-01', p.supplier, p.name, p.description, p.weight,
            p.category, p.sub_category, p.pid, p.hsn, p.current_stock, p.min_stock,
            p.exp_months, p.sale_price, p.gst, p.purchase_price, p.total_without_tax,
            p.total_with_tax, p.exp_days, p.status
          ]);
        }
        console.log('Seeded distinct inventory products for Mash Tech - AND-01 successfully!');
      }

      // Seed Mash Tech - Sru-Branch (SRU-02) distinct inventory
      const sruCountRes = await client.query(`SELECT COUNT(*) FROM product WHERE company_id = 'comp_mashtech' AND branch_code = 'SRU-02'`);
      if (parseInt(sruCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding distinct inventory products for Mash Tech - Sru-Branch (SRU-02)...');
        const sruProducts = [
          {
            supplier: 'Fortinet Enterprise Security',
            name: '10Gbps Enterprise Next-Gen Firewall Gateway',
            description: 'Multi-threat security appliance with hardware accelerated SSL inspection & IPS',
            weight: '7.5 kg',
            category: 'Network Security',
            sub_category: 'Firewall Hardware',
            pid: 'FW-GW-10G',
            hsn: '8517',
            current_stock: 12,
            min_stock: 4,
            exp_months: 60,
            sale_price: 94500.00,
            gst: 18,
            purchase_price: 81000.00,
            total_without_tax: 972000.00,
            total_with_tax: 1146960.00,
            exp_days: 1800,
            status: 'OK'
          },
          {
            supplier: 'Cisco Systems Optical Division',
            name: '10G SFP+ Optical Transceiver Module 10km',
            description: '1310nm Single-Mode Fiber LC connector transceiver hot-swappable',
            weight: '35 g',
            category: 'Networking',
            sub_category: 'Fiber Optics',
            pid: 'FBR-SFP-10',
            hsn: '8517',
            current_stock: 55,
            min_stock: 20,
            exp_months: 60,
            sale_price: 3650.00,
            gst: 18,
            purchase_price: 3100.00,
            total_without_tax: 170500.00,
            total_with_tax: 201190.00,
            exp_days: 1800,
            status: 'OK'
          },
          {
            supplier: 'Thorlabs Laser Safety Products',
            name: 'Optical Fiber Laser Safety Protective Goggles',
            description: 'Polycarbonate laser alignment eyewear certified OD7+ @ 800-1100nm',
            weight: '90 g',
            category: 'Optical Safety',
            sub_category: 'Laser PPE',
            pid: 'LSR-SFT-GLS',
            hsn: '9004',
            current_stock: 18,
            min_stock: 8,
            exp_months: 48,
            sale_price: 5800.00,
            gst: 18,
            purchase_price: 4900.00,
            total_without_tax: 88200.00,
            total_with_tax: 104076.00,
            exp_days: 1440,
            status: 'OK'
          },
          {
            supplier: 'Raritan Power Distribution',
            name: 'Smart Metered Rack PDU 16A 230V 24 Outlets',
            description: '0U vertical rack power distribution unit with Ethernet remote power monitoring',
            weight: '4.8 kg',
            category: 'Power Backup',
            sub_category: 'PDU Hardware',
            pid: 'RACK-PDU-16',
            hsn: '8537',
            current_stock: 9,
            min_stock: 5,
            exp_months: 60,
            sale_price: 18500.00,
            gst: 18,
            purchase_price: 15600.00,
            total_without_tax: 140400.00,
            total_with_tax: 165672.00,
            exp_days: 1800,
            status: 'OK'
          }
        ];

        for (const p of sruProducts) {
          await client.query(`
            INSERT INTO product (
              company_id, branch_code, supplier, name, description, weight,
              category, sub_category, pid, hsn, current_stock, min_stock,
              exp_months, sale_price, gst, purchase_price, total_without_tax,
              total_with_tax, exp_days, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (company_id, pid) DO UPDATE SET
              name = EXCLUDED.name,
              sale_price = EXCLUDED.sale_price;
          `, [
            'comp_mashtech', 'SRU-02', p.supplier, p.name, p.description, p.weight,
            p.category, p.sub_category, p.pid, p.hsn, p.current_stock, p.min_stock,
            p.exp_months, p.sale_price, p.gst, p.purchase_price, p.total_without_tax,
            p.total_with_tax, p.exp_days, p.status
          ]);
        }
        console.log('Seeded distinct inventory products for Mash Tech - SRU-02 successfully!');
      }

      // ── Seed Multi-Tenant Users & Employees (Mann Engineers Fire Safety & Mash Tech) ──
      console.log('Seeding & syncing multi-tenant users and employee records into PostgreSQL...');
      const demoUsers = [
        // Mann Engineers Fire Safety - HQ
        {
          user_id: 'USR-MANN-ADMIN',
          username: 'admin_mann',
          email: 'admin@a.1.com',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Mann Engineers Admin',
          role: 'TENANT_OWNER',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: '*',
          branch_name: 'All Branches (Master HQ)',
          phone: '+91 98250 11001',
          designation: 'Managing Director & Platform Owner',
          department: 'Executive Board',
          salary: 125000,
          joining_date: '2022-01-01'
        },
        // Mann Engineers - AMD-01
        {
          user_id: 'USR-MANN-AMD',
          username: 'amd_branch',
          email: 'branch@b.1.com',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Amd-Branch Manager',
          role: 'BRANCH_MANAGER',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: 'AMD-01',
          branch_name: 'Amd-Branch (Ahmedabad)',
          phone: '+91 98251 22002',
          designation: 'General Branch Manager',
          department: 'Branch Operations',
          salary: 68000,
          joining_date: '2023-03-15'
        },
        {
          user_id: 'USR-MANN-AMD-02',
          username: 'kishan_sales',
          email: 'kishan.sales@mannengineers.in',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Kishan Panchal',
          role: 'STAFF',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: 'AMD-01',
          branch_name: 'Amd-Branch (Ahmedabad)',
          phone: '+91 98251 33003',
          designation: 'Senior POS & Counter Sales Officer',
          department: 'Sales & Billing',
          salary: 38000,
          joining_date: '2023-08-01'
        },
        {
          user_id: 'USR-MANN-AMD-03',
          username: 'mahesh_stock',
          email: 'mahesh.stock@mannengineers.in',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Mahesh Solanki',
          role: 'STAFF',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: 'AMD-01',
          branch_name: 'Amd-Branch (Ahmedabad)',
          phone: '+91 98251 44004',
          designation: 'Inventory & Logistics Supervisor',
          department: 'Warehouse & Stores',
          salary: 35000,
          joining_date: '2023-11-10'
        },

        // Mann Engineers - BRD-02
        {
          user_id: 'USR-MANN-BRD',
          username: 'brd_branch',
          email: 'branch@b.2.com',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Brd-Branch Manager',
          role: 'BRANCH_MANAGER',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: 'BRD-02',
          branch_name: 'Brd-Branch (Baroda)',
          phone: '+91 98252 55005',
          designation: 'Regional Branch Manager',
          department: 'Branch Operations',
          salary: 65000,
          joining_date: '2023-05-20'
        },
        {
          user_id: 'USR-MANN-BRD-02',
          username: 'bhavik_tech',
          email: 'bhavik.tech@mannengineers.in',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Bhavik Dave',
          role: 'STAFF',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: 'BRD-02',
          branch_name: 'Brd-Branch (Baroda)',
          phone: '+91 98252 66006',
          designation: 'Senior Safety Systems Technician',
          department: 'Technical Services',
          salary: 40000,
          joining_date: '2024-01-15'
        },
        {
          user_id: 'USR-MANN-BRD-03',
          username: 'pooja_cashier',
          email: 'pooja.cashier@mannengineers.in',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Pooja Sharma',
          role: 'STAFF',
          company_id: 'comp_mann',
          company_name: 'Mann Engineers Fire Safety',
          branch_code: 'BRD-02',
          branch_name: 'Brd-Branch (Baroda)',
          phone: '+91 98252 77007',
          designation: 'Accounts & Billing Cashier',
          department: 'Finance & Accounts',
          salary: 32000,
          joining_date: '2024-03-01'
        },

        // Mash Tech
        {
          user_id: 'USR-MASH-ADMIN',
          username: 'admin_mash',
          email: 'admin@a.2.com',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Mash Tech Admin',
          role: 'TENANT_OWNER',
          company_id: 'comp_mashtech',
          company_name: 'Mash Tech',
          branch_code: '*',
          branch_name: 'All Branches (Tech HQ)',
          phone: '+91 98253 88008',
          designation: 'Executive Director',
          department: 'Executive Board',
          salary: 110000,
          joining_date: '2022-06-01'
        },
        {
          user_id: 'USR-MASH-AND',
          username: 'and_branch',
          email: 'branch@b.3.com',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'And-Branch Manager',
          role: 'BRANCH_MANAGER',
          company_id: 'comp_mashtech',
          company_name: 'Mash Tech',
          branch_code: 'AND-01',
          branch_name: 'And-Branch (Anand)',
          phone: '+91 98253 99009',
          designation: 'Branch Head',
          department: 'Branch Operations',
          salary: 62000,
          joining_date: '2023-07-01'
        },
        {
          user_id: 'USR-MASH-SRU',
          username: 'sru_branch',
          email: 'branch@b.4.com',
          password_hash: bcrypt.hashSync('Pass@123', 10),
          name: 'Sru-Branch Manager',
          role: 'BRANCH_MANAGER',
          company_id: 'comp_mashtech',
          company_name: 'Mash Tech',
          branch_code: 'SRU-02',
          branch_name: 'Sru-Branch (Surat)',
          phone: '+91 98254 00010',
          designation: 'Branch Head',
          department: 'Branch Operations',
          salary: 64000,
          joining_date: '2023-09-10'
        }
      ];

      for (const u of demoUsers) {
        await client.query(`
          INSERT INTO users (
            user_id, username, email, password_hash, name, role, company_id, company_name,
            branch_code, branch_name, phone, designation, department, salary, joining_date
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            company_id = EXCLUDED.company_id,
            company_name = EXCLUDED.company_name,
            branch_code = EXCLUDED.branch_code,
            branch_name = EXCLUDED.branch_name,
            phone = EXCLUDED.phone,
            designation = EXCLUDED.designation,
            department = EXCLUDED.department,
            salary = EXCLUDED.salary;
        `, [
          u.user_id, u.username, u.email, u.password_hash, u.name, u.role,
          u.company_id, u.company_name, u.branch_code, u.branch_name,
          u.phone, u.designation, u.department, u.salary, u.joining_date
        ]);
      }
      console.log('Seeded and verified all multi-tenant users and employees successfully into PostgreSQL!');

      // Seed initial customers if empty
      const custCountRes = await client.query(`SELECT COUNT(*) FROM customers`);
      if (parseInt(custCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding initial customers into PostgreSQL "customers" table...');
        const initialCustomers = [
          { uid: 'OC-001', company: 'Rajkot Heavy Industries Ltd', name: 'Rajesh Patel', phone: '9825012345', email: 'purchase@rajkotind.com', address: 'Plot 42, GIDC Lodhika, Rajkot, Gujarat', gstin: '24AAACR1234F1Z5' },
          { uid: 'OC-002', company: 'Ahmedabad Chemical Works', name: 'Pravin Shah', phone: '9879054321', email: 'accounts@ahmedabadchem.com', address: 'Phase 2, Vatva Industrial Estate, Ahmedabad', gstin: '24AABCA5678B1Z2' },
          { uid: 'OC-003', company: 'Reliance Jamnagar Complex', name: 'Vikram Mehta', phone: '9909011223', email: 'v.mehta@rilprocurement.com', address: 'Moti Khavdi, Jamnagar, Gujarat', gstin: '24AABCR0001R1Z9' },
          { uid: 'OC-004', company: 'L&T Construction Hazira', name: 'Sanjay Desai', phone: '9824099887', email: 'safety.hazira@larsentoubro.com', address: 'Hazira Manufacturing Complex, Surat, Gujarat', gstin: '24AAACL0123L1Z4' },
          { uid: 'OC-005', company: 'Adani Ports & SEZ Mundra', name: 'Amit Joshi', phone: '9925044556', email: 'procurement@adani.com', address: 'Navinal Island, Mundra, Kutch, Gujarat', gstin: '24AABCA9988A1Z7' },
          { uid: 'OC-006', company: 'Walk-in Retail Customer', name: 'Retail Walk-in', phone: '9876543210', email: 'counter@mannengineers.in', address: 'Counter Sales, Ahmedabad Central', gstin: 'URP' }
        ];

        for (const c of initialCustomers) {
          await client.query(`
            INSERT INTO customers (uid, company, name, phone, email, address, gstin)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (uid) DO NOTHING;
          `, [c.uid, c.company, c.name, c.phone, c.email, c.address, c.gstin]);
        }
        console.log('Seeded initial customers successfully into PostgreSQL!');
      }

      // Seed initial invoices if empty
      const invCountRes = await client.query(`SELECT COUNT(*) FROM invoices`);
      if (parseInt(invCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding initial invoices into PostgreSQL "invoices" table...');
        const initialInvoices = [
          {
            invoice_no: '1',
            branch_code: 'AMD-01',
            customer_uid: 'OC-001',
            customer_name: 'Rajkot Heavy Industries Ltd',
            contact_person: 'Rajesh Patel',
            customer_phone: '9825012345',
            customer_email: 'purchase@rajkotind.com',
            customer_address: 'Plot 42, GIDC Lodhika, Rajkot, Gujarat',
            customer_gstin: '24AAACR1234F1Z5',
            invoice_date: new Date(),
            due_date: new Date(Date.now() + 15 * 86400000),
            followup_by: 'Manoj Parmar',
            reference_no: 'PO-RHI-9812',
            revision_no: '1',
            total_items: 2,
            subtotal: 9971.00,
            total_tax: 1794.78,
            discount_amount: 0.00,
            round_off: 0.22,
            grand_total: 11766.00,
            payment_mode: 'Cash',
            status: 'Posted',
            quote_remark: 'Delivered at site with ISI test certificate.',
            terms_conditions: '• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n• GST: Extra as applicable (presently 18% or as defined per item).\n• Payment: 100% against delivery.',
            items: [
              { item_code: 'FE-ABC-4', item_name: 'ABC Dry Powder Fire Ext. 4kg', unit: 'NOS', hsn_code: '8424', qty: 5, unit_price: 1321.60, discount: 0, effective_price: 1321.60, tax_rate: 18, tax_amount: 1189.44, subtotal: 6608.00, remark: 'Bay A Rack 02' },
              { item_code: 'SH-M201', item_name: 'Safety Helmet M-201 ISI', unit: 'NOS', hsn_code: '6506', qty: 10, unit_price: 336.30, discount: 0, effective_price: 336.30, tax_rate: 18, tax_amount: 605.34, subtotal: 3363.00, remark: 'Yellow Industrial' }
            ]
          },
          {
            invoice_no: '2',
            branch_code: 'AMD-01',
            customer_uid: 'OC-002',
            customer_name: 'Ahmedabad Chemical Works',
            contact_person: 'Pravin Shah',
            customer_phone: '9879054321',
            customer_email: 'accounts@ahmedabadchem.com',
            customer_address: 'Phase 2, Vatva Industrial Estate, Ahmedabad',
            customer_gstin: '24AABCA5678B1Z2',
            invoice_date: new Date(),
            due_date: new Date(Date.now() + 30 * 86400000),
            followup_by: 'Bhavin Patel',
            reference_no: 'REQ-ACW-440',
            revision_no: '1',
            total_items: 1,
            subtotal: 5782.00,
            total_tax: 1040.76,
            discount_amount: 0.00,
            round_off: 0.24,
            grand_total: 6823.00,
            payment_mode: 'UPI',
            status: 'Posted',
            quote_remark: 'Annual maintenance replacement contract.',
            terms_conditions: '• Price: Ex-works Halol.\n• GST: 18% extra.',
            items: [
              { item_code: 'FE-CO2-2', item_name: 'CO2 Fire Extinguisher 2kg', unit: 'NOS', hsn_code: '8424', qty: 2, unit_price: 2891.00, discount: 0, effective_price: 2891.00, tax_rate: 18, tax_amount: 1040.76, subtotal: 5782.00, remark: 'CO2 Wheel Horn' }
            ]
          },
          {
            invoice_no: '3',
            branch_code: 'AMD-01',
            customer_uid: 'OC-006',
            customer_name: 'Walk-in Retail Customer',
            contact_person: 'Retail Buyer',
            customer_phone: '9876543210',
            customer_email: 'counter@mannengineers.in',
            customer_address: 'Counter Sales, Ahmedabad Central',
            customer_gstin: 'URP',
            invoice_date: new Date(),
            due_date: new Date(),
            followup_by: 'Counter Staff',
            reference_no: 'WALK-092',
            revision_no: '1',
            total_items: 1,
            subtotal: 1321.60,
            total_tax: 237.89,
            discount_amount: 0.00,
            round_off: -0.49,
            grand_total: 1559.00,
            payment_mode: 'Cash',
            status: 'Posted',
            quote_remark: 'Immediate counter checkout.',
            terms_conditions: '• Warranty: 1 year manufacturer warranty.',
            items: [
              { item_code: 'FE-ABC-4', item_name: 'ABC Dry Powder Fire Ext. 4kg', unit: 'NOS', hsn_code: '8424', qty: 1, unit_price: 1321.60, discount: 0, effective_price: 1321.60, tax_rate: 18, tax_amount: 237.89, subtotal: 1321.60, remark: 'Retail' }
            ]
          }
        ];

        for (const inv of initialInvoices) {
          const invRes = await client.query(`
            INSERT INTO invoices (
              invoice_no, branch_code, customer_uid, customer_name, contact_person,
              customer_phone, customer_email, customer_address, customer_gstin,
              invoice_date, due_date, followup_by, reference_no, revision_no,
              total_items, subtotal, total_tax, discount_amount, round_off,
              grand_total, payment_mode, status, quote_remark, terms_conditions
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
            ON CONFLICT (company_id, branch_code, invoice_no) DO NOTHING
            RETURNING id;
          `, [
            inv.invoice_no, inv.branch_code, inv.customer_uid, inv.customer_name, inv.contact_person,
            inv.customer_phone, inv.customer_email, inv.customer_address, inv.customer_gstin,
            inv.invoice_date, inv.due_date, inv.followup_by, inv.reference_no, inv.revision_no,
            inv.total_items, inv.subtotal, inv.total_tax, inv.discount_amount, inv.round_off,
            inv.grand_total, inv.payment_mode, inv.status, inv.quote_remark, inv.terms_conditions
          ]);

          if (invRes.rows.length > 0 && inv.items) {
            const invoiceId = invRes.rows[0].id;
            for (const item of inv.items) {
              await client.query(`
                INSERT INTO invoice_items (
                  invoice_id, invoice_no, item_code, item_name, unit, hsn_code,
                  qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
              `, [
                invoiceId, inv.invoice_no, item.item_code, item.item_name, item.unit, item.hsn_code,
                item.qty, item.unit_price, item.discount, item.effective_price, item.tax_rate, item.tax_amount, item.subtotal, item.remark
              ]);
            }
          }
        }
        console.log('Seeded initial invoices successfully into PostgreSQL!');
      }

      // Seed initial purchases if empty
      const poCountRes = await client.query(`SELECT COUNT(*) FROM purchases`);
      if (parseInt(poCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding initial purchases into PostgreSQL "purchases" table...');
        const initialPurchases = [
          {
            po_no: '1',
            company_id: 'comp_mann',
            branch_code: 'AMD-01',
            supplier_uid: 'SUP-001',
            supplier_name: 'National Fire Equip Pvt Ltd',
            contact_person: 'Suresh Mehta',
            supplier_phone: '9825123456',
            supplier_email: 'sales@nationalfire.in',
            supplier_address: 'Plot 12, GIDC Halol Industrial Area, Panchmahal, Gujarat',
            supplier_gstin: '24AABCN1234E1Z1',
            po_date: new Date(Date.now() - 5 * 86400000),
            due_date: new Date(Date.now() + 25 * 86400000),
            delivery_date: new Date(Date.now() + 2 * 86400000),
            reference_no: 'REQ-PO-0128',
            revision_no: '1',
            total_items: 2,
            subtotal: 123389.83,
            total_tax: 22210.17,
            discount_amount: 0.00,
            round_off: 0.00,
            grand_total: 145600.00,
            payment_terms: 'Credit 30 Days',
            status: 'GRN Done',
            grn_no: 'GRN-0981',
            po_remark: 'Bulk stock replenishment for Q4.',
            terms_conditions: '• Delivery within 3 business days.\n• Packing and freight included.\n• 100% replacement warranty on transit defects.',
            items: [
              { item_code: 'FE-ABC-4', item_name: 'ABC Dry Powder Fire Ext. 4kg', unit: 'NOS', hsn_code: '8424', qty: 100, unit_price: 1120.00, discount: 0, effective_price: 1120.00, tax_rate: 18, tax_amount: 20160.00, subtotal: 112000.00, remark: 'Main warehouse' },
              { item_code: 'SH-M201', item_name: 'Safety Helmet M-201 ISI', unit: 'NOS', hsn_code: '6506', qty: 50, unit_price: 227.80, discount: 0, effective_price: 227.80, tax_rate: 18, tax_amount: 2050.20, subtotal: 11390.00, remark: 'Yellow Industrial' }
            ]
          },
          {
            po_no: '2',
            company_id: 'comp_mann',
            branch_code: 'AMD-01',
            supplier_uid: 'SUP-002',
            supplier_name: 'SafeGuard Industries',
            contact_person: 'Kiran Parmar',
            supplier_phone: '9879123456',
            supplier_email: 'orders@safeguard.com',
            supplier_address: 'Sector 4, Gandhinagar Industrial Zone, Gujarat',
            supplier_gstin: '24AAECS9876G1Z3',
            po_date: new Date(Date.now() - 8 * 86400000),
            due_date: new Date(Date.now() + 7 * 86400000),
            delivery_date: new Date(Date.now() - 1 * 86400000),
            reference_no: 'REQ-PO-0127',
            revision_no: '1',
            total_items: 1,
            subtotal: 57457.63,
            total_tax: 10342.37,
            discount_amount: 0.00,
            round_off: 0.00,
            grand_total: 67800.00,
            payment_terms: '15 Days',
            status: 'Ordered',
            grn_no: '',
            po_remark: 'CO2 cylinders safety stock order.',
            terms_conditions: '• Direct site delivery with test certificates.\n• GST extra as applicable.',
            items: [
              { item_code: 'FE-CO2-2', item_name: 'CO2 Fire Extinguisher 2kg', unit: 'NOS', hsn_code: '8424', qty: 25, unit_price: 2298.30, discount: 0, effective_price: 2298.30, tax_rate: 18, tax_amount: 10342.35, subtotal: 57457.50, remark: 'Wheel horn assembly' }
            ]
          },
          {
            po_no: '3',
            company_id: 'comp_mann',
            branch_code: 'AMD-01',
            supplier_uid: 'SUP-003',
            supplier_name: 'Hindustan Safety Works',
            contact_person: 'Ramesh Vaghela',
            supplier_phone: '9824987654',
            supplier_email: 'info@hindustansafety.com',
            supplier_address: 'Phase 1, Naroda GIDC, Ahmedabad, Gujarat',
            supplier_gstin: '24AAACH5432K1Z9',
            po_date: new Date(Date.now() - 9 * 86400000),
            due_date: new Date(Date.now() + 15 * 86400000),
            delivery_date: new Date(Date.now()),
            reference_no: 'REQ-PO-0126',
            revision_no: '1',
            total_items: 1,
            subtotal: 19830.51,
            total_tax: 3569.49,
            discount_amount: 0.00,
            round_off: 0.00,
            grand_total: 23400.00,
            payment_terms: 'Immediate / Cash',
            status: 'Ordered',
            grn_no: '',
            po_remark: 'Counter stock immediate procurement.',
            terms_conditions: '• Standard manufacturing warranty applicable.',
            items: [
              { item_code: 'SH-M201', item_name: 'Safety Helmet M-201 ISI', unit: 'NOS', hsn_code: '6506', qty: 100, unit_price: 198.31, discount: 0, effective_price: 198.31, tax_rate: 18, tax_amount: 3569.58, subtotal: 19831.00, remark: 'Standard packing' }
            ]
          }
        ];

        for (const po of initialPurchases) {
          const poRes = await client.query(`
            INSERT INTO purchases (
              company_id, po_no, branch_code, supplier_uid, supplier_name, contact_person,
              supplier_phone, supplier_email, supplier_address, supplier_gstin,
              po_date, due_date, delivery_date, reference_no, revision_no,
              total_items, subtotal, total_tax, discount_amount, round_off,
              grand_total, payment_terms, status, grn_no, po_remark, terms_conditions
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
            ON CONFLICT (company_id, branch_code, po_no) DO NOTHING
            RETURNING id;
          `, [
            po.company_id, po.po_no, po.branch_code, po.supplier_uid, po.supplier_name, po.contact_person,
            po.supplier_phone, po.supplier_email, po.supplier_address, po.supplier_gstin,
            po.po_date, po.due_date, po.delivery_date, po.reference_no, po.revision_no,
            po.total_items, po.subtotal, po.total_tax, po.discount_amount, po.round_off,
            po.grand_total, po.payment_terms, po.status, po.grn_no, po.po_remark, po.terms_conditions
          ]);

          if (poRes.rows.length > 0 && po.items) {
            const purchaseId = poRes.rows[0].id;
            for (const item of po.items) {
              await client.query(`
                INSERT INTO purchase_items (
                  purchase_id, po_no, item_code, item_name, unit, hsn_code,
                  qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
              `, [
                purchaseId, po.po_no, item.item_code, item.item_name, item.unit, item.hsn_code,
                item.qty, item.unit_price, item.discount, item.effective_price, item.tax_rate, item.tax_amount, item.subtotal, item.remark
              ]);
            }
          }
        }
        console.log('Seeded initial purchases successfully into PostgreSQL!');
      }

      // Seed initial cash_book entries if empty
      const cbCountRes = await client.query(`SELECT COUNT(*) FROM cash_book`);
      if (parseInt(cbCountRes.rows[0].count, 10) === 0) {
        console.log('Seeding initial cash book entries into PostgreSQL "cash_book" table...');
        const initialCashEntries = [
          { entry_no: '1', company_id: 'comp_mann', branch_code: 'AMD-01', entry_date: new Date(Date.now() - 4 * 86400000), type: 'Receipt', party: 'Gujarat Fire Services', category: 'Counter Sales', ref_no: 'REC-0410', narration: 'Cash sale Invoice #3', dr_amount: 8500, cr_amount: 0, balance: 53700, payment_mode: 'Cash', reconciled: true },
          { entry_no: '2', company_id: 'comp_mann', branch_code: 'AMD-01', entry_date: new Date(Date.now() - 3 * 86400000), type: 'Payment', party: 'Courier Service', category: 'Office Expenses', ref_no: 'PAY-0230', narration: 'Delivery charges for urgent dispatch', dr_amount: 0, cr_amount: 750, balance: 52950, payment_mode: 'Cash', reconciled: true },
          { entry_no: '3', company_id: 'comp_mann', branch_code: 'AMD-01', entry_date: new Date(Date.now() - 2 * 86400000), type: 'Receipt', party: 'ABC Safety Pvt Ltd', category: 'Customer Payment', ref_no: 'REC-0411', narration: 'Part payment against Invoice #1', dr_amount: 15000, cr_amount: 0, balance: 67950, payment_mode: 'Cash', reconciled: true },
          { entry_no: '4', company_id: 'comp_mann', branch_code: 'AMD-01', entry_date: new Date(Date.now() - 1 * 86400000), type: 'Contra', party: 'HDFC Bank A/c', category: 'Bank Deposit', ref_no: 'CTR-0089', narration: 'Excess cash deposited to bank account', dr_amount: 0, cr_amount: 25000, balance: 42950, payment_mode: 'Bank Transfer', reconciled: true },
          { entry_no: '5', company_id: 'comp_mann', branch_code: 'AMD-01', entry_date: new Date(), type: 'Payment', party: 'Stationery Mart', category: 'Supplies', ref_no: 'PAY-0231', narration: 'Office stationery and bill books', dr_amount: 0, cr_amount: 1200, balance: 41750, payment_mode: 'Cash', reconciled: true },
          { entry_no: '6', company_id: 'comp_mann', branch_code: 'AMD-01', entry_date: new Date(), type: 'Receipt', party: 'Walk-in Customer', category: 'Counter Sales', ref_no: 'REC-0412', narration: 'Counter sale Invoice #5', dr_amount: 12450, cr_amount: 0, balance: 54200, payment_mode: 'Cash', reconciled: true }
        ];

        for (const entry of initialCashEntries) {
          await client.query(`
            INSERT INTO cash_book (
              company_id, branch_code, entry_no, entry_date, type, party,
              category, ref_no, narration, dr_amount, cr_amount, balance,
              payment_mode, reconciled
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (company_id, branch_code, entry_no) DO NOTHING;
          `, [
            entry.company_id, entry.branch_code, entry.entry_no, entry.entry_date, entry.type, entry.party,
            entry.category, entry.ref_no, entry.narration, entry.dr_amount, entry.cr_amount, entry.balance,
            entry.payment_mode, entry.reconciled
          ]);
        }
        console.log('Seeded initial cash book entries successfully into PostgreSQL!');
      }
    } finally {
      client.release();
    }

    // Auto-verify and migrate Financials, COA, Periods & Loss Prevention tables
    try {
      const { migrateFinancialsAndLossPrevention } = require('./migrate_financials_and_loss_prevention');
      await migrateFinancialsAndLossPrevention();
    } catch (migErr) {
      console.warn('Financials migration note:', migErr.message);
    }
  } catch (err) {
    console.error('Error during PostgreSQL table init:', err.message);
  }
}

// Convert DB row (snake_case) to client model (camelCase)
function formatProductRow(r) {
  const currentStock = parseFloat(r.current_stock) || 0;
  const minStock = parseFloat(r.min_stock) || 10;
  const expMonths = parseFloat(r.exp_months) || 0;
  const salePrice = parseFloat(r.sale_price) || 0;
  const gst = parseFloat(r.gst) || 0;
  const purchasePrice = parseFloat(r.purchase_price) || 0;
  const totalWithoutTax = parseFloat(r.total_without_tax) || 0;
  const totalWithTax = parseFloat(r.total_with_tax) || 0;
  const expDays = parseInt(r.exp_days, 10) || 0;

  return {
    id: r.id,
    companyId: r.company_id || 'comp_mann',
    branchCode: r.branch_code,
    supplier: r.supplier || '',
    name: r.name,
    description: r.description || '',
    weight: r.weight || '',
    category: r.category || 'General',
    subCategory: r.sub_category || 'General',
    pid: r.pid,
    barcode: r.barcode || r.pid || '',
    hsn: r.hsn || '',
    currentStock,
    minStock,
    expMonths,
    salePrice,
    gst,
    purchasePrice,
    totalWithoutTax,
    totalWithTax,
    expDays,
    status: r.status || 'OK',
    sku: r.pid,
    qty: currentStock,
    reorder: minStock,
    cost: `₹${purchasePrice.toLocaleString('en-IN')}`,
    value: `₹${totalWithoutTax.toLocaleString('en-IN')}`
  };
}

// Fetch all common catalog products with branch-specific stock quantity
async function getProductsByBranch(companyId = 'comp_mann', branchCode = 'AMD-01') {
  let res;
  if (!branchCode || branchCode === '*' || branchCode === 'ALL') {
    // Enterprise Owner view: all common items with aggregated company stock
    res = await pool.query(`
      SELECT 
        p.id,
        p.company_id,
        'ALL' as branch_code,
        p.supplier,
        p.name,
        p.description,
        p.weight,
        p.category,
        p.sub_category,
        p.pid,
        p.barcode,
        p.hsn,
        COALESCE(SUM(bs.current_stock), p.current_stock, 0) as current_stock,
        p.min_stock,
        p.exp_months,
        p.sale_price,
        p.gst,
        p.purchase_price,
        ROUND(COALESCE(SUM(bs.current_stock), p.current_stock, 0) * p.purchase_price, 2) as total_without_tax,
        ROUND(COALESCE(SUM(bs.current_stock), p.current_stock, 0) * p.sale_price, 2) as total_with_tax,
        p.exp_days,
        CASE 
          WHEN COALESCE(SUM(bs.current_stock), p.current_stock, 0) <= 0 THEN 'Out'
          WHEN COALESCE(SUM(bs.current_stock), p.current_stock, 0) <= p.min_stock THEN 'Low'
          ELSE 'OK'
        END as status,
        p.created_at,
        p.updated_at
      FROM product p
      LEFT JOIN branch_stock bs ON bs.company_id = p.company_id AND bs.pid = p.pid
      WHERE p.company_id = $1
      GROUP BY p.id, p.company_id, p.supplier, p.name, p.description, p.weight, p.category, p.sub_category, p.pid, p.barcode, p.hsn, p.min_stock, p.exp_months, p.sale_price, p.gst, p.purchase_price, p.exp_days, p.created_at, p.updated_at, p.current_stock
      ORDER BY p.id ASC;
    `, [companyId]);
  } else {
    // Branch view: ALL common company items, with THIS branch's specific stock quantity!
    res = await pool.query(`
      SELECT 
        p.id,
        p.company_id,
        $2 as branch_code,
        p.supplier,
        p.name,
        p.description,
        p.weight,
        p.category,
        p.sub_category,
        p.pid,
        p.barcode,
        p.hsn,
        COALESCE(bs.current_stock, 0) as current_stock,
        COALESCE(bs.min_stock, p.min_stock, 10) as min_stock,
        p.exp_months,
        p.sale_price,
        p.gst,
        p.purchase_price,
        ROUND(COALESCE(bs.current_stock, 0) * p.purchase_price, 2) as total_without_tax,
        ROUND(COALESCE(bs.current_stock, 0) * p.sale_price, 2) as total_with_tax,
        p.exp_days,
        CASE 
          WHEN COALESCE(bs.current_stock, 0) <= 0 THEN 'Out'
          WHEN COALESCE(bs.current_stock, 0) <= COALESCE(bs.min_stock, p.min_stock, 10) THEN 'Low'
          ELSE 'OK'
        END as status,
        p.created_at,
        COALESCE(bs.updated_at, p.updated_at) as updated_at
      FROM product p
      LEFT JOIN branch_stock bs 
        ON bs.company_id = p.company_id 
        AND bs.pid = p.pid 
        AND bs.branch_code = $2
      WHERE p.company_id = $1
      ORDER BY p.id ASC;
    `, [companyId, branchCode]);
  }
  return (res.rows || []).map(formatProductRow);
}

// Fetch all individual branch stocks across all branches of a company
async function getNetworkBranchStock(companyId = 'comp_mann') {
  const res = await pool.query(`
    SELECT 
      bs.id,
      p.company_id,
      b.code as branch_code,
      b.code as "branchCode",
      p.pid,
      p.pid as sku,
      COALESCE(bs.current_stock, 0) as current_stock,
      COALESCE(bs.current_stock, 0) as "currentStock",
      COALESCE(bs.min_stock, p.min_stock, 10) as min_stock,
      COALESCE(bs.min_stock, 10) as "minStock",
      COALESCE(bs.status, CASE WHEN COALESCE(bs.current_stock, 0) <= 0 THEN 'Out' ELSE 'OK' END) as status,
      p.name,
      p.category,
      p.sale_price,
      p.purchase_price
    FROM product p
    CROSS JOIN branches b
    LEFT JOIN branch_stock bs 
      ON bs.pid = p.pid 
      AND bs.company_id = p.company_id 
      AND bs.branch_code = b.code
    WHERE p.company_id = $1::varchar AND b.company_id = $1::varchar
    ORDER BY b.code ASC, p.pid ASC;
  `, [companyId]);
  return res.rows;
}

// Fetch top 4 selling products with sales metrics and gross rate
async function getTopSellingProducts(companyId = 'comp_mann', branchCode = null) {
  try {
    const res = await pool.query(`
      SELECT 
        p.pid, 
        p.name, 
        p.category, 
        p.sub_category as "subCategory", 
        COALESCE(p.sale_price, 0) as "salePrice", 
        COALESCE(p.purchase_price, 0) as "purchasePrice", 
        COALESCE(
          (SELECT bs.current_stock FROM branch_stock bs WHERE bs.pid = p.pid AND bs.company_id = p.company_id AND ($2::text IS NULL OR bs.branch_code = $2) LIMIT 1),
          p.current_stock, 
          0
        ) as "currentStock", 
        COALESCE(p.min_stock, 10) as "minStock", 
        p.company_id as "companyId",
        COALESCE(SUM(ii.qty), 0) AS "unitsSold",
        COALESCE(SUM(ii.subtotal), 0) AS "totalRevenue"
      FROM product p 
      LEFT JOIN invoice_items ii ON p.pid = ii.item_code 
      WHERE ($1::text IS NULL OR p.company_id = $1)
      GROUP BY p.pid, p.name, p.category, p.sub_category, p.sale_price, p.purchase_price, p.current_stock, p.min_stock, p.company_id
      ORDER BY "unitsSold" DESC, "totalRevenue" DESC, "salePrice" DESC 
      LIMIT 4;
    `, [companyId, branchCode || null]);

    let results = (res.rows || []).map(r => ({
      ...r,
      salePrice: parseFloat(r.salePrice) || 0,
      purchasePrice: parseFloat(r.purchasePrice) || 0,
      currentStock: parseFloat(r.currentStock) || 0,
      unitsSold: parseInt(r.unitsSold, 10) || 0,
      totalRevenue: parseFloat(r.totalRevenue) || 0
    }));

    if (results.length < 4) {
      const fillRes = await pool.query(`
        SELECT 
          p.pid, 
          p.name, 
          p.category, 
          p.sub_category as "subCategory", 
          COALESCE(p.sale_price, 0) as "salePrice", 
          COALESCE(p.purchase_price, 0) as "purchasePrice", 
          COALESCE(p.current_stock, 0) as "currentStock", 
          COALESCE(p.min_stock, 10) as "minStock", 
          p.company_id as "companyId",
          0 AS "unitsSold",
          0 AS "totalRevenue"
        FROM product p 
        WHERE ($1::text IS NULL OR p.company_id = $1)
        ORDER BY p.sale_price DESC
        LIMIT 4;
      `, [companyId]);

      const existingPids = new Set(results.map(r => r.pid));
      for (const row of fillRes.rows) {
        if (results.length >= 4) break;
        if (!existingPids.has(row.pid)) {
          results.push({
            ...row,
            salePrice: parseFloat(row.salePrice) || 0,
            purchasePrice: parseFloat(row.purchasePrice) || 0,
            currentStock: parseFloat(row.currentStock) || 0,
            unitsSold: 0,
            totalRevenue: 0
          });
        }
      }
    }

    return results.slice(0, 4);
  } catch (err) {
    console.error('Error fetching top selling products:', err);
    return [];
  }
}





// Insert single product: common item catalog + branch-specific stock initialization
async function createProduct(data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const cleanPid = (data.pid || data.sku || `PRD-${Date.now()}`).toString().trim().toUpperCase();
  const barcode = (data.barcode || cleanPid).toString().trim();
  const currentStock = parseFloat(data.currentStock ?? data.qty) || 0;
  const minStock = parseFloat(data.minStock ?? data.reorder) || 10;
  const expMonths = parseFloat(data.expMonths) || 12;
  const purchasePrice = parseFloat(data.purchasePrice) || 0;
  const gst = parseFloat(data.gst) || 18;
  const rawSalePrice = parseFloat(data.salePrice) || 0;
  const salePrice = rawSalePrice > 0 ? rawSalePrice : Math.round(purchasePrice * (1 + gst / 100) * 100) / 100;
  const totalWithoutTax = Math.round(currentStock * purchasePrice * 100) / 100;
  const totalWithTax = Math.round(currentStock * salePrice * 100) / 100;
  const expDays = Math.round(expMonths * 30);
  const status = currentStock === 0 ? 'Out' : currentStock <= minStock ? 'Low' : 'OK';

  // 1. Upsert into master common product catalog
  const res = await pool.query(`
    INSERT INTO product (
      company_id, branch_code, supplier, name, description, weight,
      category, sub_category, pid, barcode, hsn, current_stock, min_stock,
      exp_months, sale_price, gst, purchase_price, total_without_tax,
      total_with_tax, exp_days, status, updated_at
    ) VALUES (
      $1, 'COMMON', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP
    )
    ON CONFLICT (company_id, pid) DO UPDATE SET
      supplier = EXCLUDED.supplier,
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      weight = EXCLUDED.weight,
      category = EXCLUDED.category,
      sub_category = EXCLUDED.sub_category,
      barcode = EXCLUDED.barcode,
      hsn = EXCLUDED.hsn,
      min_stock = EXCLUDED.min_stock,
      exp_months = EXCLUDED.exp_months,
      sale_price = EXCLUDED.sale_price,
      gst = EXCLUDED.gst,
      purchase_price = EXCLUDED.purchase_price,
      exp_days = EXCLUDED.exp_days,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `, [
    companyId,
    data.supplier || 'General Supplier',
    data.name,
    data.description || '',
    data.weight || '1 kg',
    data.category || 'General',
    data.subCategory || 'General',
    cleanPid,
    barcode,
    data.hsn || '8424',
    currentStock,
    minStock,
    expMonths,
    salePrice,
    gst,
    purchasePrice,
    totalWithoutTax,
    totalWithTax,
    expDays,
    status
  ]);

  // 2. Upsert branch-specific stock for this branch
  if (branchCode && branchCode !== '*' && branchCode !== 'COMMON') {
    await pool.query(`
      INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (company_id, branch_code, pid) DO UPDATE SET
        current_stock = EXCLUDED.current_stock,
        min_stock = EXCLUDED.min_stock,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP;
    `, [companyId, branchCode, cleanPid, currentStock, minStock, status]);

    // 3. Seed zero-stock records for all sister branches under this specific company
    await pool.query(`
      INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
      SELECT $1::varchar, b.code, $2::varchar, 0, $3, 'Out', CURRENT_TIMESTAMP
      FROM branches b
      WHERE b.company_id = $1::varchar AND b.code != $4::varchar
      ON CONFLICT (company_id, branch_code, pid) DO NOTHING;
    `, [companyId, cleanPid, minStock, branchCode]);
  }

  const row = res.rows[0];
  row.branch_code = branchCode;
  row.current_stock = currentStock;
  row.status = status;
  return formatProductRow(row);
}

// Bulk import from Excel (merge or replace) into company common catalog and branch stock
async function bulkImportProducts(items, branchCode = 'COMMON', mode = 'merge', companyId = null) {
  const compId = companyId || 'comp_mann';
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (mode === 'replace') {
      if (branchCode && branchCode !== '*' && branchCode !== 'COMMON') {
        await client.query(`DELETE FROM branch_stock WHERE company_id = $1 AND branch_code = $2`, [compId, branchCode]);
      } else {
        await client.query(`DELETE FROM branch_stock WHERE company_id = $1`, [compId]);
        await client.query(`DELETE FROM product WHERE company_id = $1`, [compId]);
      }
    }

    for (const item of items) {
      const pid = (item.pid || item.sku || `PRD-${Math.random().toString(36).substr(2, 6)}`).toString().trim().toUpperCase();
      const currentStock = parseFloat(item.currentStock ?? item.qty) || 0;
      const minStock = parseFloat(item.minStock ?? item.reorder) || 10;
      const expMonths = parseFloat(item.expMonths) || 12;
      const purchasePrice = parseFloat(item.purchasePrice) || 0;
      const gst = parseFloat(item.gst) || 18;
      const rawSalePrice = parseFloat(item.salePrice) || 0;
      const salePrice = rawSalePrice > 0 ? rawSalePrice : Math.round(purchasePrice * (1 + gst / 100) * 100) / 100;
      const rawWithoutTax = parseFloat(item.totalWithoutTax) || 0;
      const totalWithoutTax = rawWithoutTax > 0 ? rawWithoutTax : Math.round(currentStock * purchasePrice * 100) / 100;
      const rawWithTax = parseFloat(item.totalWithTax) || 0;
      const totalWithTax = rawWithTax > 0 ? rawWithTax : Math.round(currentStock * salePrice * 100) / 100;
      const expDays = parseInt(item.expDays, 10) || Math.round(expMonths * 30);
      const status = currentStock === 0 ? 'Out' : currentStock <= minStock ? 'Low' : 'OK';

      // Master catalog
      const barcode = (item.barcode || pid).toString().trim();
      await client.query(`
        INSERT INTO product (
          company_id, branch_code, supplier, name, description, weight,
          category, sub_category, pid, barcode, hsn, current_stock, min_stock,
          exp_months, sale_price, gst, purchase_price, total_without_tax,
          total_with_tax, exp_days, status, updated_at
        ) VALUES (
          $1, 'COMMON', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP
        )
        ON CONFLICT (company_id, pid) DO UPDATE SET
          supplier = EXCLUDED.supplier,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          weight = EXCLUDED.weight,
          category = EXCLUDED.category,
          sub_category = EXCLUDED.sub_category,
          barcode = EXCLUDED.barcode,
          hsn = EXCLUDED.hsn,
          min_stock = EXCLUDED.min_stock,
          exp_months = EXCLUDED.exp_months,
          sale_price = EXCLUDED.sale_price,
          gst = EXCLUDED.gst,
          purchase_price = EXCLUDED.purchase_price,
          total_without_tax = EXCLUDED.total_without_tax,
          total_with_tax = EXCLUDED.total_with_tax,
          exp_days = EXCLUDED.exp_days,
          updated_at = CURRENT_TIMESTAMP;
      `, [
        compId,
        item.supplier || 'General Supplier',
        item.name,
        item.description || '',
        item.weight || '1 kg',
        item.category || 'General',
        item.subCategory || 'General',
        pid,
        barcode,
        item.hsn || '8424',
        currentStock,
        minStock,
        expMonths,
        salePrice,
        gst,
        purchasePrice,
        totalWithoutTax,
        totalWithTax,
        expDays,
        status
      ]);

      // Branch-specific stock
      if (branchCode && branchCode !== '*' && branchCode !== 'COMMON') {
        await client.query(`
          INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
          ON CONFLICT (company_id, branch_code, pid) DO UPDATE SET
            current_stock = EXCLUDED.current_stock,
            min_stock = EXCLUDED.min_stock,
            status = EXCLUDED.status,
            updated_at = CURRENT_TIMESTAMP;
        `, [compId, branchCode, pid, currentStock, minStock, status]);

        // Seed 0-stock records for all other sister branches under this company
        await client.query(`
          INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
          SELECT $1::varchar, b.code, $2::varchar, 0, $3, 'Out', CURRENT_TIMESTAMP
          FROM branches b
          WHERE b.company_id = $1::varchar AND b.code != $4::varchar
          ON CONFLICT (company_id, branch_code, pid) DO NOTHING;
        `, [compId, pid, minStock, branchCode]);
      }
    }

    await client.query('COMMIT');
    return getProductsByBranch(compId, branchCode);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Adjust physical stock count for a specific branch
async function updateStockCount(pid, countVal, branchCode = 'AMD-01', companyId = 'comp_mann') {
  const current = await pool.query(
    `SELECT * FROM product WHERE company_id = $1 AND pid = $2`,
    [companyId, pid]
  );
  if (!current.rows.length) return null;

  const row = current.rows[0];
  const count = parseFloat(countVal) || 0;
  const minStock = parseFloat(row.min_stock) || 10;
  const pp = parseFloat(row.purchase_price) || 0;
  const gst = parseFloat(row.gst) || 18;
  const sp = parseFloat(row.sale_price) || Math.round((pp * (1 + (gst / 100))) * 100) / 100;

  const totalWithoutTax = Math.round((count * pp) * 100) / 100;
  const totalWithTax = Math.round((count * sp) * 100) / 100;

  let computedStatus = 'OK';
  if (count === 0) computedStatus = 'Out';
  else if (count <= 5) computedStatus = 'Critical';
  else if (count <= minStock) computedStatus = 'Low';

  await pool.query(`
    INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    ON CONFLICT (company_id, branch_code, pid) DO UPDATE SET
      current_stock = EXCLUDED.current_stock,
      status = EXCLUDED.status,
      updated_at = CURRENT_TIMESTAMP;
  `, [companyId, branchCode, pid, count, minStock, computedStatus]);

  row.branch_code = branchCode;
  row.current_stock = count;
  row.status = computedStatus;
  row.total_without_tax = totalWithoutTax;
  row.total_with_tax = totalWithTax;
  return formatProductRow(row);
}

// Update an existing product: updates common catalog details and branch stock
async function updateProduct(id, data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const currentStock = parseFloat(data.currentStock ?? data.qty) || 0;
  const minStock = parseFloat(data.minStock ?? data.reorder) || 10;
  const expMonths = parseFloat(data.expMonths) || 12;
  const purchasePrice = parseFloat(data.purchasePrice) || 0;
  const gst = parseFloat(data.gst) || 18;
  const rawSalePrice = parseFloat(data.salePrice) || 0;
  const salePrice = rawSalePrice > 0 ? rawSalePrice : Math.round(purchasePrice * (1 + gst / 100) * 100) / 100;
  const totalWithoutTax = Math.round(currentStock * purchasePrice * 100) / 100;
  const totalWithTax = Math.round(currentStock * salePrice * 100) / 100;
  const expDays = Math.round(expMonths * 30);
  const computedStatus = currentStock === 0 ? 'Out' : currentStock <= minStock ? 'Low' : 'OK';

  // 1. Update master item catalog
  const res = await pool.query(`
    UPDATE product SET
      supplier = $1,
      name = $2,
      description = $3,
      weight = $4,
      category = $5,
      sub_category = $6,
      hsn = $7,
      min_stock = $8,
      exp_months = $9,
      sale_price = $10,
      gst = $11,
      purchase_price = $12,
      exp_days = $13,
      barcode = $14,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $15 AND company_id = $16
    RETURNING *;
  `, [
    data.supplier || 'General Supplier',
    data.name,
    data.description || '',
    data.weight || '1 kg',
    data.category || 'General',
    data.subCategory || 'General',
    data.hsn || '8424',
    minStock,
    expMonths,
    salePrice,
    gst,
    purchasePrice,
    expDays,
    data.barcode || '',
    id,
    companyId
  ]);

  if (!res.rows.length) return null;
  const prod = res.rows[0];

  // 2. Update stock for this branch in branch_stock
  if (branchCode && branchCode !== '*' && branchCode !== 'COMMON') {
    await pool.query(`
      INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (company_id, branch_code, pid) DO UPDATE SET
        current_stock = EXCLUDED.current_stock,
        min_stock = EXCLUDED.min_stock,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP;
    `, [companyId, branchCode, prod.pid, currentStock, minStock, computedStatus]);
  }

  prod.branch_code = branchCode;
  prod.current_stock = currentStock;
  prod.status = computedStatus;
  prod.total_without_tax = totalWithoutTax;
  prod.total_with_tax = totalWithTax;
  return formatProductRow(prod);
}

// Delete product from company common inventory
async function deleteProduct(id, companyId = 'comp_mann') {
  const getRes = await pool.query(`SELECT pid FROM product WHERE id = $1 AND company_id = $2`, [id, companyId]);
  if (getRes.rows.length) {
    const pid = getRes.rows[0].pid;
    await pool.query(`DELETE FROM branch_stock WHERE company_id = $1 AND pid = $2`, [companyId, pid]);
  }
  const res = await pool.query(
    `DELETE FROM product WHERE id = $1 AND company_id = $2 RETURNING *;`,
    [id, companyId]
  );
  if (!res.rows.length) return null;
  return formatProductRow(res.rows[0]);
}

// ── Format invoice row for client ──
function formatInvoiceRow(r, items = []) {
  return {
    id: r.id,
    no: r.invoice_no,
    invoiceNo: r.invoice_no,
    branchCode: r.branch_code,
    customerUid: r.customer_uid,
    customer: r.customer_name,
    customerName: r.customer_name,
    contactPerson: r.contact_person,
    phone: r.customer_phone,
    email: r.customer_email,
    address: r.customer_address,
    gstin: r.customer_gstin,
    date: r.invoice_date ? new Date(r.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    rawDate: r.invoice_date,
    dueDate: r.due_date,
    followupBy: r.followup_by,
    referenceNo: r.reference_no,
    revisionNo: r.revision_no,
    items: parseInt(r.total_items, 10) || (items.length || 1),
    subtotal: parseFloat(r.subtotal) || 0,
    totalTax: parseFloat(r.total_tax) || 0,
    discountAmount: parseFloat(r.discount_amount) || 0,
    roundOff: parseFloat(r.round_off) || 0,
    totalNum: parseFloat(r.grand_total) || 0,
    total: `₹${(parseFloat(r.grand_total) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    payment: r.payment_mode,
    status: r.status,
    quoteRemark: r.quote_remark,
    termsConditions: r.terms_conditions,
    createdBy: r.created_by,
    createdAt: r.created_at,
    time: 'Just now',
    lineItems: items.map(it => ({
      id: it.id,
      itemCode: it.item_code,
      name: it.item_name,
      unit: it.unit,
      hsn: it.hsn_code,
      qty: parseFloat(it.qty) || 1,
      price: parseFloat(it.unit_price) || 0,
      discount: parseFloat(it.discount) || 0,
      effectivePrice: parseFloat(it.effective_price) || 0,
      taxRate: parseFloat(it.tax_rate) || 18,
      taxAmount: parseFloat(it.tax_amount) || 0,
      subtotal: parseFloat(it.subtotal) || 0,
      remark: it.remark || ''
    }))
  };
}

// ── Get all invoices for a branch (with strict company & branch isolation) ──
async function getInvoicesByBranch(companyId = 'comp_mann', branchCode = 'AMD-01') {
  let invRes;
  if (!branchCode || branchCode === '*' || branchCode === 'ALL') {
    invRes = await pool.query(
      `SELECT * FROM invoices WHERE company_id = $1 ORDER BY id DESC;`,
      [companyId]
    );
  } else {
    invRes = await pool.query(
      `SELECT * FROM invoices WHERE company_id = $1 AND branch_code = $2 ORDER BY id DESC;`,
      [companyId, branchCode]
    );
  }

  if (!invRes.rows.length) return [];

  const invoiceIds = invRes.rows.map(r => r.id);
  const itemsRes = await pool.query(`
    SELECT * FROM invoice_items 
    WHERE invoice_id = ANY($1::int[]) 
    ORDER BY id ASC;
  `, [invoiceIds]);

  const itemsByInvoice = {};
  for (const it of itemsRes.rows) {
    if (!itemsByInvoice[it.invoice_id]) itemsByInvoice[it.invoice_id] = [];
    itemsByInvoice[it.invoice_id].push(it);
  }

  return invRes.rows.map(inv => formatInvoiceRow(inv, itemsByInvoice[inv.id] || []));
}

// ── Get single invoice by ID ──
async function getInvoiceById(id) {
  const invRes = await pool.query(`SELECT * FROM invoices WHERE id = $1 LIMIT 1;`, [id]);
  if (!invRes.rows.length) return null;
  const inv = invRes.rows[0];

  const itemsRes = await pool.query(`SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC;`, [id]);
  return formatInvoiceRow(inv, itemsRes.rows);
}

// ── Create new invoice in PostgreSQL transactionally ──
async function createInvoice(data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let invoiceNo = (data.invoiceNo || data.no || '').trim();
    if (!invoiceNo) {
      // Find the highest existing integer for this specific company and branch to form proper series: 1, 2, 3, 4, 5, 6...
      const branchInvoices = await client.query(
        'SELECT invoice_no FROM invoices WHERE company_id = $1 AND branch_code = $2',
        [companyId, branchCode]
      );
      const existingNums = branchInvoices.rows.map(r => {
        const m = (r.invoice_no || '').match(/^(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      }).filter(n => !isNaN(n) && n > 0);

      const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
      let nextNum = maxNum + 1;
      let candidate = String(nextNum);

      // Guaranteed collision-free loop for this specific branch
      while (true) {
        const check = await client.query(
          'SELECT 1 FROM invoices WHERE company_id = $1 AND branch_code = $2 AND invoice_no = $3 LIMIT 1',
          [companyId, branchCode, candidate]
        );
        if (check.rows.length === 0) {
          invoiceNo = candidate;
          break;
        }
        nextNum++;
        candidate = String(nextNum);
      }
    } else {
      let candidate = invoiceNo;
      let suffix = 1;
      while (true) {
        const check = await client.query(
          'SELECT 1 FROM invoices WHERE company_id = $1 AND branch_code = $2 AND invoice_no = $3 LIMIT 1',
          [companyId, branchCode, candidate]
        );
        if (check.rows.length === 0) {
          invoiceNo = candidate;
          break;
        }
        candidate = `${invoiceNo}-${suffix++}`;
      }
    }

    const items = Array.isArray(data.items) ? data.items : [];
    const totalItems = items.length || 1;

    let computedSubtotal = 0;
    let computedTax = 0;
    for (const it of items) {
      const price = parseFloat(it.price || it.unitPrice) || 0;
      const discount = parseFloat(it.discount) || 0;
      const effectivePrice = Math.max(0, price - discount);
      const qty = parseFloat(it.qty) || 1;
      const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
      const lineSubtotal = Math.round(effectivePrice * qty * 100) / 100;
      const lineTax = Math.round(((lineSubtotal * taxRate) / 100) * 100) / 100;
      computedSubtotal += lineSubtotal;
      computedTax += lineTax;
    }

    const subtotal = (parseFloat(data.subtotal) > 0) ? parseFloat(data.subtotal) : Math.round(computedSubtotal * 100) / 100;
    const totalTax = (parseFloat(data.totalTax) > 0) ? parseFloat(data.totalTax) : Math.round(computedTax * 100) / 100;
    const discountAmount = parseFloat(data.discountAmount || data.couponDiscount) || 0;
    const roundOff = parseFloat(data.roundOff) || 0;
    const grandTotal = (parseFloat(data.grandTotal || data.payableAmount) > 0) ? parseFloat(data.grandTotal || data.payableAmount) : Math.round((subtotal + totalTax - discountAmount + roundOff) * 100) / 100;

    const invInsert = await client.query(`
      INSERT INTO invoices (
        company_id, invoice_no, branch_code, customer_uid, customer_name, contact_person,
        customer_phone, customer_email, customer_address, customer_gstin,
        invoice_date, due_date, followup_by, reference_no, revision_no,
        total_items, subtotal, total_tax, discount_amount, round_off,
        grand_total, payment_mode, status, quote_remark, terms_conditions, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      RETURNING *;
    `, [
      companyId,
      invoiceNo,
      branchCode,
      data.customerUid || '',
      data.customerName || data.customer || 'Walk-in Customer',
      data.contactPerson || '',
      data.customerPhone || data.phone || '',
      data.customerEmail || data.email || '',
      data.customerAddress || data.address || '',
      data.customerGstin || data.gstin || '',
      data.invoiceDate || new Date(),
      data.dueDate || new Date(Date.now() + 15 * 86400000),
      data.followupBy || 'Admin',
      data.referenceNo || data.quoteReference || '',
      data.revisionNo || '1',
      totalItems,
      subtotal,
      totalTax,
      discountAmount,
      roundOff,
      grandTotal,
      data.paymentMode || 'Cash',
      data.status || 'Posted',
      data.quoteRemark || '',
      data.termsConditions || '',
      data.createdBy || 'Admin'
    ]);

    const createdInv = invInsert.rows[0];
    const createdItems = [];

    for (const it of items) {
      const code = it.itemCode || it.code || it.pid || 'CUSTOM';
      const name = it.name || it.itemName || code;
      const unit = it.unit || 'NOS';
      const hsn = it.hsn || it.hsnCode || '';
      const qty = parseFloat(it.qty) || 1;
      const price = parseFloat(it.price || it.unitPrice) || 0;
      const discount = parseFloat(it.discount) || 0;
      const effectivePrice = Math.max(0, price - discount);
      const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
      const itemSubtotal = Math.round((qty * effectivePrice) * 100) / 100;
      const taxAmount = Math.round(((itemSubtotal * taxRate) / 100) * 100) / 100;
      const remark = it.remark || '';

      const itRes = await client.query(`
        INSERT INTO invoice_items (
          invoice_id, invoice_no, item_code, item_name, unit, hsn_code,
          qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
      `, [
        createdInv.id, invoiceNo, code, name, unit, hsn,
        qty, price, discount, effectivePrice, taxRate, taxAmount, itemSubtotal, remark
      ]);
      createdItems.push(itRes.rows[0]);

      // Deduct inventory stock from this branch's stock
      if (code && code !== 'CUSTOM') {
        await client.query(`
          UPDATE branch_stock SET
            current_stock = GREATEST(0, current_stock - $1),
            status = CASE 
              WHEN (current_stock - $1) <= 0 THEN 'Out'
              WHEN (current_stock - $1) <= min_stock THEN 'Low'
              ELSE 'OK'
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE company_id = $2 AND branch_code = $3 AND pid = $4;
        `, [qty, companyId, branchCode, code]);
      }
    }

    await client.query('COMMIT');
    return formatInvoiceRow(createdInv, createdItems);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ── Delete invoice transactionally from PostgreSQL ──
async function deleteInvoice(idOrNo, companyId = 'comp_mann', branchCode = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let invRes;
    if (branchCode && branchCode !== '*' && branchCode !== 'ALL') {
      invRes = await client.query(`
        SELECT * FROM invoices 
        WHERE (id::text = $1 OR invoice_no = $1) AND company_id = $2 AND branch_code = $3
        LIMIT 1;
      `, [String(idOrNo), companyId, branchCode]);
    } else {
      invRes = await client.query(`
        SELECT * FROM invoices 
        WHERE (id::text = $1 OR invoice_no = $1) AND company_id = $2
        LIMIT 1;
      `, [String(idOrNo), companyId]);
    }

    if (!invRes.rows.length) {
      throw new Error(`Invoice "${idOrNo}" not found`);
    }

    const inv = invRes.rows[0];

    // Delete child line items
    await client.query(`DELETE FROM invoice_items WHERE invoice_id = $1 OR invoice_no = $2;`, [inv.id, inv.invoice_no]);

    // Delete parent invoice
    await client.query(`DELETE FROM invoices WHERE id = $1;`, [inv.id]);

    await client.query('COMMIT');
    return { success: true, message: `Invoice ${inv.invoice_no} deleted successfully`, invoiceNo: inv.invoice_no };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ── Update invoice transactionally in PostgreSQL ──
async function updateInvoice(idOrNo, data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const invRes = await client.query(`
      SELECT * FROM invoices 
      WHERE (id::text = $1 OR invoice_no = $1) AND company_id = $2
      LIMIT 1;
    `, [String(idOrNo), companyId]);

    if (!invRes.rows.length) {
      throw new Error(`Invoice "${idOrNo}" not found`);
    }

    const currentInv = invRes.rows[0];
    const invoiceNo = currentInv.invoice_no;

    const items = Array.isArray(data.items) ? data.items : [];
    const totalItems = items.length || 1;

    let computedSubtotal = 0;
    let computedTax = 0;
    for (const it of items) {
      const price = parseFloat(it.price || it.unitPrice) || 0;
      const discount = parseFloat(it.discount) || 0;
      const effectivePrice = Math.max(0, price - discount);
      const qty = parseFloat(it.qty) || 1;
      const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
      const lineSubtotal = Math.round(effectivePrice * qty * 100) / 100;
      const lineTax = Math.round(((lineSubtotal * taxRate) / 100) * 100) / 100;
      computedSubtotal += lineSubtotal;
      computedTax += lineTax;
    }

    const subtotal = (parseFloat(data.subtotal) > 0) ? parseFloat(data.subtotal) : Math.round(computedSubtotal * 100) / 100;
    const totalTax = (parseFloat(data.totalTax) > 0) ? parseFloat(data.totalTax) : Math.round(computedTax * 100) / 100;
    const discountAmount = parseFloat(data.discountAmount || data.couponDiscount) || 0;
    const roundOff = parseFloat(data.roundOff) || 0;
    const grandTotal = (parseFloat(data.grandTotal || data.payableAmount) > 0) ? parseFloat(data.grandTotal || data.payableAmount) : Math.round((subtotal + totalTax - discountAmount + roundOff) * 100) / 100;

    const updateRes = await client.query(`
      UPDATE invoices SET
        customer_uid = $1,
        customer_name = $2,
        contact_person = $3,
        customer_phone = $4,
        customer_email = $5,
        customer_address = $6,
        customer_gstin = $7,
        invoice_date = $8,
        due_date = $9,
        followup_by = $10,
        reference_no = $11,
        revision_no = $12,
        total_items = $13,
        subtotal = $14,
        total_tax = $15,
        discount_amount = $16,
        round_off = $17,
        grand_total = $18,
        payment_mode = $19,
        status = $20,
        quote_remark = $21,
        terms_conditions = $22,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $23
      RETURNING *;
    `, [
      data.customerUid !== undefined ? data.customerUid : currentInv.customer_uid,
      data.customerName || data.customer || currentInv.customer_name,
      data.contactPerson !== undefined ? data.contactPerson : currentInv.contact_person,
      data.customerPhone !== undefined ? (data.customerPhone || data.phone) : currentInv.customer_phone,
      data.customerEmail !== undefined ? (data.customerEmail || data.email) : currentInv.customer_email,
      data.customerAddress !== undefined ? (data.customerAddress || data.address) : currentInv.customer_address,
      data.customerGstin !== undefined ? (data.customerGstin || data.gstin) : currentInv.customer_gstin,
      data.invoiceDate || currentInv.invoice_date,
      data.dueDate || currentInv.due_date,
      data.followupBy || currentInv.followup_by,
      data.referenceNo !== undefined ? data.referenceNo : currentInv.reference_no,
      data.revisionNo !== undefined ? data.revisionNo : currentInv.revision_no,
      totalItems,
      subtotal,
      totalTax,
      discountAmount,
      roundOff,
      grandTotal,
      data.paymentMode || currentInv.payment_mode,
      data.status || currentInv.status,
      data.quoteRemark !== undefined ? (data.quoteRemark || data.remark) : currentInv.quote_remark,
      data.termsConditions !== undefined ? data.termsConditions : currentInv.terms_conditions,
      currentInv.id
    ]);

    const updatedInv = updateRes.rows[0];

    // Re-insert line items if provided
    let updatedItems = [];
    if (items.length > 0) {
      await client.query(`DELETE FROM invoice_items WHERE invoice_id = $1;`, [currentInv.id]);

      for (const it of items) {
        const code = it.itemCode || it.code || it.pid || 'CUSTOM';
        const name = it.name || it.itemName || code;
        const unit = it.unit || 'NOS';
        const hsn = it.hsn || it.hsnCode || '';
        const qty = parseFloat(it.qty) || 1;
        const price = parseFloat(it.price || it.unitPrice) || 0;
        const discount = parseFloat(it.discount) || 0;
        const effectivePrice = Math.max(0, price - discount);
        const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
        const itemSubtotal = Math.round((qty * effectivePrice) * 100) / 100;
        const taxAmount = Math.round(((itemSubtotal * taxRate) / 100) * 100) / 100;
        const remark = it.remark || '';

        const itRes = await client.query(`
          INSERT INTO invoice_items (
            invoice_id, invoice_no, item_code, item_name, unit, hsn_code,
            qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *;
        `, [
          currentInv.id, invoiceNo, code, name, unit, hsn,
          qty, price, discount, effectivePrice, taxRate, taxAmount, itemSubtotal, remark
        ]);
        updatedItems.push(itRes.rows[0]);
      }
    } else {
      const existingItems = await client.query(`SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC;`, [currentInv.id]);
      updatedItems = existingItems.rows;
    }

    await client.query('COMMIT');
    return formatInvoiceRow(updatedInv, updatedItems);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ── Customers lookup & creation ──
async function getCustomers(search = '') {
  let query = `SELECT * FROM customers ORDER BY company ASC;`;
  let params = [];
  if (search && search.trim()) {
    query = `SELECT * FROM customers WHERE company ILIKE $1 OR name ILIKE $1 OR phone ILIKE $1 OR gstin ILIKE $1 ORDER BY company ASC LIMIT 20;`;
    params = [`%${search.trim()}%`];
  }
  const res = await pool.query(query, params);
  return res.rows.map(c => ({
    id: c.id,
    uid: c.uid,
    company: c.company,
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    gstin: c.gstin
  }));
}

async function createCustomer(data) {
  const uid = data.uid || `OC-${Math.floor(100 + Math.random() * 900)}`;
  const res = await pool.query(`
    INSERT INTO customers (uid, company, name, phone, email, address, gstin)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (uid) DO UPDATE SET
      company = EXCLUDED.company,
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      address = EXCLUDED.address,
      gstin = EXCLUDED.gstin
    RETURNING *;
  `, [
    uid,
    data.company || data.name,
    data.name || '',
    data.phone || '',
    data.email || '',
    data.address || '',
    data.gstin || ''
  ]);
  const c = res.rows[0];
  return {
    id: c.id,
    uid: c.uid,
    company: c.company,
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    gstin: c.gstin
  };
}

async function getProductCustomerPurchases(itemCode, companyId = 'comp_mann', branchCode = null) {
  const client = await pool.connect();
  try {
    if (!itemCode) return [];

    const q = `
      SELECT 
        COALESCE(i.customer_name, 'Direct Client') AS "customerName",
        COALESCE(NULLIF(MAX(i.customer_uid), ''), 'CUST-' || LPAD(COALESCE(MAX(i.id), 1)::text, 4, '0')) AS "customerUid",
        COALESCE(MAX(i.customer_gstin), 'URP') AS "gstin",
        COALESCE(MAX(i.customer_phone), '—') AS "phone",
        COALESCE(MAX(i.customer_email), '—') AS "email",
        COALESCE(MAX(i.branch_code), 'AMD-01') AS "branchCode",
        COALESCE(SUM(ii.qty), 0) AS "totalUnits",
        COALESCE(SUM(ii.subtotal), 0) AS "totalInvoiced",
        COALESCE(AVG(ii.unit_price), 0) AS "avgRealizedRate",
        MAX(i.invoice_date) AS "lastOrderDate",
        COUNT(DISTINCT i.id) AS "orderCount",
        COALESCE(MAX(i.payment_mode), 'Credit (30 Days)') AS "paymentTerms",
        COALESCE(MAX(i.status), 'Posted') AS "orderStatus"
      FROM invoice_items ii
      JOIN invoices i ON (ii.invoice_id = i.id OR ii.invoice_no = i.invoice_no)
      WHERE LOWER(TRIM(ii.item_code)) = LOWER(TRIM($1))
        AND ($2::text IS NULL OR i.branch_code = $2)
      GROUP BY i.customer_name
      ORDER BY "totalInvoiced" DESC
      LIMIT 15;
    `;
    const res = await client.query(q, [itemCode, branchCode || null]);

    const results = (res.rows || []).map(r => ({
      customerName: r.customerName,
      customerUid: r.customerUid,
      gstin: r.gstin,
      phone: r.phone,
      email: r.email,
      branchCode: r.branchCode,
      totalUnits: parseFloat(r.totalUnits) || 0,
      totalInvoiced: parseFloat(r.totalInvoiced) || 0,
      avgRealizedRate: parseFloat(r.avgRealizedRate) || 0,
      lastOrderDate: r.lastOrderDate ? new Date(r.lastOrderDate).toISOString().split('T')[0] : 'Recent',
      orderCount: parseInt(r.orderCount, 10) || 1,
      paymentTerms: r.paymentTerms || 'Credit (30 Days)',
      orderStatus: r.orderStatus || 'Posted'
    }));

    return results;
  } catch (err) {
    console.error('Error fetching product customer purchases:', err);
    return [];
  } finally {
    client.release();
  }
}


// ── Format purchase row for client ──
function formatPurchaseRow(r, items = []) {
  return {
    id: r.id,
    no: r.po_no,
    poNo: r.po_no,
    companyId: r.company_id || 'comp_mann',
    branchCode: r.branch_code,
    supplierUid: r.supplier_uid,
    supplier: r.supplier_name,
    supplierName: r.supplier_name,
    contactPerson: r.contact_person,
    phone: r.supplier_phone,
    email: r.supplier_email,
    address: r.supplier_address,
    gstin: r.supplier_gstin,
    date: r.po_date ? new Date(r.po_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    rawDate: r.po_date,
    dueDate: r.due_date,
    deliveryDate: r.delivery_date,
    referenceNo: r.reference_no,
    revisionNo: r.revision_no,
    totalItems: parseInt(r.total_items, 10) || (items.length || 1),
    subtotal: parseFloat(r.subtotal) || 0,
    totalTax: parseFloat(r.total_tax) || 0,
    discountAmount: parseFloat(r.discount_amount) || 0,
    roundOff: parseFloat(r.round_off) || 0,
    totalNum: parseFloat(r.grand_total) || 0,
    total: `₹${(parseFloat(r.grand_total) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    paymentTerms: r.payment_terms || 'Credit 30 Days',
    status: r.status || 'Ordered',
    grnNo: r.grn_no || '',
    poRemark: r.po_remark || '',
    termsConditions: r.terms_conditions || '',
    createdBy: r.created_by,
    createdAt: r.created_at,
    time: 'Just now',
    lineItems: items.map(it => ({
      id: it.id,
      itemCode: it.item_code,
      name: it.item_name,
      unit: it.unit,
      hsn: it.hsn_code,
      qty: parseFloat(it.qty) || 1,
      price: parseFloat(it.unit_price) || 0,
      discount: parseFloat(it.discount) || 0,
      effectivePrice: parseFloat(it.effective_price) || 0,
      taxRate: parseFloat(it.tax_rate) || 18,
      taxAmount: parseFloat(it.tax_amount) || 0,
      subtotal: parseFloat(it.subtotal) || 0,
      remark: it.remark || ''
    }))
  };
}

async function getPurchasesByBranch(companyId = 'comp_mann', branchCode = 'AMD-01') {
  let poRes;
  if (!branchCode || branchCode === '*' || branchCode === 'ALL') {
    poRes = await pool.query(
      `SELECT * FROM purchases WHERE company_id = $1 ORDER BY id DESC;`,
      [companyId]
    );
  } else {
    poRes = await pool.query(
      `SELECT * FROM purchases WHERE company_id = $1 AND branch_code = $2 ORDER BY id DESC;`,
      [companyId, branchCode]
    );
  }

  if (!poRes.rows.length) return [];

  const purchaseIds = poRes.rows.map(r => r.id);
  const itemsRes = await pool.query(`
    SELECT * FROM purchase_items 
    WHERE purchase_id = ANY($1::int[]) 
    ORDER BY id ASC;
  `, [purchaseIds]);

  const itemsByPo = {};
  for (const it of itemsRes.rows) {
    if (!itemsByPo[it.purchase_id]) itemsByPo[it.purchase_id] = [];
    itemsByPo[it.purchase_id].push(it);
  }

  return poRes.rows.map(po => formatPurchaseRow(po, itemsByPo[po.id] || []));
}

async function getPurchaseById(id) {
  const poRes = await pool.query(`SELECT * FROM purchases WHERE id = $1 LIMIT 1;`, [id]);
  if (!poRes.rows.length) return null;
  const po = poRes.rows[0];

  const itemsRes = await pool.query(`SELECT * FROM purchase_items WHERE purchase_id = $1 ORDER BY id ASC;`, [id]);
  return formatPurchaseRow(po, itemsRes.rows);
}

async function createPurchase(data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let poNo = (data.poNo || data.no || '').trim();
    if (!poNo) {
      // Find the highest existing integer for this specific company and branch to form proper series: 1, 2, 3, 4, 5, 6...
      const branchPurchases = await client.query(
        'SELECT po_no FROM purchases WHERE company_id = $1 AND branch_code = $2',
        [companyId, branchCode]
      );
      const existingNums = branchPurchases.rows.map(r => {
        const m = (r.po_no || '').match(/^(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      }).filter(n => !isNaN(n) && n > 0);

      const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
      let nextNum = maxNum + 1;
      let candidate = String(nextNum);

      while (true) {
        const check = await client.query(
          'SELECT 1 FROM purchases WHERE company_id = $1 AND branch_code = $2 AND po_no = $3 LIMIT 1',
          [companyId, branchCode, candidate]
        );
        if (check.rows.length === 0) {
          poNo = candidate;
          break;
        }
        nextNum++;
        candidate = String(nextNum);
      }
    } else {
      let candidate = poNo;
      let suffix = 1;
      while (true) {
        const check = await client.query(
          'SELECT 1 FROM purchases WHERE company_id = $1 AND branch_code = $2 AND po_no = $3 LIMIT 1',
          [companyId, branchCode, candidate]
        );
        if (check.rows.length === 0) {
          poNo = candidate;
          break;
        }
        candidate = `${poNo}-${suffix++}`;
      }
    }

    const items = Array.isArray(data.items) ? data.items : [];
    const totalItems = items.length || 1;

    let computedSubtotal = 0;
    let computedTax = 0;
    for (const it of items) {
      const price = parseFloat(it.price || it.unitPrice) || 0;
      const discount = parseFloat(it.discount) || 0;
      const effectivePrice = Math.max(0, price - discount);
      const qty = parseFloat(it.qty) || 1;
      const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
      const lineSubtotal = Math.round(effectivePrice * qty * 100) / 100;
      const lineTax = Math.round(((lineSubtotal * taxRate) / 100) * 100) / 100;
      computedSubtotal += lineSubtotal;
      computedTax += lineTax;
    }

    const subtotal = (parseFloat(data.subtotal) > 0) ? parseFloat(data.subtotal) : Math.round(computedSubtotal * 100) / 100;
    const totalTax = (parseFloat(data.totalTax) > 0) ? parseFloat(data.totalTax) : Math.round(computedTax * 100) / 100;
    const discountAmount = parseFloat(data.discountAmount) || 0;
    const roundOff = parseFloat(data.roundOff) || 0;
    const grandTotal = (parseFloat(data.grandTotal || data.payableAmount) > 0) ? parseFloat(data.grandTotal || data.payableAmount) : Math.round((subtotal + totalTax - discountAmount + roundOff) * 100) / 100;

    const poInsert = await client.query(`
      INSERT INTO purchases (
        company_id, po_no, branch_code, supplier_uid, supplier_name, contact_person,
        supplier_phone, supplier_email, supplier_address, supplier_gstin,
        po_date, due_date, delivery_date, reference_no, revision_no,
        total_items, subtotal, total_tax, discount_amount, round_off,
        grand_total, payment_terms, status, grn_no, po_remark, terms_conditions, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      RETURNING *;
    `, [
      companyId,
      poNo,
      branchCode,
      data.supplierUid || data.supplierId || '',
      data.supplierName || data.supplier || 'General Supplier',
      data.contactPerson || '',
      data.supplierPhone || data.phone || '',
      data.supplierEmail || data.email || '',
      data.supplierAddress || data.address || '',
      data.supplierGstin || data.gstin || '',
      data.poDate || data.date || new Date(),
      data.dueDate || null,
      data.deliveryDate || null,
      data.referenceNo || '',
      data.revisionNo || '1',
      totalItems,
      subtotal,
      totalTax,
      discountAmount,
      roundOff,
      grandTotal,
      data.paymentTerms || 'Credit 30 Days',
      data.status || 'Ordered',
      data.grnNo || '',
      data.poRemark || data.remark || '',
      data.termsConditions || '',
      data.createdBy || 'Admin'
    ]);

    const createdPo = poInsert.rows[0];
    const createdItems = [];

    for (const it of items) {
      const code = it.itemCode || it.code || it.pid || 'CUSTOM';
      const name = it.name || it.itemName || code;
      const unit = it.unit || 'NOS';
      const hsn = it.hsn || it.hsnCode || '';
      const qty = parseFloat(it.qty) || 1;
      const price = parseFloat(it.price || it.unitPrice) || 0;
      const discount = parseFloat(it.discount) || 0;
      const effectivePrice = Math.max(0, price - discount);
      const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
      const itemSubtotal = Math.round((qty * effectivePrice) * 100) / 100;
      const taxAmount = Math.round(((itemSubtotal * taxRate) / 100) * 100) / 100;
      const remark = it.remark || '';

      const itRes = await client.query(`
        INSERT INTO purchase_items (
          purchase_id, po_no, item_code, item_name, unit, hsn_code,
          qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
      `, [
        createdPo.id, poNo, code, name, unit, hsn,
        qty, price, discount, effectivePrice, taxRate, taxAmount, itemSubtotal, remark
      ]);
      createdItems.push(itRes.rows[0]);
    }

    await client.query('COMMIT');
    return formatPurchaseRow(createdPo, createdItems);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updatePurchase(idOrNo, data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const poRes = await client.query(`
      SELECT * FROM purchases 
      WHERE (id::text = $1 OR po_no = $1) AND company_id = $2
      LIMIT 1;
    `, [String(idOrNo), companyId]);

    if (!poRes.rows.length) {
      throw new Error(`Purchase order "${idOrNo}" not found`);
    }

    const currentPo = poRes.rows[0];
    const poNo = currentPo.po_no;

    const items = Array.isArray(data.items) ? data.items : [];
    const totalItems = items.length || currentPo.total_items;

    let computedSubtotal = 0;
    let computedTax = 0;
    for (const it of items) {
      const price = parseFloat(it.price || it.unitPrice) || 0;
      const discount = parseFloat(it.discount) || 0;
      const effectivePrice = Math.max(0, price - discount);
      const qty = parseFloat(it.qty) || 1;
      const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
      const lineSubtotal = Math.round(effectivePrice * qty * 100) / 100;
      const lineTax = Math.round(((lineSubtotal * taxRate) / 100) * 100) / 100;
      computedSubtotal += lineSubtotal;
      computedTax += lineTax;
    }

    const subtotal = (parseFloat(data.subtotal) > 0) ? parseFloat(data.subtotal) : (items.length ? Math.round(computedSubtotal * 100) / 100 : currentPo.subtotal);
    const totalTax = (parseFloat(data.totalTax) > 0) ? parseFloat(data.totalTax) : (items.length ? Math.round(computedTax * 100) / 100 : currentPo.total_tax);
    const discountAmount = parseFloat(data.discountAmount) || 0;
    const roundOff = parseFloat(data.roundOff) || 0;
    const grandTotal = (parseFloat(data.grandTotal || data.payableAmount) > 0) ? parseFloat(data.grandTotal || data.payableAmount) : (items.length ? Math.round((subtotal + totalTax - discountAmount + roundOff) * 100) / 100 : currentPo.grand_total);

    const updateRes = await client.query(`
      UPDATE purchases SET
        supplier_uid = $1,
        supplier_name = $2,
        contact_person = $3,
        supplier_phone = $4,
        supplier_email = $5,
        supplier_address = $6,
        supplier_gstin = $7,
        po_date = $8,
        due_date = $9,
        delivery_date = $10,
        reference_no = $11,
        revision_no = $12,
        total_items = $13,
        subtotal = $14,
        total_tax = $15,
        discount_amount = $16,
        round_off = $17,
        grand_total = $18,
        payment_terms = $19,
        status = $20,
        grn_no = $21,
        po_remark = $22,
        terms_conditions = $23,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $24
      RETURNING *;
    `, [
      data.supplierUid !== undefined ? data.supplierUid : currentPo.supplier_uid,
      data.supplierName || data.supplier || currentPo.supplier_name,
      data.contactPerson !== undefined ? data.contactPerson : currentPo.contact_person,
      data.supplierPhone !== undefined ? (data.supplierPhone || data.phone) : currentPo.supplier_phone,
      data.supplierEmail !== undefined ? (data.supplierEmail || data.email) : currentPo.supplier_email,
      data.supplierAddress !== undefined ? (data.supplierAddress || data.address) : currentPo.supplier_address,
      data.supplierGstin !== undefined ? (data.supplierGstin || data.gstin) : currentPo.supplier_gstin,
      data.poDate || currentPo.po_date,
      data.dueDate || currentPo.due_date,
      data.deliveryDate || currentPo.delivery_date,
      data.referenceNo !== undefined ? data.referenceNo : currentPo.reference_no,
      data.revisionNo !== undefined ? data.revisionNo : currentPo.revision_no,
      totalItems,
      subtotal,
      totalTax,
      discountAmount,
      roundOff,
      grandTotal,
      data.paymentTerms || currentPo.payment_terms,
      data.status || currentPo.status,
      data.grnNo !== undefined ? data.grnNo : currentPo.grn_no,
      data.poRemark !== undefined ? (data.poRemark || data.remark) : currentPo.po_remark,
      data.termsConditions !== undefined ? data.termsConditions : currentPo.terms_conditions,
      currentPo.id
    ]);

    const updatedPo = updateRes.rows[0];
    let updatedItems = [];

    if (items.length > 0) {
      await client.query(`DELETE FROM purchase_items WHERE purchase_id = $1;`, [currentPo.id]);
      for (const it of items) {
        const code = it.itemCode || it.code || it.pid || 'CUSTOM';
        const name = it.name || it.itemName || code;
        const unit = it.unit || 'NOS';
        const hsn = it.hsn || it.hsnCode || '';
        const qty = parseFloat(it.qty) || 1;
        const price = parseFloat(it.price || it.unitPrice) || 0;
        const discount = parseFloat(it.discount) || 0;
        const effectivePrice = Math.max(0, price - discount);
        const taxRate = parseFloat(it.tax || it.taxRate || it.gst) || 18;
        const itemSubtotal = Math.round((qty * effectivePrice) * 100) / 100;
        const taxAmount = Math.round(((itemSubtotal * taxRate) / 100) * 100) / 100;
        const remark = it.remark || '';

        const itRes = await client.query(`
          INSERT INTO purchase_items (
            purchase_id, po_no, item_code, item_name, unit, hsn_code,
            qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *;
        `, [
          currentPo.id, poNo, code, name, unit, hsn,
          qty, price, discount, effectivePrice, taxRate, taxAmount, itemSubtotal, remark
        ]);
        updatedItems.push(itRes.rows[0]);
      }
    } else {
      const existingItems = await client.query(`SELECT * FROM purchase_items WHERE purchase_id = $1 ORDER BY id ASC;`, [currentPo.id]);
      updatedItems = existingItems.rows;
    }

    await client.query('COMMIT');
    return formatPurchaseRow(updatedPo, updatedItems);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deletePurchase(idOrNo, companyId = 'comp_mann', branchCode = null) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let poRes;
    if (branchCode && branchCode !== '*' && branchCode !== 'ALL') {
      poRes = await client.query(`
        SELECT * FROM purchases 
        WHERE (id::text = $1 OR po_no = $1) AND company_id = $2 AND branch_code = $3
        LIMIT 1;
      `, [String(idOrNo), companyId, branchCode]);
    } else {
      poRes = await client.query(`
        SELECT * FROM purchases 
        WHERE (id::text = $1 OR po_no = $1) AND company_id = $2
        LIMIT 1;
      `, [String(idOrNo), companyId]);
    }

    if (!poRes.rows.length) {
      throw new Error(`Purchase order "${idOrNo}" not found`);
    }

    const po = poRes.rows[0];
    await client.query(`DELETE FROM purchase_items WHERE purchase_id = $1 OR po_no = $2;`, [po.id, po.po_no]);
    await client.query(`DELETE FROM purchases WHERE id = $1;`, [po.id]);

    await client.query('COMMIT');
    return { success: true, message: `Purchase order ${po.po_no} deleted successfully`, poNo: po.po_no };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ── Format cash book row for client ──
function formatCashBookRow(r) {
  return {
    id: r.id,
    entryNo: r.entry_no,
    no: r.entry_no,
    companyId: r.company_id || 'comp_mann',
    branchCode: r.branch_code,
    date: r.entry_date ? new Date(r.entry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    rawDate: r.entry_date,
    type: r.type,
    party: r.party,
    category: r.category,
    refNo: r.ref_no,
    narration: r.narration,
    drAmount: parseFloat(r.dr_amount) || 0,
    crAmount: parseFloat(r.cr_amount) || 0,
    balance: parseFloat(r.balance) || 0,
    paymentMode: r.payment_mode || 'Cash',
    reconciled: Boolean(r.reconciled),
    createdBy: r.created_by,
    createdAt: r.created_at
  };
}

async function getCashBookEntries(companyId = 'comp_mann', branchCode = 'AMD-01') {
  let cbRes;
  if (!branchCode || branchCode === '*' || branchCode === 'ALL') {
    cbRes = await pool.query(
      `SELECT * FROM cash_book WHERE company_id = $1 ORDER BY entry_date ASC, id ASC;`,
      [companyId]
    );
  } else {
    cbRes = await pool.query(
      `SELECT * FROM cash_book WHERE company_id = $1 AND branch_code = $2 ORDER BY entry_date ASC, id ASC;`,
      [companyId, branchCode]
    );
  }
  return cbRes.rows.map(formatCashBookRow);
}

async function createCashBookEntry(data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let entryNo = (data.entryNo || data.no || '').trim();
    if (!entryNo) {
      const branchEntries = await client.query(
        'SELECT entry_no FROM cash_book WHERE company_id = $1 AND branch_code = $2',
        [companyId, branchCode]
      );
      const existingNums = branchEntries.rows.map(r => {
        const m = (r.entry_no || '').match(/^(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      }).filter(n => !isNaN(n) && n > 0);

      const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
      let nextNum = maxNum + 1;
      let candidate = String(nextNum);

      while (true) {
        const check = await client.query(
          'SELECT 1 FROM cash_book WHERE company_id = $1 AND branch_code = $2 AND entry_no = $3 LIMIT 1',
          [companyId, branchCode, candidate]
        );
        if (check.rows.length === 0) {
          entryNo = candidate;
          break;
        }
        nextNum++;
        candidate = String(nextNum);
      }
    }

    const type = data.type || 'Receipt';
    let dr = parseFloat(data.drAmount || (type === 'Receipt' ? data.amount : 0)) || 0;
    let cr = parseFloat(data.crAmount || (type === 'Payment' ? data.amount : 0)) || 0;
    if (type === 'Contra') {
      if (data.isDeposit) {
        cr = parseFloat(data.amount) || cr;
        dr = 0;
      } else if (data.isWithdrawal) {
        dr = parseFloat(data.amount) || dr;
        cr = 0;
      }
    }

    // Compute running balance based on previous entry for this branch
    const prevRes = await client.query(
      `SELECT balance FROM cash_book WHERE company_id = $1 AND branch_code = $2 ORDER BY entry_date DESC, id DESC LIMIT 1;`,
      [companyId, branchCode]
    );
    const prevBalance = prevRes.rows.length ? parseFloat(prevRes.rows[0].balance) || 0 : 0;
    const newBalance = Math.round((prevBalance + dr - cr) * 100) / 100;

    const res = await client.query(`
      INSERT INTO cash_book (
        company_id, branch_code, entry_no, entry_date, type, party,
        category, ref_no, narration, dr_amount, cr_amount, balance,
        payment_mode, reconciled, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `, [
      companyId,
      branchCode,
      entryNo,
      data.entryDate || data.date || new Date(),
      type,
      data.party || 'General Party',
      data.category || 'General',
      data.refNo || data.referenceNo || '',
      data.narration || '',
      dr,
      cr,
      data.balance !== undefined ? parseFloat(data.balance) : newBalance,
      data.paymentMode || 'Cash',
      data.reconciled !== undefined ? Boolean(data.reconciled) : false,
      data.createdBy || 'Admin'
    ]);

    await client.query('COMMIT');
    return formatCashBookRow(res.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateCashBookEntry(idOrNo, data, companyId = 'comp_mann', branchCode = 'AMD-01') {
  const current = await pool.query(
    `SELECT * FROM cash_book WHERE (id::text = $1 OR entry_no = $1) AND company_id = $2 LIMIT 1;`,
    [String(idOrNo), companyId]
  );
  if (!current.rows.length) {
    throw new Error(`Cash book entry "${idOrNo}" not found`);
  }
  const cur = current.rows[0];

  const type = data.type || cur.type;
  const dr = data.drAmount !== undefined ? parseFloat(data.drAmount) : cur.dr_amount;
  const cr = data.crAmount !== undefined ? parseFloat(data.crAmount) : cur.cr_amount;

  const res = await pool.query(`
    UPDATE cash_book SET
      entry_date = $1,
      type = $2,
      party = $3,
      category = $4,
      ref_no = $5,
      narration = $6,
      dr_amount = $7,
      cr_amount = $8,
      payment_mode = $9,
      reconciled = $10,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING *;
  `, [
    data.entryDate || cur.entry_date,
    type,
    data.party || cur.party,
    data.category || cur.category,
    data.refNo !== undefined ? data.refNo : cur.ref_no,
    data.narration !== undefined ? data.narration : cur.narration,
    dr,
    cr,
    data.paymentMode || cur.payment_mode,
    data.reconciled !== undefined ? Boolean(data.reconciled) : cur.reconciled,
    cur.id
  ]);

  return formatCashBookRow(res.rows[0]);
}

async function deleteCashBookEntry(idOrNo, companyId = 'comp_mann', branchCode = null) {
  let res;
  if (branchCode && branchCode !== '*' && branchCode !== 'ALL') {
    res = await pool.query(
      `DELETE FROM cash_book WHERE (id::text = $1 OR entry_no = $1) AND company_id = $2 AND branch_code = $3 RETURNING *;`,
      [String(idOrNo), companyId, branchCode]
    );
  } else {
    res = await pool.query(
      `DELETE FROM cash_book WHERE (id::text = $1 OR entry_no = $1) AND company_id = $2 RETURNING *;`,
      [String(idOrNo), companyId]
    );
  }
  if (!res.rows.length) {
    throw new Error(`Cash book entry "${idOrNo}" not found`);
  }
  return { success: true, message: `Entry #${res.rows[0].entry_no} deleted successfully`, entryNo: res.rows[0].entry_no };
}

async function toggleCashBookReconciliation(idOrNo, companyId = 'comp_mann', branchCode = null) {
  let query = `
    UPDATE cash_book 
    SET reconciled = NOT reconciled, updated_at = CURRENT_TIMESTAMP
    WHERE (id::text = $1 OR entry_no = $1) AND company_id = $2
  `;
  const params = [String(idOrNo), companyId];
  if (branchCode && branchCode !== '*' && branchCode !== 'ALL') {
    query += ` AND branch_code = $3`;
    params.push(branchCode);
  }
  query += ` RETURNING *;`;

  const res = await pool.query(query, params);
  if (!res.rows.length) {
    throw new Error(`Cash book entry "${idOrNo}" not found`);
  }
  return formatCashBookRow(res.rows[0]);
}

// ── Categories & Subcategories (cat_sub table) ──
async function getCatalogCategories() {
  const res = await pool.query('SELECT * FROM cat_sub ORDER BY type ASC, tittle ASC;');
  return res.rows.map(r => ({
    id: r.id,
    tittle: r.tittle,
    sp_cat: r.sp_cat,
    type: r.type
  }));
}

async function createCatalogCategory(data) {
  const res = await pool.query(
    `INSERT INTO cat_sub (tittle, sp_cat, type) VALUES ($1, $2, $3) RETURNING *;`,
    [data.title || data.tittle, (data.sp_cat || '').toUpperCase(), data.type || 'category']
  );
  const r = res.rows[0];
  return {
    id: r.id,
    tittle: r.tittle,
    sp_cat: r.sp_cat,
    type: r.type
  };
}

async function deleteCatalogCategory(id) {
  const res = await pool.query('DELETE FROM cat_sub WHERE id = $1 RETURNING *;', [id]);
  return res.rows.length > 0;
}

// ── Users Management & Directory for Multi-User Access ──
async function getUserByUsernameOrEmail(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const res = await pool.query(`
    SELECT * FROM users 
    WHERE LOWER(username) = $1 OR LOWER(email) = $1
    LIMIT 1;
  `, [clean]);
  if (!res.rows.length) return null;
  const u = res.rows[0];
  return {
    id: u.user_id,
    user_id: u.user_id,
    db_id: u.id,
    username: u.username,
    email: u.email,
    passwordHash: u.password_hash,
    name: u.name,
    role: u.role,
    company_id: u.company_id || 'comp_mann',
    company_name: u.company_name || 'Mann Engineers Fire Safety',
    tenantId: u.company_id || 'comp_mann',
    branch_code: u.branch_code,
    branch_name: u.branch_name,
    isActive: u.is_active,
    failed_attempts: parseInt(u.failed_attempts, 10) || 0,
    locked_until: u.locked_until,
    status: u.status || (u.is_active ? 'ACTIVE' : 'INACTIVE'),
    allowedBranches: u.branch_code === '*' ? ['*'] : [u.branch_code]
  };
}

async function recordLoginAttempt(identifier, isSuccess = false, lockoutHours = 1) {
  if (!identifier) return { failedAttempts: 0, isLocked: false, lockedUntil: null };
  const clean = String(identifier).trim().toLowerCase();

  if (isSuccess) {
    try {
      await pool.query(`
        UPDATE users 
        SET failed_attempts = 0, locked_until = NULL, status = 'ACTIVE'
        WHERE LOWER(username) = $1 OR LOWER(email) = $1 OR user_id = $1 OR id::text = $1;
      `, [clean]);
    } catch (e) {
      console.warn('Could not reset failed attempts in DB:', e.message);
    }
    return { failedAttempts: 0, isLocked: false, lockedUntil: null };
  }

  // Failed password attempt
  try {
    const cur = await pool.query(`
      SELECT id, user_id, username, email, failed_attempts, locked_until 
      FROM users 
      WHERE LOWER(username) = $1 OR LOWER(email) = $1 OR user_id = $1 OR id::text = $1
      LIMIT 1;
    `, [clean]);

    let attempts = 1;
    if (cur.rows.length) {
      attempts = (parseInt(cur.rows[0].failed_attempts, 10) || 0) + 1;
    }

    if (attempts >= 3) {
      const lockedUntil = new Date(Date.now() + lockoutHours * 3600 * 1000);
      await pool.query(`
        UPDATE users 
        SET failed_attempts = $1, locked_until = $2, status = 'LOCKED'
        WHERE LOWER(username) = $3 OR LOWER(email) = $3 OR user_id = $3 OR id::text = $3;
      `, [attempts, lockedUntil, clean]);
      return {
        failedAttempts: attempts,
        isLocked: true,
        lockedUntil,
        remainingAttempts: 0
      };
    } else {
      await pool.query(`
        UPDATE users 
        SET failed_attempts = $1
        WHERE LOWER(username) = $2 OR LOWER(email) = $2 OR user_id = $2 OR id::text = $2;
      `, [attempts, clean]);
      return {
        failedAttempts: attempts,
        isLocked: false,
        lockedUntil: null,
        remainingAttempts: 3 - attempts
      };
    }
  } catch (err) {
    console.warn('Could not update failed attempt in DB:', err.message);
    return { failedAttempts: 1, isLocked: false, lockedUntil: null, remainingAttempts: 2 };
  }
}

async function unlockUserAccount(idOrUserId) {
  if (!idOrUserId) throw new Error('User ID required');
  const clean = String(idOrUserId).trim().toLowerCase();
  const isNumeric = !isNaN(idOrUserId);
  const where = isNumeric ? 'id = $1' : 'user_id = $1 OR LOWER(username) = $1 OR LOWER(email) = $1';
  const param = isNumeric ? parseInt(idOrUserId, 10) : clean;

  const res = await pool.query(`
    UPDATE users 
    SET failed_attempts = 0, locked_until = NULL, is_active = TRUE, status = 'ACTIVE'
    WHERE ${where}
    RETURNING *;
  `, [param]);
  if (!res.rows.length) throw new Error(`User "${idOrUserId}" not found`);
  const u = res.rows[0];
  return {
    id: u.id,
    userId: u.user_id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    companyId: u.company_id,
    companyName: u.company_name,
    branchCode: u.branch_code,
    branchName: u.branch_name,
    phone: u.phone || '',
    designation: u.designation || 'Staff',
    department: u.department || 'Operations',
    salary: parseFloat(u.salary) || 0,
    failedAttempts: 0,
    lockedUntil: null,
    isLocked: false,
    remainingMinutes: 0,
    isActive: true,
    status: 'Active'
  };
}

async function lockUserAccount(idOrUserId, hours = 1) {
  if (!idOrUserId) throw new Error('User ID required');
  const clean = String(idOrUserId).trim().toLowerCase();
  const isNumeric = !isNaN(idOrUserId);
  const where = isNumeric ? 'id = $1' : 'user_id = $1 OR LOWER(username) = $1 OR LOWER(email) = $1';
  const param = isNumeric ? parseInt(idOrUserId, 10) : clean;
  const lockedUntil = new Date(Date.now() + (parseInt(hours, 10) || 1) * 3600 * 1000);

  const res = await pool.query(`
    UPDATE users 
    SET failed_attempts = 3, locked_until = $1, status = 'LOCKED'
    WHERE ${where}
    RETURNING *;
  `, [lockedUntil, param]);
  if (!res.rows.length) throw new Error(`User "${idOrUserId}" not found`);
  const u = res.rows[0];
  return {
    id: u.id,
    userId: u.user_id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    companyId: u.company_id,
    companyName: u.company_name,
    branchCode: u.branch_code,
    branchName: u.branch_name,
    phone: u.phone || '',
    designation: u.designation || 'Staff',
    department: u.department || 'Operations',
    salary: parseFloat(u.salary) || 0,
    failedAttempts: 3,
    lockedUntil,
    isLocked: true,
    remainingMinutes: (parseInt(hours, 10) || 1) * 60,
    isActive: false,
    status: 'Locked'
  };
}

async function resetUserPassword(email, newPassword) {
  if (!email || !newPassword) throw new Error('Email and new password are required');
  const clean = email.trim().toLowerCase();
  const hash = bcrypt.hashSync(newPassword, 10);
  const res = await pool.query(`
    UPDATE users 
    SET password_hash = $1, failed_attempts = 0, locked_until = NULL, is_active = TRUE, status = 'ACTIVE'
    WHERE LOWER(email) = $2
    RETURNING id, user_id, email, name, company_id, status;
  `, [hash, clean]);
  return res.rows[0] || null;
}

async function getUsersDirectory() {
  const res = await pool.query(`SELECT id, user_id, username, email, name, role, company_id, company_name, branch_code, branch_name, is_active, created_at FROM users ORDER BY id ASC;`);
  return res.rows.map(u => ({
    id: u.user_id,
    userId: u.user_id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    companyId: u.company_id,
    companyName: u.company_name,
    branchCode: u.branch_code,
    branchName: u.branch_name,
    isActive: u.is_active,
    scopeDesc: u.role === 'TENANT_OWNER' ? 'Global Access (All Branches & HQ)' : `Isolated to ${u.branch_code} (${u.branch_name})`
  }));
}

// Fetch single company details by companyId from PostgreSQL
async function getCompanyById(companyId) {
  if (!companyId) return null;
  const res = await pool.query('SELECT * FROM companies WHERE id = $1 LIMIT 1', [companyId]);
  if (!res.rows.length) return null;
  const r = res.rows[0];
  return {
    id: r.id,
    tenant_id: r.tenant_id || r.id,
    slug: (r.name || 'company').toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: r.name,
    legalName: r.legal_name || r.name,
    gstin: r.gstin || '',
    pan: r.pan || '',
    address: r.address || '',
    pinCode: r.pin_code || '',
    state: r.state || '',
    country: r.country || 'India',
    status: r.status || 'ACTIVE',
    plan: 'Enterprise Pro',
    currency: r.currency || 'INR',
    logoText: r.name,
    primaryColor: r.primary_color || '#0284c7',
    privacyStatus: 'STRICT_LOCAL_AI'
  };
}

// Fetch all branches for a company from PostgreSQL
async function getBranches(companyId = 'comp_mann') {
  let query = 'SELECT * FROM branches';
  let params = [];
  if (companyId && companyId !== '*') {
    query += ' WHERE company_id = $1';
    params.push(companyId);
  }
  query += ' ORDER BY id ASC';
  const res = await pool.query(query, params);
  return res.rows.map(r => ({
    id: r.id,
    companyId: r.company_id,
    code: r.code,
    name: r.name,
    city: r.city,
    state: r.state || 'Gujarat',
    type: r.type || 'BRANCH_OFFICE',
    latitude: parseFloat(r.latitude) || 23.0225,
    longitude: parseFloat(r.longitude) || 72.5714,
    address: r.address || '',
    phone: r.phone || '',
    email: r.email || '',
    gstin: r.gstin || '',
    status: r.status || 'Active',
    createdAt: r.created_at
  }));
}

// Insert or update single branch into PostgreSQL
async function createBranch(data, companyId = 'comp_mann') {
  const code = (data.code || `BR-${Date.now()}`).toUpperCase().trim();
  const name = (data.name || 'New Branch').trim();
  const city = (data.city || 'Gujarat City').trim();
  const state = (data.state || 'Gujarat').trim();
  const type = data.type || 'BRANCH_OFFICE';
  const latitude = parseFloat(data.latitude ?? data.lat) || 23.0225;
  const longitude = parseFloat(data.longitude ?? data.lng) || 72.5714;
  const address = (data.address || '').trim();
  const phone = (data.phone || '').trim();
  const email = (data.email || '').trim();
  const gstin = (data.gstin || '').trim();
  const status = data.status || 'Active';

  const res = await pool.query(`
    INSERT INTO branches (company_id, code, name, city, state, type, latitude, longitude, address, phone, email, gstin, status, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)
    ON CONFLICT (company_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      type = EXCLUDED.type,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      address = EXCLUDED.address,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      gstin = EXCLUDED.gstin,
      status = EXCLUDED.status,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `, [companyId, code, name, city, state, type, latitude, longitude, address, phone, email, gstin, status]);

  const r = res.rows[0];
  return {
    id: r.id,
    companyId: r.company_id,
    code: r.code,
    name: r.name,
    city: r.city,
    state: r.state,
    type: r.type,
    latitude: parseFloat(r.latitude) || 23.0225,
    longitude: parseFloat(r.longitude) || 72.5714,
    address: r.address || '',
    phone: r.phone || '',
    email: r.email || '',
    gstin: r.gstin || '',
    status: r.status
  };
}

// Update existing branch data in PostgreSQL
async function updateBranch(codeOrId, data, companyId = null) {
  const fields = [];
  const params = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); params.push(data.name.trim()); }
  if (data.city !== undefined) { fields.push(`city = $${idx++}`); params.push(data.city.trim()); }
  if (data.state !== undefined) { fields.push(`state = $${idx++}`); params.push(data.state.trim()); }
  if (data.type !== undefined) { fields.push(`type = $${idx++}`); params.push(data.type); }
  if (data.latitude !== undefined || data.lat !== undefined) {
    fields.push(`latitude = $${idx++}`);
    params.push(parseFloat(data.latitude ?? data.lat) || 23.0225);
  }
  if (data.longitude !== undefined || data.lng !== undefined) {
    fields.push(`longitude = $${idx++}`);
    params.push(parseFloat(data.longitude ?? data.lng) || 72.5714);
  }
  if (data.address !== undefined) { fields.push(`address = $${idx++}`); params.push(data.address.trim()); }
  if (data.phone !== undefined) { fields.push(`phone = $${idx++}`); params.push(data.phone.trim()); }
  if (data.email !== undefined) { fields.push(`email = $${idx++}`); params.push(data.email.trim()); }
  if (data.gstin !== undefined) { fields.push(`gstin = $${idx++}`); params.push(data.gstin.trim()); }
  if (data.status !== undefined) { fields.push(`status = $${idx++}`); params.push(data.status); }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const isNumeric = !isNaN(codeOrId) && codeOrId !== '' && codeOrId !== null;
  let where = '';
  if (isNumeric) {
    where = `id = $${idx++}`;
    params.push(parseInt(codeOrId, 10));
  } else {
    where = `UPPER(TRIM(code)) = UPPER(TRIM($${idx++}))`;
    params.push(String(codeOrId).trim());
    if (companyId && companyId !== '*') {
      where += ` AND company_id = $${idx++}`;
      params.push(companyId);
    }
  }

  const query = `UPDATE branches SET ${fields.join(', ')} WHERE ${where} RETURNING *;`;
  let res = await pool.query(query, params);

  // Fallback: If not matched and companyId was specified with a branch code, try without companyId constraint
  if (!res.rows.length && !isNumeric && companyId && companyId !== '*') {
    const fallbackParams = params.slice(0, -1); // remove companyId
    const fallbackWhere = `UPPER(TRIM(code)) = UPPER(TRIM($${fallbackParams.length}))`;
    const fallbackQuery = `UPDATE branches SET ${fields.join(', ')} WHERE ${fallbackWhere} RETURNING *;`;
    res = await pool.query(fallbackQuery, fallbackParams);
  }

  if (!res.rows.length) throw new Error(`Branch "${codeOrId}" not found`);
  const r = res.rows[0];
  return {
    id: r.id,
    companyId: r.company_id,
    code: r.code,
    name: r.name,
    city: r.city,
    state: r.state,
    type: r.type,
    latitude: parseFloat(r.latitude) || 23.0225,
    longitude: parseFloat(r.longitude) || 72.5714,
    address: r.address || '',
    phone: r.phone || '',
    email: r.email || '',
    gstin: r.gstin || '',
    status: r.status
  };
}

// Update branch owner/manager password and credentials
async function updateBranchManagerCredentials(branchCode, { managerName, managerEmail, managerPassword }, companyId = null) {
  const fields = [];
  const params = [];
  let idx = 1;

  if (managerName && managerName.trim()) {
    fields.push(`name = $${idx++}`);
    params.push(managerName.trim());
  }
  if (managerEmail && managerEmail.trim()) {
    fields.push(`email = $${idx++}`);
    params.push(managerEmail.trim().toLowerCase());
  }
  if (managerPassword && managerPassword.trim()) {
    const hash = bcrypt.hashSync(managerPassword.trim(), 10);
    fields.push(`password_hash = $${idx++}`);
    params.push(hash);
  }

  if (fields.length === 0) return null;

  // First try to match branch manager assigned to this specific branch code
  let query = `UPDATE users SET ${fields.join(', ')} WHERE UPPER(TRIM(branch_code)) = UPPER(TRIM($${idx++}))`;
  params.push(String(branchCode).trim());

  if (companyId && companyId !== '*') {
    query += ` AND company_id = $${idx++}`;
    params.push(companyId);
  }
  query += ` RETURNING id, user_id, username, email, name, role, branch_code, company_id;`;

  let res = await pool.query(query, params);

  // If no branch-specific manager found, check if company owner manages all branches (branch_code = '*')
  if (!res.rows.length && companyId && companyId !== '*') {
    const ownerParams = params.slice(0, fields.length);
    let ownerIdx = fields.length + 1;
    ownerParams.push(companyId);
    const ownerQuery = `UPDATE users SET ${fields.join(', ')} WHERE company_id = $${ownerIdx++} AND (branch_code = '*' OR role = 'TENANT_OWNER') RETURNING id, user_id, username, email, name, role, branch_code, company_id;`;
    res = await pool.query(ownerQuery, ownerParams);
  }

  // Fallback: search by branchCode across all companies
  if (!res.rows.length) {
    const broadParams = params.slice(0, fields.length + 1);
    const broadQuery = `UPDATE users SET ${fields.join(', ')} WHERE UPPER(TRIM(branch_code)) = UPPER(TRIM($${fields.length + 1})) RETURNING id, user_id, username, email, name, role, branch_code, company_id;`;
    res = await pool.query(broadQuery, broadParams);
  }

  return res.rows[0] || null;
}

// Delete branch by ID from PostgreSQL
async function deleteBranch(id) {
  const res = await pool.query('DELETE FROM branches WHERE id = $1 RETURNING *', [id]);
  return res.rows.length > 0;
}

// ── Complete Consolidated Employee Management Functions ──
async function getAllEmployees(companyId = null, branchCode = null) {
  let query = `SELECT id, user_id, username, email, name, role, company_id, company_name, branch_code, branch_name, phone, designation, department, salary, joining_date, is_active, failed_attempts, locked_until, status, created_at FROM users`;
  const conditions = [];
  const params = [];
  let idx = 1;

  if (companyId && companyId !== '*' && companyId !== 'ALL') {
    conditions.push(`company_id = $${idx++}`);
    params.push(companyId);
  }
  if (branchCode && branchCode !== '*' && branchCode !== 'ALL') {
    conditions.push(`branch_code = $${idx++}`);
    params.push(branchCode);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY id ASC`;
  const res = await pool.query(query, params);
  const now = new Date();
  return res.rows.map(u => {
    const isLocked = Boolean(u.locked_until && new Date(u.locked_until) > now);
    const remainingMinutes = isLocked ? Math.max(1, Math.ceil((new Date(u.locked_until) - now) / 60000)) : 0;
    const effectiveStatus = isLocked ? 'Locked' : (u.status || (u.is_active ? 'Active' : 'Suspended'));
    return {
      id: u.id,
      userId: u.user_id,
      username: u.username,
      email: u.email,
      name: u.name,
      role: u.role,
      companyId: u.company_id,
      companyName: u.company_name,
      branchCode: u.branch_code,
      branchName: u.branch_name,
      phone: u.phone || '',
      designation: u.designation || (u.role === 'TENANT_OWNER' ? 'Owner / Director' : (u.role === 'BRANCH_MANAGER' ? 'Branch Manager' : 'Operations Staff')),
      department: u.department || (u.role === 'TENANT_OWNER' ? 'Executive' : 'Operations'),
      salary: parseFloat(u.salary) || 0,
      joiningDate: u.joining_date ? (u.joining_date instanceof Date ? u.joining_date.toISOString().split('T')[0] : String(u.joining_date).split('T')[0]) : '2025-01-15',
      failedAttempts: parseInt(u.failed_attempts, 10) || 0,
      lockedUntil: u.locked_until,
      isLocked,
      remainingMinutes,
      isActive: u.is_active && !isLocked,
      status: effectiveStatus,
      scopeDesc: u.role === 'TENANT_OWNER' ? 'Global Access (All Branches & HQ)' : `Isolated to ${u.branch_code} (${u.branch_name})`,
      createdAt: u.created_at
    };
  });
}

async function createEmployee(data, companyId = 'comp_mann') {
  const userId = data.userId || `USR-${Date.now().toString(36).toUpperCase()}`;
  const username = (data.username || (data.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '_')).trim();
  const email = (data.email || `${username}@mannengineers.in`).trim().toLowerCase();
  const password = data.password || 'Pass@123';
  const passwordHash = bcrypt.hashSync(password, 10);
  const name = (data.name || 'Staff Member').trim();
  const role = data.role || 'STAFF';
  const companyName = data.companyName || (companyId === 'comp_mashtech' ? 'Mash Tech' : 'Mann Engineers Fire Safety');
  const branchCode = data.branchCode || 'AMD-01';
  const branchName = data.branchName || (branchCode === 'BRD-02' ? 'Brd-Branch (Baroda)' : 'Amd-Branch (Ahmedabad)');
  const phone = data.phone || '';
  const designation = data.designation || 'Staff';
  const department = data.department || 'Operations';
  const salary = parseFloat(data.salary) || 0;
  const joiningDate = data.joiningDate || new Date().toISOString().split('T')[0];

  const res = await pool.query(`
    INSERT INTO users (
      user_id, username, email, password_hash, name, role, company_id, company_name,
      branch_code, branch_name, phone, designation, department, salary, joining_date, is_active, failed_attempts, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, TRUE, 0, 'ACTIVE')
    RETURNING *;
  `, [
    userId, username, email, passwordHash, name, role, companyId, companyName,
    branchCode, branchName, phone, designation, department, salary, joiningDate
  ]);

  const u = res.rows[0];
  return {
    id: u.id,
    userId: u.user_id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    companyId: u.company_id,
    companyName: u.company_name,
    branchCode: u.branch_code,
    branchName: u.branch_name,
    phone: u.phone || '',
    designation: u.designation || 'Staff',
    department: u.department || 'Operations',
    salary: parseFloat(u.salary) || 0,
    joiningDate: u.joining_date ? (u.joining_date instanceof Date ? u.joining_date.toISOString().split('T')[0] : String(u.joining_date).split('T')[0]) : joiningDate,
    failedAttempts: 0,
    lockedUntil: null,
    isLocked: false,
    remainingMinutes: 0,
    isActive: u.is_active,
    status: 'Active'
  };
}

async function updateEmployee(idOrUserId, data) {
  const fields = [];
  const params = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); params.push(data.name.trim()); }
  if (data.username !== undefined) { fields.push(`username = $${idx++}`); params.push(data.username.trim().toLowerCase()); }
  if (data.email !== undefined) { fields.push(`email = $${idx++}`); params.push(data.email.trim().toLowerCase()); }
  if (data.phone !== undefined) { fields.push(`phone = $${idx++}`); params.push(data.phone.trim()); }
  if (data.role !== undefined) { fields.push(`role = $${idx++}`); params.push(data.role); }
  if (data.branchCode !== undefined) { fields.push(`branch_code = $${idx++}`); params.push(data.branchCode); }
  if (data.branchName !== undefined) { fields.push(`branch_name = $${idx++}`); params.push(data.branchName); }
  if (data.designation !== undefined) { fields.push(`designation = $${idx++}`); params.push(data.designation); }
  if (data.department !== undefined) { fields.push(`department = $${idx++}`); params.push(data.department); }
  if (data.salary !== undefined) { fields.push(`salary = $${idx++}`); params.push(parseFloat(data.salary) || 0); }

  // Unlock action or Status = Active
  if (data.unlock === true || data.status === 'Active' || data.status === 'ACTIVE') {
    fields.push(`failed_attempts = 0`);
    fields.push(`locked_until = NULL`);
    fields.push(`is_active = TRUE`);
    fields.push(`status = 'ACTIVE'`);
  } else if (data.lock === true || data.status === 'Locked' || data.status === 'LOCKED' || data.status === 'Blocked') {
    const hours = parseInt(data.lockHours, 10) || 1;
    fields.push(`failed_attempts = 3`);
    fields.push(`locked_until = NOW() + INTERVAL '${hours} hour'`);
    fields.push(`status = 'LOCKED'`);
    fields.push(`is_active = FALSE`);
  } else if (data.status === 'Suspended' || data.status === 'INACTIVE' || data.status === 'Inactive') {
    fields.push(`is_active = FALSE`);
    fields.push(`status = 'INACTIVE'`);
  } else if (data.isActive !== undefined) {
    fields.push(`is_active = $${idx++}`);
    params.push(Boolean(data.isActive));
    fields.push(`status = $${idx++}`);
    params.push(data.isActive ? 'ACTIVE' : 'INACTIVE');
  }

  if (data.resetAttempts === true || data.failedAttempts === 0) {
    fields.push(`failed_attempts = 0`);
  }

  if (data.password && data.password.trim()) {
    fields.push(`password_hash = $${idx++}`);
    params.push(bcrypt.hashSync(data.password.trim(), 10));
    // If admin explicitly resets password, also unlock the user
    fields.push(`failed_attempts = 0`);
    fields.push(`locked_until = NULL`);
    fields.push(`status = 'ACTIVE'`);
    fields.push(`is_active = TRUE`);
  }

  if (fields.length === 0) throw new Error('No update fields provided');

  const isNumeric = !isNaN(idOrUserId);
  let where = '';
  if (isNumeric) {
    where = `id = $${idx++}`;
    params.push(parseInt(idOrUserId, 10));
  } else {
    where = `user_id = $${idx} OR username = $${idx} OR LOWER(email) = LOWER($${idx++})`;
    params.push(String(idOrUserId));
  }

  const query = `UPDATE users SET ${fields.join(', ')} WHERE ${where} RETURNING *;`;
  const res = await pool.query(query, params);
  if (!res.rows.length) throw new Error(`User/Employee "${idOrUserId}" not found`);
  const u = res.rows[0];
  const now = new Date();
  const isLocked = Boolean(u.locked_until && new Date(u.locked_until) > now);
  const remainingMinutes = isLocked ? Math.max(1, Math.ceil((new Date(u.locked_until) - now) / 60000)) : 0;
  return {
    id: u.id,
    userId: u.user_id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    companyId: u.company_id,
    companyName: u.company_name,
    branchCode: u.branch_code,
    branchName: u.branch_name,
    phone: u.phone || '',
    designation: u.designation || 'Staff',
    department: u.department || 'Operations',
    salary: parseFloat(u.salary) || 0,
    failedAttempts: parseInt(u.failed_attempts, 10) || 0,
    lockedUntil: u.locked_until,
    isLocked,
    remainingMinutes,
    isActive: u.is_active && !isLocked,
    status: isLocked ? 'Locked' : (u.status || (u.is_active ? 'Active' : 'Suspended'))
  };
}

async function deleteEmployee(idOrUserId) {
  const isNumeric = !isNaN(idOrUserId);
  const where = isNumeric ? `id = $1` : `user_id = $1`;
  const param = isNumeric ? parseInt(idOrUserId, 10) : String(idOrUserId);
  const res = await pool.query(`DELETE FROM users WHERE ${where} RETURNING *;`, [param]);
  return res.rows.length > 0;
}

// ─── Customer Holds & Pickups ───────────────────────────────────────────────
async function getCustomerHolds(companyId = 'comp_mann', branchCode = null) {
  let query = `
    SELECT 
      id, hold_no, company_id, branch_code, customer_name, customer_phone, customer_email,
      item_code, item_name, qty, unit_price, total_amount, hold_date, expires_at,
      status, invoice_no, notes, created_by, created_at, updated_at,
      CASE 
        WHEN status = 'BILLED' THEN 'BILLED'
        WHEN status = 'CANCELLED' THEN 'CANCELLED'
        WHEN expires_at < CURRENT_TIMESTAMP THEN 'EXPIRED'
        WHEN expires_at <= CURRENT_TIMESTAMP + INTERVAL '1 hour' THEN 'EXPIRING_SOON'
        ELSE 'ACTIVE'
      END as computed_status,
      GREATEST(0, EXTRACT(EPOCH FROM (expires_at - CURRENT_TIMESTAMP)))::int as seconds_left
    FROM customer_holds
    WHERE company_id = $1
  `;
  const params = [companyId];
  if (branchCode && branchCode !== '*') {
    query += ` AND branch_code = $2`;
    params.push(branchCode);
  }
  query += ` ORDER BY created_at DESC;`;
  const res = await pool.query(query, params);
  return res.rows;
}

async function createCustomerHold(data) {
  const companyId = data.company_id || data.companyId || 'comp_mann';
  const branchCode = data.branch_code || data.branchCode || 'AMD-01';
  
  let holdNo = data.hold_no || data.holdNo;
  if (!holdNo) {
    const countRes = await pool.query(`SELECT COUNT(*) FROM customer_holds WHERE company_id = $1`, [companyId]);
    const num = parseInt(countRes.rows[0].count, 10) + 127;
    holdNo = `RSV-2026-${String(num).padStart(6, '0')}`;
  }

  const hours = parseFloat(data.hours_valid || data.hoursValid || 4);
  const qty = parseFloat(data.qty) || 1;
  const unitPrice = parseFloat(data.unit_price || data.unitPrice) || 0;
  const totalAmount = parseFloat(data.total_amount || data.totalAmount) || (qty * unitPrice);

  const res = await pool.query(`
    INSERT INTO customer_holds (
      hold_no, company_id, branch_code, customer_name, customer_phone, customer_email,
      item_code, item_name, qty, unit_price, total_amount, expires_at, status, notes, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP + ($12 || ' hours')::interval, 'ACTIVE', $13, $14
    ) RETURNING *;
  `, [
    holdNo, companyId, branchCode, data.customer_name || data.customer || 'Walk-in Client',
    data.customer_phone || data.phone || '', data.customer_email || data.email || '',
    data.item_code || data.sku || 'FE-ABC-4', data.item_name || data.item || 'Fire Extinguisher',
    qty, unitPrice, totalAmount, hours, data.notes || '', data.created_by || 'Staff'
  ]);
  return res.rows[0];
}

async function updateCustomerHoldStatus(id, status, invoiceNo = '') {
  const res = await pool.query(`
    UPDATE customer_holds
    SET status = $1, invoice_no = COALESCE(NULLIF($2, ''), invoice_no), updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
  `, [status, invoiceNo, id]);
  return res.rows[0] || null;
}

async function deleteCustomerHold(id) {
  const res = await pool.query(`DELETE FROM customer_holds WHERE id = $1 RETURNING *;`, [id]);
  return res.rows.length > 0;
}

// ─── Stock Transfers ────────────────────────────────────────────────────────
async function getStockTransfers(companyId = 'comp_mann', branchCode = null) {
  let query = `
    SELECT 
      id, transfer_no, company_id, from_branch, to_branch,
      item_code, item_name, qty, unit_price, total_value,
      vehicle_no, driver_name, driver_phone, status,
      transfer_date, received_date, dispatch_notes, received_notes,
      created_by, created_at, updated_at
    FROM stock_transfers
    WHERE company_id = $1
  `;
  const params = [companyId];
  if (branchCode && branchCode !== '*') {
    query += ` AND (from_branch = $2 OR to_branch = $2)`;
    params.push(branchCode);
  }
  query += ` ORDER BY created_at DESC;`;
  const res = await pool.query(query, params);
  return res.rows;
}

async function createStockTransfer(data) {
  const companyId = data.company_id || data.companyId || 'comp_mann';
  const fromBranch = data.from_branch || data.fromBranch || 'AMD-01';
  const toBranch = data.to_branch || data.toBranch || 'BRD-02';
  const qty = parseFloat(data.qty || data.items) || 1;
  const unitPrice = parseFloat(data.unit_price || data.unitPrice) || 1850;
  const totalValue = parseFloat(data.total_value || data.totalValue) || (qty * unitPrice);

  let transferNo = data.transfer_no || data.transferNo || data.no;
  if (!transferNo) {
    const countRes = await pool.query(`SELECT COUNT(*) FROM stock_transfers WHERE company_id = $1`, [companyId]);
    const num = parseInt(countRes.rows[0].count, 10) + 47;
    transferNo = `STR-${String(num).padStart(4, '0')}`;
  }

  // Deduct stock from source branch if exists
  try {
    await pool.query(`
      UPDATE product
      SET current_stock = GREATEST(0, current_stock - $1)
      WHERE company_id = $2 AND branch_code = $3 AND pid = $4
    `, [qty, companyId, fromBranch, data.item_code || data.transferSku || 'FE-ABC-4']);
  } catch (stockErr) {
    console.warn('Could not auto-decrement source stock:', stockErr.message);
  }

  const res = await pool.query(`
    INSERT INTO stock_transfers (
      transfer_no, company_id, from_branch, to_branch, item_code, item_name,
      qty, unit_price, total_value, vehicle_no, driver_name, driver_phone,
      status, transfer_date, dispatch_notes, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'In Transit', CURRENT_DATE, $13, $14
    ) RETURNING *;
  `, [
    transferNo, companyId, fromBranch, toBranch,
    data.item_code || data.transferSku || 'FE-ABC-4',
    data.item_name || data.name || 'ABC Dry Powder Extinguisher 4kg',
    qty, unitPrice, totalValue,
    data.vehicle_no || data.vehicle || 'GJ-01-TR-4501',
    data.driver_name || 'Ramesh Patel',
    data.driver_phone || '+91 98250 12345',
    data.dispatch_notes || data.reason || 'Inter-branch stock transfer',
    data.created_by || 'Admin'
  ]);
  return res.rows[0];
}

async function receiveStockTransfer(id, receiverUser = 'Staff', notes = '') {
  // 1. Fetch transfer details
  const getRes = await pool.query(`SELECT * FROM stock_transfers WHERE id = $1`, [id]);
  if (!getRes.rows.length) return null;
  const transfer = getRes.rows[0];

  // 2. Adjust branch-specific stock in branch_stock
  try {
    // Decrement origin branch stock
    await pool.query(`
      UPDATE branch_stock
      SET current_stock = GREATEST(0, current_stock - $1), updated_at = CURRENT_TIMESTAMP
      WHERE company_id = $2 AND branch_code = $3 AND pid = $4;
    `, [parseFloat(transfer.qty), transfer.company_id, transfer.from_branch, transfer.item_code]);

    // Increment destination branch stock
    await pool.query(`
      INSERT INTO branch_stock (company_id, branch_code, pid, current_stock, min_stock, status, updated_at)
      VALUES ($1, $2, $3, $4, 10, 'OK', CURRENT_TIMESTAMP)
      ON CONFLICT (company_id, branch_code, pid) DO UPDATE SET
        current_stock = branch_stock.current_stock + EXCLUDED.current_stock,
        status = 'OK',
        updated_at = CURRENT_TIMESTAMP;
    `, [transfer.company_id, transfer.to_branch, transfer.item_code, parseFloat(transfer.qty)]);
  } catch (prodErr) {
    console.warn('Could not update branch_stock on transfer receive:', prodErr.message);
  }

  // 3. Mark transfer as Received
  const updateRes = await pool.query(`
    UPDATE stock_transfers
    SET status = 'Received', received_date = CURRENT_TIMESTAMP, received_notes = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `, [notes || `Received and verified by ${receiverUser}`, id]);
  return updateRes.rows[0];
}

async function updateStockTransferStatus(id, status) {
  const res = await pool.query(`
    UPDATE stock_transfers
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `, [status, id]);
  return res.rows[0] || null;
}

async function deleteStockTransfer(id) {
  const res = await pool.query(`DELETE FROM stock_transfers WHERE id = $1 RETURNING *;`, [id]);
  return res.rows.length > 0;
}

// Complete onboarding: creates company, branches, and tenant owner user in PostgreSQL
async function saveOnboardingData({ user, company, branches = [] }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Derive clean company id & tenant slug
    const cleanCompName = (company.name || 'Company').trim();
    const slugBase = cleanCompName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'comp';
    const randSuffix = Math.random().toString(36).substring(2, 6);
    const companyId = `comp_${slugBase}_${randSuffix}`;

    const gstin = (company.gstNumber || '').toUpperCase().trim();
    const pan = gstin.length >= 12 ? gstin.substring(2, 12) : '';

    await client.query(`
      INSERT INTO companies (
        id, tenant_id, name, legal_name, gstin, pan, address, pin_code, state, country, status
      ) VALUES ($1, $1, $2, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        gstin = EXCLUDED.gstin,
        address = EXCLUDED.address,
        updated_at = CURRENT_TIMESTAMP;
    `, [
      companyId,
      cleanCompName,
      gstin,
      pan,
      company.address || '',
      company.pinCode || '',
      company.state || '',
      company.country || 'India'
    ]);

    // 2. Insert Branches
    const branchList = Array.isArray(branches) && branches.length > 0 ? branches : [
      {
        branchName: `${cleanCompName} (HQ)`,
        branchCode: 'HQ-01',
        city: company.state || 'Headquarters',
        state: company.state || 'Gujarat',
        address: company.address || '',
        phone: '',
        contactPerson: user.name || 'Admin',
        branchGst: gstin
      }
    ];

    const insertedBranches = [];
    for (let i = 0; i < branchList.length; i++) {
      const b = branchList[i];
      const code = (b.branchCode || `BR-${i + 1}`).toUpperCase().trim();
      const name = (b.branchName || `Branch ${i + 1}`).trim();
      const city = b.city || b.state || company.state || 'City';
      const state = b.state || company.state || 'State';
      const address = b.address || company.address || '';
      const phone = b.phone || '';
      const bGst = (b.branchGst || gstin).toUpperCase().trim();
      const lat = 23.0225 + (i * 0.05);
      const lng = 72.5714 + (i * 0.05);

      const bRes = await client.query(`
        INSERT INTO branches (
          company_id, code, name, city, state, type, latitude, longitude, address, phone, email, gstin, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Active')
        ON CONFLICT (company_id, code) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          address = EXCLUDED.address,
          phone = EXCLUDED.phone,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `, [
        companyId, code, name, city, state, i === 0 ? 'FLAGSHIP_STORE' : 'BRANCH_OFFICE',
        lat, lng, address, phone, user.email, bGst
      ]);
      insertedBranches.push(bRes.rows[0]);
    }

    // 3. Create or Update Owner User in PostgreSQL users table
    const email = user.email.toLowerCase().trim();
    const rawPassword = user.password || 'Pass@123';
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const userId = `USR-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const userName = (user.name || cleanCompName + ' Admin').trim();
    const primaryPhone = branchList[0]?.phone || '';

    let savedUser;
    const existingUser = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existingUser.rowCount > 0) {
      const uRes = await client.query(`
        UPDATE users SET
          password_hash = $1,
          name = $2,
          role = 'TENANT_OWNER',
          company_id = $3,
          company_name = $4,
          branch_code = '*',
          branch_name = 'All Branches (Master HQ)',
          phone = $5,
          is_active = TRUE
        WHERE email = $6
        RETURNING *;
      `, [passwordHash, userName, companyId, cleanCompName, primaryPhone, email]);
      savedUser = uRes.rows[0];
    } else {
      const uRes = await client.query(`
        INSERT INTO users (
          user_id, username, email, password_hash, name, role, company_id, company_name,
          branch_code, branch_name, phone, designation, department, salary, joining_date, is_active
        ) VALUES ($1, $2, $3, $4, $5, 'TENANT_OWNER', $6, $7, '*', 'All Branches (Master HQ)', $8, 'Company Owner', 'Executive', 0, CURRENT_DATE, TRUE)
        RETURNING *;
      `, [userId, email, email, passwordHash, userName, companyId, cleanCompName, primaryPhone]);
      savedUser = uRes.rows[0];
    }

    // 4. Seed default Chart of Accounts for the new company
    await client.query(`
      INSERT INTO chart_of_accounts (
        company_id, name, nature, account_group, opening_balance, current_balance, balance_type, child_ledgers_count, is_system_locked
      ) VALUES 
        ($1, 'Cash on Hand Vault', 'Asset', 'Cash & Bank Balances', 25000.00, 25000.00, 'Debit', 0, false),
        ($1, 'Primary Commercial Bank Account', 'Asset', 'Bank Accounts', 150000.00, 150000.00, 'Debit', 0, false),
        ($1, 'Stock & Inventory Ledger', 'Asset', 'Current Assets', 85000.00, 85000.00, 'Debit', 0, false),
        ($1, 'Direct Sales Revenue', 'Revenue', 'Operating Revenue', 0.00, 0.00, 'Credit', 0, false),
        ($1, 'Cost of Goods Sold (COGS)', 'Expense', 'Direct Cost of Sales', 0.00, 0.00, 'Debit', 0, false);
    `, [companyId]);

    // 5. Seed starter products and branch_stock for each branch
    const sampleProducts = [
      { pid: 'PRD-START-01', name: 'Commercial Starter Pack Item A', cat: 'Standard Supplies', price: 1500, cost: 950, stock: 45 },
      { pid: 'PRD-START-02', name: 'Enterprise Inventory Item B', cat: 'Equipment', price: 3200, cost: 2100, stock: 25 },
      { pid: 'PRD-START-03', name: 'Universal Consumable Item C', cat: 'Consumables', price: 450, cost: 280, stock: 80 }
    ];

    for (const sp of sampleProducts) {
      await client.query(`
        INSERT INTO product (
          company_id, pid, name, description, category, sub_category, supplier,
          sale_price, purchase_price, gst, current_stock, min_stock, exp_months, status
        ) VALUES (
          $1, $2, $3, 'Initial inventory item generated during business setup',
          $4, 'Commercial Supplies', 'Standard Enterprise Supplier',
          $5, $6, 18, $7, 10.00, 12, 'OK'
        ) ON CONFLICT (company_id, pid) DO NOTHING;
      `, [companyId, sp.pid, sp.name, sp.cat, sp.price, sp.cost, sp.stock]);

      for (const ib of insertedBranches) {
        await client.query(`
          INSERT INTO branch_stock (
            company_id, branch_code, pid, current_stock, min_stock, status
          ) VALUES ($1, $2, $3, $4, 10.00, 'OK')
          ON CONFLICT DO NOTHING;
        `, [companyId, ib.code, sp.pid, sp.stock]);
      }
    }

    await client.query('COMMIT');

    return {
      companyId,
      company: {
        id: companyId,
        tenantId: companyId,
        name: cleanCompName,
        legalName: cleanCompName,
        gstin,
        pan,
        address: company.address || '',
        pinCode: company.pinCode || '',
        state: company.state || '',
        country: company.country || 'India',
        status: 'ACTIVE'
      },
      branches: insertedBranches.map(b => ({
        id: b.id,
        code: b.code,
        name: b.name,
        city: b.city,
        state: b.state,
        type: b.type,
        address: b.address,
        phone: b.phone,
        gstin: b.gstin
      })),
      user: {
        id: savedUser.id,
        userId: savedUser.user_id,
        username: savedUser.username,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        companyId: savedUser.company_id,
        companyName: savedUser.company_name,
        branch_code: savedUser.branch_code,
        branch_name: savedUser.branch_name,
        is_active: savedUser.is_active
      }
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  saveOnboardingData,
  pool,
  initDatabase,
  getCompanyById,
  getBranches,
  createBranch,
  updateBranch,
  updateBranchManagerCredentials,
  deleteBranch,
  getProductsByBranch,
  getNetworkBranchStock,
  getTopSellingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts,
  updateStockCount,
  getInvoicesByBranch,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getPurchasesByBranch,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getCashBookEntries,
  createCashBookEntry,
  updateCashBookEntry,
  deleteCashBookEntry,
  toggleCashBookReconciliation,
  getCustomers,
  createCustomer,
  getCatalogCategories,
  createCatalogCategory,
  deleteCatalogCategory,
  getUserByUsernameOrEmail,
  recordLoginAttempt,
  unlockUserAccount,
  lockUserAccount,
  resetUserPassword,
  getUsersDirectory,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getCustomerHolds,
  createCustomerHold,
  updateCustomerHoldStatus,
  deleteCustomerHold,
  getStockTransfers,
  createStockTransfer,
  receiveStockTransfer,
  updateStockTransferStatus,
  deleteStockTransfer,
  pool,
  getChartOfAccounts,
  createChartOfAccount,
  getAccountVouchers,
  deleteChartOfAccount,
  getFinancialPeriods,
  lockFinancialPeriod,
  unlockFinancialPeriod,
  createFinancialPeriod,
  getLossPreventionSummary,
  getLossAlerts,
  resolveLossAlert,
  getStockAdjustments,
  recordStockAdjustmentDecision,
  createStockAdjustment,
  getCycleCounts,
  createCycleCount,
  getBranchShrinkBenchmarks,
  getProductCustomerPurchases
};

// ─── FINANCIALS, COA, FINANCIAL PERIODS & LOSS PREVENTION ───

async function getChartOfAccounts(companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, company_id, name, nature, account_group,
             opening_balance, current_balance, balance_type,
             child_ledgers_count, is_system_locked, notes, created_at, updated_at
      FROM chart_of_accounts
      WHERE company_id = $1
      ORDER BY
        CASE nature
          WHEN 'EQUITY' THEN 1
          WHEN 'LIABILITY' THEN 2
          WHEN 'ASSET' THEN 3
          WHEN 'INCOME' THEN 4
          WHEN 'EXPENSE' THEN 5
          ELSE 6
        END, name ASC
    `, [companyId]);
    return res.rows;
  } finally {
    client.release();
  }
}

async function createChartOfAccount({ companyId = 'comp_mann', name, nature, accountGroup = 'General', openingBalance = 0, balanceType = 'DR', notes = '' }) {
  const client = await pool.connect();
  try {
    const numBal = parseFloat(openingBalance) || 0;
    const res = await client.query(`
      INSERT INTO chart_of_accounts (company_id, name, nature, account_group, opening_balance, current_balance, balance_type, child_ledgers_count, is_system_locked, notes)
      VALUES ($1, $2, $3, $4, $5, $5, $6, 1, false, $7)
      RETURNING *
    `, [companyId, name.trim(), nature.toUpperCase(), accountGroup, numBal, balanceType.toUpperCase(), notes]);

    const account = res.rows[0];
    if (numBal > 0) {
      await client.query(`
        INSERT INTO account_vouchers (company_id, account_id, voucher_no, voucher_type, narration, debit_amount, credit_amount)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        companyId,
        account.id,
        `VCH-OPN-${account.id}`,
        balanceType.toUpperCase() === 'DR' ? 'Debit Opening' : 'Credit Opening',
        `Opening balance for ${name.trim()}`,
        balanceType.toUpperCase() === 'DR' ? numBal : 0,
        balanceType.toUpperCase() === 'CR' ? numBal : 0
      ]);
    }
    return account;
  } finally {
    client.release();
  }
}

async function getAccountVouchers(accountId, companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, voucher_no, TO_CHAR(voucher_date, 'DD Mon YYYY') as voucher_date,
             voucher_type, narration, debit_amount, credit_amount, created_at
      FROM account_vouchers
      WHERE account_id = $1 AND company_id = $2
      ORDER BY voucher_date DESC, id DESC
      LIMIT 50
    `, [accountId, companyId]);
    return res.rows;
  } finally {
    client.release();
  }
}

async function deleteChartOfAccount(id, companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const check = await client.query('SELECT is_system_locked FROM chart_of_accounts WHERE id = $1 AND company_id = $2', [id, companyId]);
    if (check.rows.length === 0) return { success: false, message: 'Account not found' };
    if (check.rows[0].is_system_locked) return { success: false, message: 'Cannot delete protected system account' };

    await client.query('DELETE FROM chart_of_accounts WHERE id = $1 AND company_id = $2', [id, companyId]);
    return { success: true };
  } finally {
    client.release();
  }
}

async function getFinancialPeriods(companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, company_id, fiscal_year, month_name,
             TO_CHAR(period_start, 'YYYY-MM-DD') as period_start,
             TO_CHAR(period_end, 'YYYY-MM-DD') as period_end,
             status, vouchers_count, locked_by,
             TO_CHAR(locked_at, 'DD Mon YYYY') as locked_at,
             lock_hash, notes
      FROM financial_periods
      WHERE company_id = $1
      ORDER BY period_start ASC
    `, [companyId]);
    return res.rows;
  } finally {
    client.release();
  }
}

async function lockFinancialPeriod(id, lockedBy = 'Tenant Owner', notes = '') {
  const client = await pool.connect();
  try {
    const lockHash = 'SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const res = await client.query(`
      UPDATE financial_periods
      SET status = 'Locked',
          locked_by = $2,
          locked_at = CURRENT_TIMESTAMP,
          lock_hash = $3,
          notes = CASE WHEN $4 != '' THEN $4 ELSE notes END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, lockedBy, lockHash, notes]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

async function unlockFinancialPeriod(id, notes = '') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      UPDATE financial_periods
      SET status = 'Open',
          locked_by = '—',
          locked_at = NULL,
          lock_hash = NULL,
          notes = CASE WHEN $2 != '' THEN $2 ELSE notes END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, notes]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

async function createFinancialPeriod({ companyId = 'comp_mann', fiscalYear = '2025–2026', monthName, periodStart, periodEnd, notes = '' }) {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      INSERT INTO financial_periods (company_id, fiscal_year, month_name, period_start, period_end, status, vouchers_count, locked_by, notes)
      VALUES ($1, $2, $3, $4, $5, 'Open', 0, '—', $6)
      RETURNING *
    `, [companyId, fiscalYear, monthName, periodStart, periodEnd, notes]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

async function getLossPreventionSummary(companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const activeAlerts = await client.query(`SELECT COUNT(*) FROM loss_alerts WHERE company_id = $1 AND status = 'ACTIVE'`, [companyId]);
    const pendingApprovals = await client.query(`SELECT COUNT(*), COALESCE(SUM(loss_value), 0) as total_loss FROM stock_adjustments WHERE company_id = $1 AND status = 'PENDING'`, [companyId]);
    const approvedLoss = await client.query(`SELECT COALESCE(SUM(loss_value), 0) as total_approved FROM stock_adjustments WHERE company_id = $1 AND status = 'APPROVED'`, [companyId]);
    const totalTurnover = await client.query(`SELECT COALESCE(SUM(monthly_turnover), 1) as turnover, COALESCE(SUM(variance_value), 0) as variance FROM branch_shrink_benchmarks WHERE company_id = $1`, [companyId]);

    const turnover = parseFloat(totalTurnover.rows[0].turnover) || 1;
    const varianceVal = parseFloat(totalTurnover.rows[0].variance) || 0;
    const shrinkRate = ((varianceVal / turnover) * 100).toFixed(2);

    return {
      overallShrinkRate: `${shrinkRate}%`,
      unexplainedVariance: `₹${varianceVal.toLocaleString('en-IN')}`,
      loggedDamagedGoods: `₹${parseFloat(approvedLoss.rows[0].total_approved || pendingApprovals.rows[0].total_loss || 4975).toLocaleString('en-IN')}`,
      activeInquiries: `${parseInt(activeAlerts.rows[0].count, 10)} Cases`,
      pendingApprovalsCount: parseInt(pendingApprovals.rows[0].count, 10)
    };
  } finally {
    client.release();
  }
}

async function getLossAlerts(companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, company_id, branch_code, title, description, severity, category, status, incident_time, created_at
      FROM loss_alerts
      WHERE company_id = $1
      ORDER BY id DESC
    `, [companyId]);
    return res.rows;
  } finally {
    client.release();
  }
}

async function resolveLossAlert(id, companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      UPDATE loss_alerts
      SET status = 'RESOLVED'
      WHERE id = $1 AND company_id = $2
      RETURNING *
    `, [id, companyId]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

async function getStockAdjustments(companyId = 'comp_mann', statusFilter = null, branchCode = null) {
  const client = await pool.connect();
  try {
    let query = `
      SELECT id, adjustment_no, company_id, branch_code, item_name, sku,
             quantity, loss_value, reason_code, requested_by,
             TO_CHAR(request_date, 'DD Mon YYYY') as request_date,
             photo_evidence, photo_url, status, reviewed_by,
             TO_CHAR(reviewed_at, 'DD Mon YYYY HH24:MI') as reviewed_at,
             review_notes
      FROM stock_adjustments
      WHERE company_id = $1
    `;
    const params = [companyId];
    if (statusFilter) {
      params.push(statusFilter);
      query += ` AND status = $${params.length}`;
    }
    if (branchCode) {
      params.push(branchCode);
      query += ` AND branch_code = $${params.length}`;
    }
    query += ` ORDER BY id DESC`;
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

async function recordStockAdjustmentDecision(id, decision, reviewedBy = 'Tenant Owner', notes = '') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const res = await client.query(`
      UPDATE stock_adjustments
      SET status = $2,
          reviewed_by = $3,
          reviewed_at = CURRENT_TIMESTAMP,
          review_notes = $4
      WHERE id = $1
      RETURNING *
    `, [id, status, reviewedBy, notes]);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const adj = res.rows[0];

    // If approved, deduct quantity from product and branch_stock tables
    if (status === 'APPROVED') {
      try {
        await client.query(`
          UPDATE product
          SET current_stock = GREATEST(0, current_stock - $1),
              updated_at = CURRENT_TIMESTAMP
          WHERE branch_code = $2 AND pid = $3
        `, [adj.quantity, adj.branch_code, adj.sku]);

        await client.query(`
          UPDATE branch_stock
          SET current_stock = GREATEST(0, current_stock - $1),
              updated_at = CURRENT_TIMESTAMP
          WHERE branch_code = $2 AND pid = $3
        `, [adj.quantity, adj.branch_code, adj.sku]);
      } catch (errStock) {
        console.warn('Notice: Stock deduction sync note:', errStock.message);
      }
    }

    await client.query('COMMIT');
    return adj;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createStockAdjustment({ companyId = 'comp_mann', branchCode = 'AMD-01', itemName, sku, quantity = 1, lossValue = 0, reasonCode = 'DAMAGED_IN_TRANSIT', requestedBy = 'Staff', photoEvidence = true, photoUrl = '' }) {
  const client = await pool.connect();
  try {
    const adjCount = await client.query('SELECT COUNT(*) FROM stock_adjustments');
    const nextNum = parseInt(adjCount.rows[0].count, 10) + 1;
    const adjNo = `ADJ-2025-${String(nextNum).padStart(3, '0')}`;

    const res = await client.query(`
      INSERT INTO stock_adjustments (adjustment_no, company_id, branch_code, item_name, sku, quantity, loss_value, reason_code, requested_by, request_date, photo_evidence, photo_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10, $11, 'PENDING')
      RETURNING *
    `, [adjNo, companyId, branchCode, itemName, sku, parseInt(quantity, 10), parseFloat(lossValue), reasonCode, requestedBy, photoEvidence, photoUrl]);

    return res.rows[0];
  } finally {
    client.release();
  }
}

async function getCycleCounts(companyId = 'comp_mann', branchCode = null) {
  const client = await pool.connect();
  try {
    let query = `
      SELECT id, session_no, company_id, branch_code, count_mode, section,
             auditor_name, system_qty, physical_qty, variance_qty, status,
             TO_CHAR(session_date, 'DD Mon YYYY') as session_date, notes
      FROM cycle_counts
      WHERE company_id = $1
    `;
    const params = [companyId];
    if (branchCode) {
      params.push(branchCode);
      query += ` AND branch_code = $${params.length}`;
    }
    query += ` ORDER BY id DESC`;
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

async function createCycleCount({ companyId = 'comp_mann', branchCode = 'AMD-01', countMode = 'Blind Count', section, auditorName, systemQty = 0, physicalQty = 0, notes = '' }) {
  const client = await pool.connect();
  try {
    const countsCount = await client.query('SELECT COUNT(*) FROM cycle_counts');
    const nextNum = parseInt(countsCount.rows[0].count, 10) + 1;
    const sessionNo = `CNT-2025-${String(nextNum).padStart(3, '0')}`;
    const sys = parseInt(systemQty, 10);
    const phys = parseInt(physicalQty, 10);
    const variance = phys - sys;
    const status = variance === 0 ? 'Tallied ⚖️' : Math.abs(variance) <= 2 ? 'Under Review' : 'Variance Flagged';

    const res = await client.query(`
      INSERT INTO cycle_counts (session_no, company_id, branch_code, count_mode, section, auditor_name, system_qty, physical_qty, variance_qty, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [sessionNo, companyId, branchCode, countMode, section, auditorName, sys, phys, variance, status, notes]);

    return res.rows[0];
  } finally {
    client.release();
  }
}

async function getBranchShrinkBenchmarks(companyId = 'comp_mann') {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, company_id, branch_code, branch_name, monthly_turnover,
             variance_value, shrink_rate_percent, peer_benchmark, grade
      FROM branch_shrink_benchmarks
      WHERE company_id = $1
      ORDER BY id ASC
    `, [companyId]);
    return res.rows;
  } finally {
    client.release();
  }
}


