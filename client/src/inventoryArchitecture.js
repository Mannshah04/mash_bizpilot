/**
 * Multi-Branch Inventory Architecture
 * Mathematical Specification for Stock Velocity, Replenishment, and Network Allocation
 * Based on Technical Blueprint Specification
 */

/**
 * Formula A: Selling Quantity Rate (SQR / Sales Velocity)
 * Measures average daily sales volume over a specified historical lookback window.
 * SQR = Total Quantity Sold in Period / Number of Days in Period
 */
export function calculateSQR(totalQuantitySold = 0, numberOfDaysInPeriod = 30) {
  const days = Math.max(parseFloat(numberOfDaysInPeriod) || 30, 1);
  const qty = Math.max(parseFloat(totalQuantitySold) || 0, 0);
  const sqr = qty / days;
  return Math.round(sqr * 100) / 100; // 2 decimal precision
}

/**
 * Formula B: Lead Time Demand (LTD)
 * Expected unit consumption while waiting for a pending shipment to arrive.
 * LTD = SQR × Lead Time (Days)
 */
export function calculateLTD(sqr = 0, leadTimeDays = 5) {
  const numSqr = Math.max(parseFloat(sqr) || 0, 0);
  const lt = Math.max(parseFloat(leadTimeDays) || 5, 1);
  return Math.round(numSqr * lt * 10) / 10;
}

/**
 * Formula C: Safety Stock (SS)
 * Buffer inventory protecting against demand surges and fulfillment delays.
 * Safety Stock = (Max Daily Sales × Max Lead Time) − (SQR × Average Lead Time)
 */
export function calculateSafetyStock(maxDailySales, maxLeadTimeDays = 8, sqr = 0, avgLeadTimeDays = 5, minFallback = 10) {
  const numSqr = Math.max(parseFloat(sqr) || 0, 0);
  const avgLt = Math.max(parseFloat(avgLeadTimeDays) || 5, 1);
  const maxLt = Math.max(parseFloat(maxLeadTimeDays) || (avgLt + 3), avgLt);
  const maxDaily = maxDailySales !== undefined && maxDailySales !== null
    ? Math.max(parseFloat(maxDailySales) || 0, numSqr)
    : Math.max(numSqr * 2.2, 1.5);

  const rawSS = (maxDaily * maxLt) - (numSqr * avgLt);
  const fallback = Math.max(parseFloat(minFallback) || 10, 5);
  return Math.max(Math.round(rawSS), Math.round(fallback));
}

/**
 * Formula D: Reorder Point (ROP)
 * The inventory threshold triggering an automatic replenishment order or transfer.
 * ROP = Lead Time Demand + Safety Stock
 */
export function calculateROP(ltd = 0, safetyStock = 0) {
  const numLtd = Math.max(parseFloat(ltd) || 0, 0);
  const numSs = Math.max(parseFloat(safetyStock) || 0, 0);
  return Math.round(numLtd + numSs);
}

/**
 * Section 3: Available Stock (Net Stock Position)
 * Available Stock = (Stock on Hand + Stock In-Transit) − Stock Allocated
 */
export function calculateAvailableStock(stockOnHand = 0, stockInTransit = 0, stockAllocated = 0) {
  const onHand = parseFloat(stockOnHand) || 0;
  const inTransit = parseFloat(stockInTransit) || 0;
  const allocated = parseFloat(stockAllocated) || 0;
  return Math.max(0, Math.round((onHand + inTransit - allocated) * 100) / 100);
}

/**
 * Section 4: Multi-Tier Replenishment Matrix
 * Evaluates triggers:
 * 1. Available Stock <= ROP
 * 2. No Internal Stock Available
 * 3. Stock > Max Stock Cap
 */
export function evaluateReplenishmentMatrix({
  availableStock = 0,
  rop = 10,
  maxStockCap = 150,
  currentStock = 0,
  sisterBranches = [],
  sqr = 1,
  purchasePrice = 1000
}) {
  const avail = parseFloat(availableStock) || 0;
  const numRop = parseFloat(rop) || 10;
  const maxCap = Math.max(parseFloat(maxStockCap) || (numRop * 3), 100);

  // Condition Trigger 3: Stock > Max Stock Cap
  if (currentStock > maxCap) {
    return {
      trigger: 'OVERSTOCK_CAP',
      status: 'OVERSTOCK',
      severity: 'warning',
      badgeText: 'Overstock (> Max Cap)',
      primaryAction: 'Flag location for promotional markdown or redistribution',
      secondaryAction: 'Pause automated replenishment for SKU',
      actionType: 'PAUSE_REPLENISHMENT',
      transferCandidate: null
    };
  }

  // Condition Trigger 1: Available Stock <= ROP
  if (avail <= numRop) {
    // Check nearby branch network for excess stock (> Max Stock Level)
    // Avoid branches under high demand where transferring stock would force them below their own ROP
    const excessBranches = sisterBranches
      .filter(b => {
        const bStock = parseFloat(b.stock ?? b.currentStock ?? 0) || 0;
        const bRop = parseFloat(b.rop ?? numRop) || numRop;
        const bSqr = parseFloat(b.sqr ?? 1) || 1;
        const bSurplus = bStock - bRop;
        // Branch must have genuine surplus (> ROP) and safe buffer so it does not have to repurchase
        return bSurplus >= 5 && bStock > (b.maxStock || (bRop * 1.3));
      })
      .sort((a, b) => ((b.stock || b.currentStock || 0) - (a.stock || a.currentStock || 0)));

    const bestBranch = excessBranches[0] || null;

    if (bestBranch) {
      const bestStock = parseFloat(bestBranch.stock || bestBranch.currentStock || 0) || 0;
      const bestRop = parseFloat(bestBranch.rop || numRop) || numRop;
      const safeExcess = Math.max(Math.round(bestStock - bestRop), 5);
      const excessAmount = Math.min(safeExcess, Math.max(numRop - avail, 5));

      return {
        trigger: 'AVAILABLE_LE_ROP',
        status: 'REPLENISH_TRANSFER',
        severity: 'danger',
        badgeText: 'ROP Triggered (Avail ≤ ROP)',
        primaryAction: `Transfer ${excessAmount} units from ${bestBranch.name || bestBranch.code} (Safe surplus > ROP)`,
        secondaryAction: `Initiate Internal Stock Transfer from ${bestBranch.code}`,
        actionType: 'INTERNAL_TRANSFER',
        transferCandidate: bestBranch,
        transferQty: excessAmount
      };
    }

    // Condition Trigger 2: No Internal Stock Available (or all branches under high demand protection)
    return {
      trigger: 'NO_INTERNAL_STOCK',
      status: 'REPLENISH_PO',
      severity: 'danger',
      badgeText: 'ROP Triggered — PO Needed',
      primaryAction: `Issue PO to Supplier / Central Warehouse`,
      secondaryAction: `Generate Purchase Order (PO)`,
      actionType: 'PURCHASE_ORDER',
      transferCandidate: null
    };
  }

  // Healthy Buffer Position
  return {
    trigger: 'OPTIMAL_BUFFER',
    status: 'OPTIMAL',
    severity: 'success',
    badgeText: 'Buffer Optimal (Avail > ROP)',
    primaryAction: 'Inventory in optimal replenishment zone',
    secondaryAction: 'Monitoring rolling sales velocity (SQR)',
    actionType: 'MONITOR',
    transferCandidate: null
  };
}

/**
 * Computes all Multi-Branch Inventory Architecture metrics in one call
 */
export function computeInventoryArchitectureMetrics(item = {}, sisterBranches = [], lookbackDays = 30) {
  const currentStock = parseFloat(item.currentStock ?? item.stockHere ?? item.qty ?? item.current_stock ?? 0) || 0;
  const stockInTransit = parseFloat(item.stockInTransit ?? item.inTransit ?? 0) || 0;
  const stockAllocated = parseFloat(item.stockAllocated ?? item.allocated ?? 0) || 0;
  const minStock = parseFloat(item.minStock ?? item.min_stock ?? item.reorderLevel ?? 10) || 10;
  const unitsSold = parseFloat(item.unitsSold ?? item.units_sold ?? item.mtdSold ?? (currentStock > 0 ? currentStock * 1.2 : 15)) || 0;
  const purchasePrice = parseFloat(item.purchasePrice ?? item.purchase_price ?? item.avgCost ?? 500) || 500;
  const salePrice = parseFloat(item.salePrice ?? item.sale_price ?? item.sellingPrice ?? (purchasePrice * 1.3)) || (purchasePrice * 1.3);

  // 1. SQR
  const sqr = calculateSQR(unitsSold, lookbackDays);

  // 2. Lead Time Demand (LTD)
  const avgLeadTime = parseFloat(item.leadTimeDays ?? item.leadTime ?? 5) || 5;
  const maxLeadTime = parseFloat(item.maxLeadTimeDays ?? (avgLeadTime + 3)) || (avgLeadTime + 3);
  const ltd = calculateLTD(sqr, avgLeadTime);

  // 3. Safety Stock (SS)
  const maxDailySales = parseFloat(item.maxDailySales ?? (sqr * 2.2)) || (sqr * 2.2);
  const safetyStock = calculateSafetyStock(maxDailySales, maxLeadTime, sqr, avgLeadTime, minStock);

  // 4. Reorder Point (ROP)
  const rop = calculateROP(ltd, safetyStock);

  // 5. Available Stock
  const availableStock = calculateAvailableStock(currentStock, stockInTransit, stockAllocated);

  // 6. Max Stock Cap
  const maxStockCap = Math.max(parseFloat(item.maxStockCap ?? (rop * 3)) || (rop * 3), 120);

  // 7. Days of Cover
  const daysOfCover = sqr > 0 ? Math.max(Math.round((availableStock / sqr) * 10) / 10, 0) : (availableStock > 0 ? 99 : 0);

  // 8. Replenishment Matrix
  const replenishment = evaluateReplenishmentMatrix({
    availableStock,
    rop,
    maxStockCap,
    currentStock,
    sisterBranches,
    sqr,
    purchasePrice
  });

  // 9. Demand Velocity Tier
  let demandTier = 'LOW';
  let demandLabel = 'Stable Velocity';
  if (sqr >= 4.0) {
    demandTier = 'VERY_HIGH';
    demandLabel = '🔥 Very High Velocity (Top 10%)';
  } else if (sqr >= 2.0) {
    demandTier = 'HIGH';
    demandLabel = '⚡ High Velocity Mover';
  } else if (sqr >= 0.8) {
    demandTier = 'MODERATE';
    demandLabel = 'Consistent Demand';
  }

  return {
    sqr,
    ltd,
    safetyStock,
    rop,
    availableStock,
    stockOnHand: currentStock,
    stockInTransit,
    stockAllocated,
    maxStockCap,
    daysOfCover,
    demandTier,
    demandLabel,
    replenishment,
    avgLeadTime,
    maxLeadTime,
    maxDailySales,
    unitsSold,
    purchasePrice,
    salePrice
  };
}

