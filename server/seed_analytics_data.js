const { pool } = require('./postgres');

async function seedAnalyticsData() {
  console.log('--- SEEDING REALISTIC DATABASE ANALYTICS DATA INTO POSTGRESQL ---');

  // 1. Check existing invoice count
  const countRes = await pool.query('SELECT count(*) FROM invoices WHERE invoice_no LIKE \'INV-2026-%\'');
  if (parseInt(countRes.rows[0].count, 10) >= 60) {
    console.log('Sufficient analytics invoice data already exists (' + countRes.rows[0].count + ' rows). Skipping full re-seed.');
    return;
  }

  // Fetch real products from PostgreSQL
  const prodRes = await pool.query('SELECT pid, name, category, sale_price, purchase_price, hsn FROM product');
  const products = prodRes.rows;
  if (!products.length) {
    console.log('No products found to link with invoices.');
    return;
  }

  const branches = [
    { code: 'AMD-01', weight: 0.42, companyId: 'comp_mann', companyName: 'Mann Engineers Fire Safety' },
    { code: 'BRD-02', weight: 0.28, companyId: 'comp_mann', companyName: 'Mann Engineers Fire Safety' },
    { code: 'AND-01', weight: 0.18, companyId: 'comp_mashtech', companyName: 'Mash Tech' },
    { code: 'SRU-02', weight: 0.12, companyId: 'comp_mashtech', companyName: 'Mash Tech' }
  ];

  const customers = [
    { name: 'Adani Ports & Special Economic Zone', phone: '+91 98250 11223', gstin: '24AAACA1234F1Z1', address: 'Mundra Port SEZ, Kutch' },
    { name: 'Reliance Industries Ltd (Hazira Complex)', phone: '+91 98251 22334', gstin: '24AAACR4321A1Z5', address: 'Hazira Industrial Area, Surat' },
    { name: 'Torrent Pharmaceuticals Ltd', phone: '+91 98252 33445', gstin: '24AAACT5678B1Z9', address: 'Indrad, Kadi, Mehsana' },
    { name: 'L&T Knowledge City Complex', phone: '+91 98253 44556', gstin: '24AAACL9012C1Z3', address: 'NH-8, Waghodia, Vadodara' },
    { name: 'Tata Motors Manufacturing Plant', phone: '+91 98254 55667', gstin: '24AAACT3456D1Z7', address: 'GIDC Industrial Estate, Sanand' },
    { name: 'Zydus Lifesciences Biotech Park', phone: '+91 98255 66778', gstin: '24AAACZ7890E1Z2', address: 'Changodar, Ahmedabad' },
    { name: 'Gujarat State Fertilizers & Chemicals', phone: '+91 98256 77889', gstin: '24AAACG1122G1Z8', address: 'Fertilizernagar, Vadodara' },
    { name: 'Alembic Pharmaceuticals Limited', phone: '+91 98257 88990', gstin: '24AAACA3344H1Z4', address: 'Alembic Road, Vadodara' },
    { name: 'Shreeji Industrial Safety Systems', phone: '+91 98258 99001', gstin: '24AAACS5566I1Z0', address: 'GIDC Estate, Phase II, Halol' },
    { name: 'Amul Dairy Technical Facilities', phone: '+91 98259 00112', gstin: '24AAACA7788J1Z6', address: 'Anand Main Dairy Campus, Anand' }
  ];

  const paymentModes = ['UPI', 'UPI', 'Card', 'Bank Transfer', 'Bank Transfer', 'Cash'];

  // Generate records distributed over the last 180 days (May 1, 2026 to Oct 24, 2026)
  const today = new Date('2026-10-24T00:00:00.000Z');
  let invoiceCounter = 1000;
  let poCounter = 1000;
  let cashBookCounter = 1000;

  for (let d = 175; d >= 0; d--) {
    const entryDate = new Date(today);
    entryDate.setDate(entryDate.getDate() - d);
    const dateStr = entryDate.toISOString().split('T')[0];

    // Determine transactions for this day
    const dayOfWeek = entryDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dailyTxCount = isWeekend ? (Math.random() > 0.4 ? 1 : 0) : (Math.floor(Math.random() * 3) + 1);

    for (let t = 0; t < dailyTxCount; t++) {
      // Pick branch based on weight
      const rand = Math.random();
      let branch = branches[0];
      let acc = 0;
      for (const b of branches) {
        acc += b.weight;
        if (rand <= acc) {
          branch = b;
          break;
        }
      }

      invoiceCounter++;
      const invNo = `INV-2026-${invoiceCounter}`;
      const cust = customers[Math.floor(Math.random() * customers.length)];
      const mode = paymentModes[Math.floor(Math.random() * paymentModes.length)];

      // Pick 1 to 3 items
      const numItems = Math.floor(Math.random() * 3) + 1;
      const chosenProds = [];
      for (let k = 0; k < numItems; k++) {
        chosenProds.push(products[Math.floor(Math.random() * products.length)]);
      }

      let subtotal = 0;
      let totalTax = 0;
      const lineItems = [];

      for (const prod of chosenProds) {
        const qty = Math.floor(Math.random() * 8) + 1;
        const price = parseFloat(prod.sale_price) || 1200;
        const lineSub = Math.round(qty * price * 100) / 100;
        const taxRate = 18;
        const lineTax = Math.round(lineSub * (taxRate / 100) * 100) / 100;
        subtotal += lineSub;
        totalTax += lineTax;

        lineItems.push({
          itemCode: prod.pid,
          itemName: prod.name,
          unit: prod.unit || 'NOS',
          hsn: prod.hsn || '8424',
          qty,
          price,
          subtotal: lineSub,
          taxRate,
          taxAmount: lineTax
        });
      }

      const discount = subtotal > 15000 ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
      const grandTotal = Math.round((subtotal + totalTax - discount) * 100) / 100;

      // Insert invoice
      const invRes = await pool.query(`
        INSERT INTO invoices (
          invoice_no, branch_code, customer_name, customer_phone, customer_email,
          customer_address, customer_gstin, invoice_date, total_items, subtotal,
          total_tax, discount_amount, grand_total, payment_mode, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Posted')
        RETURNING id;
      `, [
        invNo, branch.code, cust.name, cust.phone, `${cust.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@corp.in`,
        cust.address, cust.gstin, dateStr, lineItems.length, subtotal,
        totalTax, discount, grandTotal, mode
      ]);

      const invId = invRes.rows[0].id;

      // Insert line items
      for (const li of lineItems) {
        await pool.query(`
          INSERT INTO invoice_items (
            invoice_id, invoice_no, item_code, item_name, unit, hsn_code,
            qty, unit_price, effective_price, tax_rate, tax_amount, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
        `, [
          invId, invNo, li.itemCode, li.itemName, li.unit, li.hsn,
          li.qty, li.price, li.price, li.taxRate, li.taxAmount, li.subtotal
        ]);
      }

      // Add corresponding Cash Book entry for Inflow
      cashBookCounter++;
      await pool.query(`
        INSERT INTO cash_book (
          company_id, branch_code, entry_no, entry_date, type, party,
          category, ref_no, narration, dr_amount, cr_amount, balance, payment_mode, reconciled
        ) VALUES ($1, $2, $3, $4, 'Receipt', $5, 'Counter Sales', $6, $7, $8, 0, $8, $9, true);
      `, [
        branch.companyId, branch.code, `CB-${cashBookCounter}`, dateStr,
        cust.name, invNo, `Payment received against invoice ${invNo}`,
        grandTotal, mode
      ]);

      // Every 3-4 days, record an operating expense/payment outflow in cash_book
      if (invoiceCounter % 3 === 0) {
        cashBookCounter++;
        const expAmount = Math.floor(Math.random() * 8000) + 2000;
        const expCategories = ['Warehouse Freight', 'Utility & Electricity', 'Equipment Packaging', 'Safety Inspection Fee', 'Branch Maintenance'];
        const expCat = expCategories[Math.floor(Math.random() * expCategories.length)];

        await pool.query(`
          INSERT INTO cash_book (
            company_id, branch_code, entry_no, entry_date, type, party,
            category, ref_no, narration, dr_amount, cr_amount, balance, payment_mode, reconciled
          ) VALUES ($1, $2, $3, $4, 'Payment', $5, $6, $7, $8, 0, $9, $10, 'Bank Transfer', true);
        `, [
          branch.companyId, branch.code, `CB-${cashBookCounter}`, dateStr,
          'Logistics & Operations Vendor', expCat, `EXP-${cashBookCounter}`,
          `Expense disbursed for ${expCat}`, expAmount, expAmount
        ]);
      }

      // Every 5 days, record a Purchase replenishment
      if (invoiceCounter % 5 === 0) {
        poCounter++;
        const poNo = `PO-2026-${poCounter}`;
        const poSubtotal = Math.floor(Math.random() * 35000) + 15000;
        const poTax = Math.round(poSubtotal * 0.18 * 100) / 100;
        const poTotal = poSubtotal + poTax;

        await pool.query(`
          INSERT INTO purchases (
            po_no, company_id, branch_code, supplier_name, po_date, total_items,
            subtotal, total_tax, grand_total, payment_terms, status
          ) VALUES ($1, $2, $3, 'National Safety Equipment Manufacturing Ltd', $4, 2, $5, $6, $7, 'Credit 30 Days', 'Received')
          ON CONFLICT DO NOTHING;
        `, [
          poNo, branch.companyId, branch.code, dateStr, poSubtotal, poTax, poTotal
        ]);
      }
    }
  }

  console.log(`Successfully generated and seeded analytics database rows into PostgreSQL!`);
}

module.exports = { seedAnalyticsData };

if (require.main === module) {
  seedAnalyticsData().then(() => {
    console.log('Done seeding.');
    pool.end();
  }).catch(err => {
    console.error('Error seeding analytics:', err);
    pool.end();
  });
}
