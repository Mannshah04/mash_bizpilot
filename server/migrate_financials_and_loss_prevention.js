const { pool } = require('./postgres');

async function migrateFinancialsAndLossPrevention() {
  const client = await pool.connect();
  try {
    console.log('--- Migrating Financials, COA, Periods & Loss Prevention Tables ---');

    await client.query('BEGIN');

    // 1. Chart of Accounts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chart_of_accounts (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        name VARCHAR(255) NOT NULL,
        nature VARCHAR(50) NOT NULL, -- ASSET, LIABILITY, INCOME, EXPENSE, EQUITY
        account_group VARCHAR(100) NOT NULL DEFAULT 'General',
        opening_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
        current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
        balance_type VARCHAR(10) NOT NULL DEFAULT 'DR', -- DR or CR
        child_ledgers_count INT NOT NULL DEFAULT 1,
        is_system_locked BOOLEAN NOT NULL DEFAULT false,
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_coa_company ON chart_of_accounts(company_id);
    `);

    // 2. Account Vouchers / Transactions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS account_vouchers (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        account_id INT REFERENCES chart_of_accounts(id) ON DELETE CASCADE,
        voucher_no VARCHAR(100) NOT NULL,
        voucher_date DATE NOT NULL DEFAULT CURRENT_DATE,
        voucher_type VARCHAR(50) NOT NULL, -- Payment, Receipt, Journal, Contra, Sales, Purchase
        narration TEXT DEFAULT '',
        debit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
        credit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_vouchers_account ON account_vouchers(account_id);
    `);

    // 3. Financial Periods Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_periods (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        fiscal_year VARCHAR(50) NOT NULL DEFAULT '2025–2026',
        month_name VARCHAR(50) NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Open', -- Open, Locked
        vouchers_count INT NOT NULL DEFAULT 0,
        locked_by VARCHAR(100) DEFAULT '—',
        locked_at TIMESTAMP WITH TIME ZONE NULL,
        lock_hash VARCHAR(255) NULL,
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_periods_company ON financial_periods(company_id, fiscal_year);
    `);

    // 4. Loss Prevention Alerts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS loss_alerts (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(20) NOT NULL DEFAULT 'warning', -- danger, warning, info, success
        category VARCHAR(100) NOT NULL DEFAULT 'TRANSFER_MISMATCH',
        status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED, INVESTIGATING
        incident_time VARCHAR(100) DEFAULT 'Just now',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_loss_alerts_company ON loss_alerts(company_id);
    `);

    // 5. Maker-Checker Stock Adjustment Approvals Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_adjustments (
        id SERIAL PRIMARY KEY,
        adjustment_no VARCHAR(100) UNIQUE NOT NULL,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
        item_name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        loss_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        reason_code VARCHAR(100) NOT NULL, -- DAMAGED_IN_TRANSIT, HANDLING_CRACK, VALVE_LEAK_DEFECT, etc.
        requested_by VARCHAR(100) NOT NULL,
        request_date DATE NOT NULL DEFAULT CURRENT_DATE,
        photo_evidence BOOLEAN NOT NULL DEFAULT true,
        photo_url TEXT DEFAULT '',
        status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
        reviewed_by VARCHAR(100) NULL,
        reviewed_at TIMESTAMP WITH TIME ZONE NULL,
        review_notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_adjustments_company ON stock_adjustments(company_id);
    `);

    // 6. Cycle Counts & Blind Count Sessions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cycle_counts (
        id SERIAL PRIMARY KEY,
        session_no VARCHAR(100) UNIQUE NOT NULL,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        branch_code VARCHAR(50) NOT NULL DEFAULT 'AMD-01',
        count_mode VARCHAR(50) NOT NULL DEFAULT 'Blind Count', -- Blind Count, Spot Count, Full Stock Take
        section VARCHAR(100) NOT NULL,
        auditor_name VARCHAR(100) NOT NULL,
        system_qty INT NOT NULL DEFAULT 0,
        physical_qty INT NOT NULL DEFAULT 0,
        variance_qty INT NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'Tallied ⚖️',
        session_date DATE NOT NULL DEFAULT CURRENT_DATE,
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_counts_company ON cycle_counts(company_id);
    `);

    // 7. Branch Shrink Benchmarks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS branch_shrink_benchmarks (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL DEFAULT 'comp_mann',
        branch_code VARCHAR(50) NOT NULL,
        branch_name VARCHAR(255) NOT NULL,
        monthly_turnover NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
        variance_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        shrink_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
        peer_benchmark VARCHAR(100) NOT NULL DEFAULT '< 0.80% Target',
        grade VARCHAR(50) NOT NULL DEFAULT 'Grade A+ (Exemplary)',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_shrink_company ON branch_shrink_benchmarks(company_id);
    `);

    // ─── SEED DEFAULT DATA IF TABLES ARE EMPTY ───

    // Check & Seed Chart of Accounts
    const coaCount = await client.query('SELECT COUNT(*) FROM chart_of_accounts');
    if (parseInt(coaCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial Chart of Accounts...');
      const defaultCOA = [
        { company_id: 'comp_mann', name: 'Capital Account', nature: 'EQUITY', group: 'Equity & Reserves', opening: 1500000, current: 1500000, dr: false, ledgers: 2, locked: true },
        { company_id: 'comp_mann', name: 'Reserves & Surplus', nature: 'EQUITY', group: 'Equity & Reserves', opening: 345000, current: 345000, dr: false, ledgers: 2, locked: true },
        { company_id: 'comp_mann', name: 'Current Assets - Cash', nature: 'ASSET', group: 'Cash & Liquid', opening: 124500, current: 124500, dr: true, ledgers: 3, locked: true },
        { company_id: 'comp_mann', name: 'Current Assets - Bank', nature: 'ASSET', group: 'Bank Accounts', opening: 845200, current: 845200, dr: true, ledgers: 4, locked: true },
        { company_id: 'comp_mann', name: 'Sundry Debtors', nature: 'ASSET', group: 'Trade Receivables', opening: 678900, current: 678900, dr: true, ledgers: 12, locked: false },
        { company_id: 'comp_mann', name: 'Stock-in-Hand', nature: 'ASSET', group: 'Inventory Asset', opening: 1456000, current: 1456000, dr: true, ledgers: 1, locked: true },
        { company_id: 'comp_mann', name: 'Fixed Assets', nature: 'ASSET', group: 'Fixed Assets', opening: 2240000, current: 2240000, dr: true, ledgers: 5, locked: false },
        { company_id: 'comp_mann', name: 'Sundry Creditors', nature: 'LIABILITY', group: 'Trade Payables', opening: 423100, current: 423100, dr: false, ledgers: 8, locked: false },
        { company_id: 'comp_mann', name: 'Duties & Taxes', nature: 'LIABILITY', group: 'Statutory Liabilities', opening: 187650, current: 187650, dr: false, ledgers: 7, locked: true },
        { company_id: 'comp_mann', name: 'Sales Accounts', nature: 'INCOME', group: 'Operating Revenue', opening: 4215000, current: 4215000, dr: false, ledgers: 3, locked: true },
        { company_id: 'comp_mann', name: 'Purchase Accounts', nature: 'EXPENSE', group: 'Cost of Goods Sold', opening: 2890000, current: 2890000, dr: true, ledgers: 2, locked: true },
        { company_id: 'comp_mann', name: 'Indirect Expenses', nature: 'EXPENSE', group: 'Operating Expenses', opening: 567800, current: 567800, dr: true, ledgers: 9, locked: false },

        // Mash Tech company accounts
        { company_id: 'comp_mashtech', name: 'Tech Capital Account', nature: 'EQUITY', group: 'Equity & Reserves', opening: 1200000, current: 1200000, dr: false, ledgers: 1, locked: true },
        { company_id: 'comp_mashtech', name: 'HDFC Bank - Current', nature: 'ASSET', group: 'Bank Accounts', opening: 950000, current: 950000, dr: true, ledgers: 2, locked: true },
        { company_id: 'comp_mashtech', name: 'Hardware Inventory Stock', nature: 'ASSET', group: 'Inventory Asset', opening: 850000, current: 850000, dr: true, ledgers: 1, locked: true },
        { company_id: 'comp_mashtech', name: 'Enterprise SaaS Revenue', nature: 'INCOME', group: 'Operating Revenue', opening: 3100000, current: 3100000, dr: false, ledgers: 2, locked: true },
        { company_id: 'comp_mashtech', name: 'Cloud Infrastructure Expenses', nature: 'EXPENSE', group: 'Operating Expenses', opening: 420000, current: 420000, dr: true, ledgers: 3, locked: false }
      ];

      for (const item of defaultCOA) {
        const insertRes = await client.query(`
          INSERT INTO chart_of_accounts (company_id, name, nature, account_group, opening_balance, current_balance, balance_type, child_ledgers_count, is_system_locked)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `, [item.company_id, item.name, item.nature, item.group, item.opening, item.current, item.dr ? 'DR' : 'CR', item.ledgers, item.locked]);

        // Seed initial sample voucher
        const accId = insertRes.rows[0].id;
        await client.query(`
          INSERT INTO account_vouchers (company_id, account_id, voucher_no, voucher_date, voucher_type, narration, debit_amount, credit_amount)
          VALUES ($1, $2, $3, CURRENT_DATE - INTERVAL '5 days', $4, $5, $6, $7)
        `, [
          item.company_id,
          accId,
          `VCH-${accId}-01`,
          item.dr ? 'Payment' : 'Receipt',
          `Opening FY25 balance reconciliation for ${item.name}`,
          item.dr ? item.opening : 0,
          !item.dr ? item.opening : 0
        ]);
      }
    }

    // Check & Seed Financial Periods
    const periodsCount = await client.query('SELECT COUNT(*) FROM financial_periods');
    if (parseInt(periodsCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial Financial Periods...');
      const defaultPeriods = [
        { company_id: 'comp_mann', fy: '2025–2026', month: 'April 2025', start: '2025-04-01', end: '2025-04-30', status: 'Locked', vouchers: 145, locked_by: 'Tenant Owner', locked_at: '2025-05-01 10:00:00+05:30' },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'May 2025', start: '2025-05-01', end: '2025-05-31', status: 'Locked', vouchers: 132, locked_by: 'Tenant Owner', locked_at: '2025-06-01 10:00:00+05:30' },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'June 2025', start: '2025-06-01', end: '2025-06-30', status: 'Locked', vouchers: 128, locked_by: 'Tenant Owner', locked_at: '2025-07-01 10:00:00+05:30' },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'July 2025', start: '2025-07-01', end: '2025-07-31', status: 'Locked', vouchers: 156, locked_by: 'Tenant Owner', locked_at: '2025-08-01 10:00:00+05:30' },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'August 2025', start: '2025-08-01', end: '2025-08-31', status: 'Locked', vouchers: 143, locked_by: 'Tenant Owner', locked_at: '2025-09-01 10:00:00+05:30' },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'September 2025', start: '2025-09-01', end: '2025-09-30', status: 'Locked', vouchers: 139, locked_by: 'Tenant Owner', locked_at: '2025-10-01 10:00:00+05:30' },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'October 2025', start: '2025-10-01', end: '2025-10-31', status: 'Open', vouchers: 87, locked_by: '—', locked_at: null },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'November 2025', start: '2025-11-01', end: '2025-11-30', status: 'Open', vouchers: 0, locked_by: '—', locked_at: null },
        { company_id: 'comp_mann', fy: '2025–2026', month: 'December 2025', start: '2025-12-01', end: '2025-12-31', status: 'Open', vouchers: 0, locked_by: '—', locked_at: null },

        // Mash Tech periods
        { company_id: 'comp_mashtech', fy: '2025–2026', month: 'April 2025', start: '2025-04-01', end: '2025-04-30', status: 'Locked', vouchers: 98, locked_by: 'Tenant Owner', locked_at: '2025-05-01 10:00:00+05:30' },
        { company_id: 'comp_mashtech', fy: '2025–2026', month: 'October 2025', start: '2025-10-01', end: '2025-10-31', status: 'Open', vouchers: 42, locked_by: '—', locked_at: null }
      ];

      for (const p of defaultPeriods) {
        await client.query(`
          INSERT INTO financial_periods (company_id, fiscal_year, month_name, period_start, period_end, status, vouchers_count, locked_by, locked_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [p.company_id, p.fy, p.month, p.start, p.end, p.status, p.vouchers, p.locked_by, p.locked_at]);
      }
    }

    // Check & Seed Loss Prevention Alerts
    const alertsCount = await client.query('SELECT COUNT(*) FROM loss_alerts');
    if (parseInt(alertsCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial Loss Prevention Alerts...');
      const defaultAlerts = [
        {
          company_id: 'comp_mann',
          branch_code: 'SUR-02',
          title: 'Transfer Dispatch Mismatch (STR-0045)',
          desc: 'Ahmedabad Hub dispatched 12 units of FE-ABC-4. Surat Outlet received only 11 units. Seal #4489 intact upon arrival.',
          severity: 'danger',
          category: 'TRANSFER_MISMATCH',
          incident_time: '2 hours ago'
        },
        {
          company_id: 'comp_mann',
          branch_code: 'AMD-01',
          title: 'Receiving Shortage Claim Filed',
          desc: 'PO-0128: National Fire delivered 98 items against 100 ordered. Vendor claim credit note CN-2025-012 generated.',
          severity: 'warning',
          category: 'RECEIVING_SHORTAGE',
          incident_time: '4 hours ago'
        },
        {
          company_id: 'comp_mann',
          branch_code: 'BRD-02',
          title: 'After-Hours Stock Adjustment Flagged',
          desc: 'Attempted manual write-off of 3 items at 22:45 PM by local staff. Blocked by system maker-checker rule.',
          severity: 'info',
          category: 'AFTER_HOURS_ADJUSTMENT',
          incident_time: 'Yesterday'
        },
        {
          company_id: 'comp_mann',
          branch_code: 'AMD-01',
          title: 'Blind Cycle Count Variance Within Tolerance',
          desc: 'Ahmedabad Hub PPE section blind count matched 99.4% with stock movements ledger.',
          severity: 'success',
          category: 'CYCLE_COUNT_VARIANCE',
          incident_time: 'Yesterday'
        }
      ];

      for (const a of defaultAlerts) {
        await client.query(`
          INSERT INTO loss_alerts (company_id, branch_code, title, description, severity, category, incident_time)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [a.company_id, a.branch_code, a.title, a.desc, a.severity, a.category, a.incident_time]);
      }
    }

    // Check & Seed Maker-Checker Stock Adjustments
    const adjCount = await client.query('SELECT COUNT(*) FROM stock_adjustments');
    if (parseInt(adjCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial Stock Adjustment Approvals...');
      const defaultApprovals = [
        {
          adj_no: 'ADJ-2025-081',
          company_id: 'comp_mann',
          branch_code: 'AMD-01',
          item: 'ABC Fire Extinguisher 4kg',
          sku: 'FE-ABC-4',
          qty: 2,
          val: 2240.00,
          reason: 'DAMAGED_IN_TRANSIT',
          requested_by: 'Neha Desai (Warehouse)',
          req_date: '2025-10-21',
          photo: true
        },
        {
          adj_no: 'ADJ-2025-080',
          company_id: 'comp_mann',
          branch_code: 'SUR-02',
          item: 'Safety Helmet M-201',
          sku: 'SH-M201',
          qty: 1,
          val: 285.00,
          reason: 'HANDLING_CRACK',
          requested_by: 'Amit Kumar (Sales)',
          req_date: '2025-10-20',
          photo: true
        },
        {
          adj_no: 'ADJ-2025-079',
          company_id: 'comp_mann',
          branch_code: 'BRD-02',
          item: 'CO2 Fire Extinguisher 2kg',
          sku: 'FE-CO2-2',
          qty: 1,
          val: 2450.00,
          reason: 'VALVE_LEAK_DEFECT',
          requested_by: 'Priya Shah (Accountant)',
          req_date: '2025-10-19',
          photo: true
        }
      ];

      for (const app of defaultApprovals) {
        await client.query(`
          INSERT INTO stock_adjustments (adjustment_no, company_id, branch_code, item_name, sku, quantity, loss_value, reason_code, requested_by, request_date, photo_evidence, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING')
        `, [app.adj_no, app.company_id, app.branch_code, app.item, app.sku, app.qty, app.val, app.reason, app.requested_by, app.req_date, app.photo]);
      }
    }

    // Check & Seed Cycle Counts
    const countsCount = await client.query('SELECT COUNT(*) FROM cycle_counts');
    if (parseInt(countsCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial Cycle Counts...');
      const defaultCounts = [
        {
          session_no: 'CNT-2025-014',
          company_id: 'comp_mann',
          branch_code: 'AMD-01',
          mode: 'Blind Count',
          section: 'Fire Extinguishers',
          auditor: 'Rajesh Patel',
          system: 45,
          physical: 45,
          variance: 0,
          status: 'Tallied ⚖️'
        },
        {
          session_no: 'CNT-2025-013',
          company_id: 'comp_mann',
          branch_code: 'SUR-02',
          mode: 'Spot Count',
          section: 'CO2 Cylinders',
          auditor: 'Amit Kumar',
          system: 14,
          physical: 12,
          variance: -2,
          status: 'Under Review'
        },
        {
          session_no: 'CNT-2025-012',
          company_id: 'comp_mann',
          branch_code: 'BRD-02',
          mode: 'Full Stock Take',
          section: 'Entire Depot',
          auditor: 'Neha Desai',
          system: 312,
          physical: 311,
          variance: -1,
          status: 'Approved'
        }
      ];

      for (const c of defaultCounts) {
        await client.query(`
          INSERT INTO cycle_counts (session_no, company_id, branch_code, count_mode, section, auditor_name, system_qty, physical_qty, variance_qty, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [c.session_no, c.company_id, c.branch_code, c.mode, c.section, c.auditor, c.system, c.physical, c.variance, c.status]);
      }
    }

    // Check & Seed Branch Shrink Benchmarks
    const benchCount = await client.query('SELECT COUNT(*) FROM branch_shrink_benchmarks');
    if (parseInt(benchCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial Branch Shrink Benchmarks...');
      const defaultBench = [
        {
          company_id: 'comp_mann',
          branch_code: 'AMD-01',
          name: 'Ahmedabad Central Hub & Warehouse (AMD-01)',
          turnover: 1850000.00,
          variance: 4200.00,
          shrink_rate: 0.22,
          peer: '< 0.80% Target',
          grade: 'Grade A+ (Exemplary)'
        },
        {
          company_id: 'comp_mann',
          branch_code: 'SUR-02',
          name: 'Surat Franchise Depot (SUR-02)',
          turnover: 980000.00,
          variance: 6850.00,
          shrink_rate: 0.69,
          peer: '< 0.80% Target',
          grade: 'Grade B (Acceptable)'
        },
        {
          company_id: 'comp_mann',
          branch_code: 'BRD-02',
          name: 'Baroda City Outlet & Service (BRD-02)',
          turnover: 620000.00,
          variance: 3200.00,
          shrink_rate: 0.51,
          peer: '< 0.80% Target',
          grade: 'Grade A (Low Shrinkage)'
        }
      ];

      for (const b of defaultBench) {
        await client.query(`
          INSERT INTO branch_shrink_benchmarks (company_id, branch_code, branch_name, monthly_turnover, variance_value, shrink_rate_percent, peer_benchmark, grade)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [b.company_id, b.branch_code, b.name, b.turnover, b.variance, b.shrink_rate, b.peer, b.grade]);
      }
    }

    await client.query('COMMIT');
    console.log('SUCCESS: All Financials, COA, Periods & Loss Prevention tables and seed data created!');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error migrating financials and loss prevention:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { migrateFinancialsAndLossPrevention };

if (require.main === module) {
  migrateFinancialsAndLossPrevention().then(() => {
    pool.end();
    process.exit(0);
  }).catch(() => {
    pool.end();
    process.exit(1);
  });
}
