const { pool } = require('./postgres.js');

async function migrateToCommonInventory() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Common Inventory Migration ---');
    await client.query('BEGIN');

    // 1. Consolidate any duplicate PIDs within the same company
    const dupes = await client.query(`
      SELECT company_id, pid, count(*), sum(current_stock) as total_stock, min(id) as keep_id
      FROM product
      GROUP BY company_id, pid
      HAVING count(*) > 1;
    `);

    console.log(`Found ${dupes.rows.length} duplicate PID groups to consolidate.`);

    for (const dup of dupes.rows) {
      console.log(`Consolidating company ${dup.company_id}, PID ${dup.pid}: keep id ${dup.keep_id}, total stock ${dup.total_stock}`);
      // Update kept row with summed current_stock
      await client.query(`
        UPDATE product
        SET current_stock = $1, branch_code = 'COMMON', updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `, [dup.total_stock, dup.keep_id]);

      // Delete other rows for this company_id and pid
      await client.query(`
        DELETE FROM product
        WHERE company_id = $1 AND pid = $2 AND id <> $3;
      `, [dup.company_id, dup.pid, dup.keep_id]);
    }

    // 2. Set all remaining rows to branch_code = 'COMMON'
    await client.query(`
      UPDATE product SET branch_code = 'COMMON' WHERE branch_code <> 'COMMON';
    `);

    // 3. Drop old constraints and create new UNIQUE (company_id, pid) constraint
    await client.query(`
      ALTER TABLE product DROP CONSTRAINT IF EXISTS uq_product_comp_branch_pid;
      ALTER TABLE product DROP CONSTRAINT IF EXISTS uq_product_branch_pid;
      ALTER TABLE product DROP CONSTRAINT IF EXISTS uq_product_comp_pid;
      ALTER TABLE product ADD CONSTRAINT uq_product_comp_pid UNIQUE (company_id, pid);
    `);

    await client.query('COMMIT');
    console.log('✓ Migration to Common Inventory committed successfully!');

    // Verify results
    const summary = await client.query(`
      SELECT company_id, count(*) as product_count, sum(current_stock) as total_stock
      FROM product
      GROUP BY company_id;
    `);
    console.log('Consolidated Company Inventory Summary:', summary.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed, rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateToCommonInventory();
