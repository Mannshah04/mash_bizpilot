/**
 * Warehouse Space Optimization & Automated Storage Cost Calculation Engine
 * Reference Implementation adhering strictly to Technical Specification v1.0
 * (Option C Layout, Vertical Stacking Engine, MaxRects 2D Packer, GST Storage Billing, Capacity Guard)
 */

export const EPS = 1e-9;

// ── 1. UNIT CONVERSIONS (Section 3.2) ──
export const UNIT_TO_FEET = {
  ft: 1.0,
  m: 3.280840,       // 1 / 0.3048
  in: 1.0 / 12.0,    // 0.0833333
  cm: 0.0328084,
  mm: 0.00328084,
  yd: 3.0
};

export function convertLength(val, fromUnit = 'ft', toUnit = 'ft') {
  if (val == null || isNaN(val)) return 0;
  const inFt = Number(val) * (UNIT_TO_FEET[fromUnit] || 1.0);
  return inFt / (UNIT_TO_FEET[toUnit] || 1.0);
}

export function convertArea(sqFt, toUnit = 'sq ft') {
  if (toUnit === 'm2' || toUnit === 'sq m') return sqFt * 0.09290304;
  return sqFt;
}

export function convertVolume(cuFt, toUnit = 'cu ft') {
  if (toUnit === 'm3' || toUnit === 'cu m') return cuFt * 0.0283168;
  return cuFt;
}

// ── 2. OPTION C WAREHOUSE LAYOUT (Section 4) ──
export const DEFAULT_GODOWN = {
  name: 'Standard Godown (Option C)',
  length: 100, // ft
  width: 50,   // ft
  height: 20,  // ft
  lengthFt: 100,
  widthFt: 50,
  heightFt: 20,
  netStorageAreaSqFt: 3496,
  wallClearance: 4, // c = 4 ft
  aisleWidth: 4,    // a = 4 ft
  aisleDirection: 'ALONG_LENGTH', // 'ALONG_LENGTH' | 'ALONG_WIDTH'
  sprinklerClearance: 1.5, // s = 1.5 ft
  storageRate: 20, // ₹ per sq ft per month (or per cu ft / unit)
  pricingMethod: 'FLOOR_AREA', // 'FLOOR_AREA' | 'VOLUME' | 'PRODUCT'
  gstPercent: 18,
  sacCode: '996729',
  capacityPolicy: 'BLOCK', // 'BLOCK' | 'WARN'
  floorLoadLimitKgM2: 1200 // kg / m²
};

export function computeWarehouseLayout(config = {}) {
  const g = { ...DEFAULT_GODOWN, ...config };
  const L = parseFloat(g.lengthFt ?? g.length) || 100;
  const W = parseFloat(g.widthFt ?? g.width) || 50;
  const H = parseFloat(g.heightFt ?? g.height) || 20;
  const c = parseFloat(g.wallClearance ?? 4);
  const a = parseFloat(g.aisleWidth ?? 4);
  const s = parseFloat(g.sprinklerClearance ?? 1.5);
  const aisleDir = g.aisleDirection || 'ALONG_LENGTH';

  // Validation
  const innerL = L - 2 * c;
  const innerW = W - 2 * c;
  if (innerL <= 0 || innerW <= 0) {
    throw new Error(`Rejected layout: Wall clearance ${c}ft consumes godown footprint (L_inner=${innerL}, W_inner=${innerW})`);
  }

  const grossArea = Math.round(L * W * 100) / 100;
  const grossVolume = Math.round(L * W * H * 100) / 100;
  const innerArea = Math.round(innerL * innerW * 100) / 100;
  const clearanceArea = Math.round((grossArea - innerArea) * 100) / 100;

  let aisleArea = 0;
  let zoneWidth = 0;
  let zones = [];
  let aisleRect = null;

  if (aisleDir === 'ALONG_LENGTH') {
    aisleArea = Math.round(innerL * a * 100) / 100;
    zoneWidth = (innerW - a) / 2;
    if (zoneWidth <= 0) {
      throw new Error(`Rejected layout: Aisle width ${a}ft consumes inner width ${innerW}ft`);
    }
    // Zone A: South, Zone B: North
    zones = [
      { id: 'zone-A', name: 'Storage Zone A (South)', x: c, y: c, w: innerL, h: zoneWidth },
      { id: 'zone-B', name: 'Storage Zone B (North)', x: c, y: c + zoneWidth + a, w: innerL, h: zoneWidth }
    ];
    aisleRect = { x: c, y: c + zoneWidth, w: innerL, h: a, dir: 'LENGTH' };
  } else {
    // ALONG_WIDTH
    aisleArea = Math.round(innerW * a * 100) / 100;
    zoneWidth = (innerL - a) / 2;
    if (zoneWidth <= 0) {
      throw new Error(`Rejected layout: Aisle width ${a}ft consumes inner length ${innerL}ft`);
    }
    zones = [
      { id: 'zone-A', name: 'Storage Zone A (West)', x: c, y: c, w: zoneWidth, h: innerW },
      { id: 'zone-B', name: 'Storage Zone B (East)', x: c + zoneWidth + a, y: c, w: zoneWidth, h: innerW }
    ];
    aisleRect = { x: c + zoneWidth, y: c, w: a, h: innerW, dir: 'WIDTH' };
  }

  const netStorageArea = Math.round((innerArea - aisleArea) * 100) / 100;
  const effectiveHeight = Math.max(0, Math.round((H - s) * 100) / 100);
  const netStorageVolume = Math.round(netStorageArea * effectiveHeight * 100) / 100;

  return {
    ...g,
    length: L,
    width: W,
    height: H,
    lengthFt: L,
    widthFt: W,
    heightFt: H,
    wallClearance: c,
    aisleWidth: a,
    sprinklerClearance: s,
    innerLength: innerL,
    innerWidth: innerW,
    grossArea,
    grossVolume,
    innerArea,
    clearanceArea,
    clearancePct: Math.round((clearanceArea / grossArea) * 10000) / 100,
    aisleArea,
    aislePct: Math.round((aisleArea / grossArea) * 10000) / 100,
    netStorageArea,
    netStorageAreaSqFt: netStorageArea,
    netStoragePct: Math.round((netStorageArea / grossArea) * 10000) / 100,
    effectiveHeight,
    netStorageVolume,
    zoneWidth,
    zones,
    aisleRect
  };
}

// ── 3. PRODUCT SPECIFICATION & VERTICAL STACKING (Section 5) ──
export const DEFAULT_PRODUCT_SPEC = {
  length: 2.0, // ft
  width: 1.0,  // ft
  height: 1.0, // ft
  stackable: true,
  maxStackHeight: 10.0, // ft (null = limited only by Heff)
  maxUnitsPerStack: null,
  allowedOrientation: 'ROTATE_FLOOR', // 'FIXED' | 'ROTATE_FLOOR' | 'ANY_FACE'
  handlingGap: 0.0, // ft
  unitWeightKg: 12.0, // kg
  maxLoadOnBottomKg: null, // kg (null = unconstrained)
  maxSlenderness: null, // stability ratio stack_height / d_min (null = unconstrained)
  unitHeight: 1.0
};

export function computeVerticalStacking(specInput = {}, godown = DEFAULT_GODOWN, quantity = 500) {
  const spec = { ...DEFAULT_PRODUCT_SPEC, ...(specInput || {}) };
  const layout = computeWarehouseLayout(godown);
  const Q = Math.max(0, parseInt(quantity, 10) || 0);

  const dim = spec.dimensions || {};
  const isInch = dim.unit === 'in';
  const rawL = specInput?.length ?? (dim.length ? (isInch ? dim.length / 12 : dim.length) : spec.length);
  const rawW = specInput?.width ?? (dim.width ? (isInch ? dim.width / 12 : dim.width) : spec.width);
  const rawH = specInput?.height ?? (dim.height ? (isInch ? dim.height / 12 : dim.height) : spec.height);

  const l = Math.max(0.01, parseFloat(rawL) || 2.0);
  const w = Math.max(0.01, parseFloat(rawW) || 1.0);
  const h = Math.max(0.01, parseFloat(rawH) || 1.0);
  const g = Math.max(0, parseFloat(spec.handlingGap ?? (spec.handlingGapInches ? spec.handlingGapInches / 12 : 0)) || 0.0);
  const isStackable = spec.stackable !== false;

  // Stacking limits
  const maxStackH = spec.maxStackHeight ? parseFloat(spec.maxStackHeight) : layout.effectiveHeight;
  const Heff_p = Math.min(layout.effectiveHeight, maxStackH);

  if (h > Heff_p + EPS) {
    return {
      status: 'BLOCKED_HEIGHT',
      message: `Product height (${h} ft) exceeds effective stacking height (${Heff_p} ft). Cannot be stored upright.`,
      unitsPerStack: 0,
      stacksNeeded: 0,
      occupiedFloorArea: 0,
      occupiedVolume: 0
    };
  }

  // 1. Height-bound units
  const n_height = Math.floor(Heff_p / h);

  // 2. Weight-on-bottom limit: n - 1 <= M_bottom / W_kg  =>  n <= floor(M_bottom / W_kg) + 1
  let n_weight = Infinity;
  const wKg = parseFloat(spec.unitWeightKg);
  const mBottom = parseFloat(spec.maxLoadOnBottomKg);
  if (wKg > 0 && mBottom > 0) {
    n_weight = Math.floor(mBottom / wKg) + 1;
  }

  // 3. Stability limit: stack_height / d_min <= R_max  =>  n <= floor(R_max * d_min / h)
  let n_stab = Infinity;
  const rMax = parseFloat(spec.maxSlenderness);
  const dMin = Math.min(l, w);
  if (rMax > 0 && dMin > 0) {
    n_stab = Math.floor((rMax * dMin) / h);
  }

  // 4. Floor load limit: (n * W_kg) / A_fp_m2 <= q_max
  let n_floor = Infinity;
  const qMax = parseFloat(godown.floorLoadLimitKgM2);
  const afpM2 = (l * w) * 0.09290304;
  if (qMax > 0 && wKg > 0 && afpM2 > 0) {
    n_floor = Math.floor((qMax * afpM2) / wKg);
  }

  // 5. Explicit unit cap
  const n_max = spec.maxUnitsPerStack ? parseInt(spec.maxUnitsPerStack, 10) : Infinity;

  // Combined units per stack
  let n = 1;
  if (isStackable) {
    n = Math.max(1, Math.min(n_height, n_max, n_weight, n_stab, n_floor));
  }

  // Stacks count S = ceil(Q / n)
  const S = Q > 0 ? Math.ceil(Q / n) : 0;
  const S_full = Q > 0 ? Math.floor(Q / n) : 0;
  const remainder = Q - n * S_full;

  // Footprint per stack with gap
  const l_prime = Math.round((l + g) * 1000) / 1000;
  const w_prime = Math.round((w + g) * 1000) / 1000;
  const A_stack = Math.round((l_prime * w_prime) * 1000) / 1000;

  // Total occupied floor area
  const A_occ = Math.round((S * A_stack) * 100) / 100;

  // Stack actual height
  const stackHeight = Math.round((n * h) * 100) / 100;

  // Occupied envelope volume (Section 5.9: Vocc = A_stack * h_o * Q)
  const V_occ = Math.round((A_stack * h * Q) * 100) / 100;
  const V_prod = Math.round((l * w * h * Q) * 100) / 100;

  // Godown utilisation %
  const utilizationPct = layout.netStorageArea > 0 ? Math.round((A_occ / layout.netStorageArea) * 10000) / 100 : 0;
  const remainingFloorArea = Math.max(0, Math.round((layout.netStorageArea - A_occ) * 100) / 100);

  // Status color badge
  let level = 'GREEN';
  if (utilizationPct >= 90) level = 'RED';
  else if (utilizationPct >= 80) level = 'AMBER';

  // Stability ratio
  const slendernessRatio = Math.round(((n * h) / dMin) * 100) / 100;

  return {
    status: 'OK',
    level,
    cartonDimensions: { l, w, h },
    footprintDimensions: { l: l_prime, w: w_prime, handlingGap: g },
    Heff: Heff_p,
    unitsPerStack: n,
    limitsEnforced: {
      n_height,
      n_weight: isFinite(n_weight) ? n_weight : null,
      n_stab: isFinite(n_stab) ? n_stab : null,
      n_floor: isFinite(n_floor) ? n_floor : null,
      n_max: isFinite(n_max) ? n_max : null
    },
    bindingConstraint: (() => {
      if (!isStackable) return 'NOT_STACKABLE (n=1)';
      if (n === n_height) return 'Ceiling / Max Stacking Height';
      if (n === n_weight) return 'Bottom Unit Crush Load Limit';
      if (n === n_stab) return 'Slenderness Stability Ratio';
      if (n === n_floor) return 'Godown Floor Load Limit';
      if (n === n_max) return 'Manufacturer Unit Cap';
      return 'None';
    })(),
    stacksNeeded: S,
    fullStacks: S_full,
    partialStackUnits: remainder,
    footprintPerStack: A_stack,
    occupiedFloorArea: A_occ,
    stackHeight,
    slendernessRatio,
    occupiedVolume: V_occ,
    productVolume: V_prod,
    godownNetArea: layout.netStorageArea,
    remainingFloorArea,
    utilizationPct,
    quantity: Q
  };
}

// ── 4. MAXRECTS 2D PACKER (Appendix A) ──
const contains = (a, b) =>
  a.x <= b.x + EPS &&
  a.y <= b.y + EPS &&
  a.x + a.w >= b.x + b.w - EPS &&
  a.y + a.h >= b.y + b.h - EPS;

const cmp = (a, b) => {
  if (!a || !b) return 0;
  const len = Math.min(a?.length || 0, b?.length || 0);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return (a?.length || 0) - (b?.length || 0);
};

export class MaxRects {
  constructor(zones, obstacles = []) {
    this.free = zones.map(z => ({ ...z }));
    obstacles.forEach(o => this.cut(o));
  }

  cut(u) {
    const out = [];
    for (const f of this.free) {
      if (
        u.x >= f.x + f.w - EPS ||
        u.x + u.w <= f.x + EPS ||
        u.y >= f.y + f.h - EPS ||
        u.y + u.h <= f.y + EPS
      ) {
        out.push(f);
        continue;
      }
      if (u.x > f.x) out.push({ x: f.x, y: f.y, w: u.x - f.x, h: f.h });
      if (u.x + u.w < f.x + f.w) out.push({ x: u.x + u.w, y: f.y, w: f.x + f.w - u.x - u.w, h: f.h });
      if (u.y > f.y) out.push({ x: f.x, y: f.y, w: f.w, h: u.y - f.y });
      if (u.y + u.h < f.y + f.h) out.push({ x: f.x, y: u.y + u.h, w: f.w, h: f.y + f.h - u.y - u.h });
    }
    this.free = out.filter(
      (r, i) => !out.some((o, j) => j !== i && contains(o, r) && (!contains(r, o) || j < i))
    );
  }

  place(w, h, canRotate = true) {
    let best = null;
    for (const f of this.free) {
      const opts = [[w, h, 0]];
      if (canRotate && Math.abs(w - h) > EPS) opts.push([h, w, 90]);
      for (const [pw, ph, rot] of opts) {
        if (pw > f.w + EPS || ph > f.h + EPS) continue;
        const score = [Math.min(f.w - pw, f.h - ph), Math.max(f.w - pw, f.h - ph), f.y, f.x];
        if (!best || cmp(score, best.score) < 0) {
          best = { score, x: f.x, y: f.y, w: pw, h: ph, rot };
        }
      }
    }
    if (!best) return null;
    this.cut(best);
    return { x: best.x, y: best.y, w: best.w, h: best.h, rot: best.rot };
  }

  // Clone this free space model for dry runs
  clone() {
    const cl = new MaxRects([]);
    cl.free = this.free.map(f => ({ ...f }));
    return cl;
  }
}

// ── 5. FULL WAREHOUSE PLACEMENT & CAPACITY VERIFICATION (Section 6 & 6.7) ──
export function packWarehousePlacements(godown = DEFAULT_GODOWN, productsList = [], obstacles = []) {
  const layout = computeWarehouseLayout(godown);
  const packer = new MaxRects(layout.zones, obstacles);

  const placed = [];
  const unplaced = [];

  // Sort demands by footprint area DESC, then by product ID (big first, deterministic)
  const preparedList = productsList.map(p => {
    const stacking = computeVerticalStacking(p.spec || {}, godown, p.quantity || 1);
    const w = stacking.footprintDimensions.w;
    const l = stacking.footprintDimensions.l;
    const canRotate = p.spec?.allowedOrientation !== 'FIXED';
    return {
      ...p,
      stacking,
      w,
      l,
      canRotate,
      area: w * l,
      stacksNeeded: stacking.stacksNeeded
    };
  }).sort((a, b) => b.area - a.area || String(a.id || '').localeCompare(String(b.id || '')));

  for (const item of preparedList) {
    const unitsPerStack = item.stacking.unitsPerStack;
    let placedForThisItem = 0;
    let unplacedForThisItem = 0;

    for (let sIdx = 1; sIdx <= item.stacksNeeded; sIdx++) {
      const isLastStack = (sIdx === item.stacksNeeded);
      const stackUnits = (isLastStack && item.stacking.partialStackUnits > 0)
        ? item.stacking.partialStackUnits
        : unitsPerStack;

      const r = packer.place(item.w, item.l, item.canRotate);
      if (!r) {
        unplacedForThisItem++;
        continue;
      }

      placedForThisItem++;
      placed.push({
        id: `${item.sku || item.id || 'STK'}-${sIdx}`,
        productId: item.sku || item.id || 'SKU',
        productName: item.name || 'Product',
        customerId: item.customerId || null,
        customerName: item.customerName || 'Company Stock',
        x: r.x,
        y: r.y,
        width: r.w,
        length: r.h,
        height: item.stacking.stackHeight,
        unitHeight: item.spec?.height || 1.0,
        cartonLength: item.spec?.length || 2.0,
        cartonWidth: item.spec?.width || 1.0,
        stackQuantity: stackUnits,
        orientation: r.rot,
        occupiedArea: Math.round(r.w * r.h * 100) / 100,
        status: 'VERIFIED'
      });
    }

    if (unplacedForThisItem > 0) {
      unplaced.push({
        productId: item.sku || item.id,
        productName: item.name,
        unplacedStacks: unplacedForThisItem,
        unplacedUnits: unplacedForThisItem * unitsPerStack
      });
    }
  }

  // Calculate Verified Remaining Capacity via dry run of reference carton (2x1 ft or target product)
  const totalOccupiedArea = placed.reduce((acc, p) => acc + p.occupiedArea, 0);
  const remainingArea = Math.max(0, Math.round((layout.netStorageArea - totalOccupiedArea) * 100) / 100);
  const utilizationPct = layout.netStorageArea > 0 ? Math.round((totalOccupiedArea / layout.netStorageArea) * 10000) / 100 : 0;

  // Largest free rectangle for fragmentation index (Eq. 6.4)
  let maxFreeArea = 0;
  let totalFreeArea = 0;
  for (const f of packer.free) {
    const fa = f.w * f.h;
    totalFreeArea += fa;
    if (fa > maxFreeArea) maxFreeArea = fa;
  }
  const fragmentation = totalFreeArea > 0 ? Math.max(0, Math.round((1 - (maxFreeArea / totalFreeArea)) * 1000) / 1000) : 0;

  return {
    layout,
    placed,
    unplaced,
    totalOccupiedArea,
    remainingArea,
    utilizationPct,
    level: utilizationPct >= 90 ? 'RED' : utilizationPct >= 80 ? 'AMBER' : 'GREEN',
    fragmentation,
    freeRectanglesCount: packer.free.length,
    freeRectangles: packer.free
  };
}

// Dry run helper to get exact physically verified capacity for a specific SKU
export function verifyGodownCapacityForProduct(godown = DEFAULT_GODOWN, existingPlacements = [], spec = DEFAULT_PRODUCT_SPEC) {
  const layout = computeWarehouseLayout(godown);
  const packer = new MaxRects(layout.zones);

  // Cut existing placements
  (existingPlacements || []).forEach(p => {
    if (p && typeof p.x === 'number' && typeof p.y === 'number') {
      packer.cut({ x: p.x, y: p.y, w: p.width || p.w || 2, h: p.length || p.h || 2 });
    }
  });

  const stacking = computeVerticalStacking(spec, godown, 100000);
  const w = stacking.footprintDimensions.w;
  const l = stacking.footprintDimensions.l;
  const canRotate = spec.allowedOrientation !== 'FIXED';

  // Run dry run placement until packer returns null
  let verifiedStacks = 0;
  const dryPacker = packer.clone();
  while (true) {
    const r = dryPacker.place(w, l, canRotate);
    if (!r) break;
    verifiedStacks++;
  }

  const verifiedUnits = verifiedStacks * stacking.unitsPerStack;
  const estimatedStacks = stacking.footprintPerStack > 0
    ? Math.floor(layout.netStorageArea / stacking.footprintPerStack)
    : 0;
  const estimatedUnits = estimatedStacks * stacking.unitsPerStack;

  return {
    verifiedStacks,
    verifiedUnits,
    estimatedStacks,
    estimatedUnits,
    differenceStacks: estimatedStacks - verifiedStacks,
    stacking
  };
}

// ── 6. STORAGE BILLING & GST CALCULATION (Section 9) ──
export function computeStorageBilling({
  method = 'FLOOR_AREA', // 'FLOOR_AREA' | 'VOLUME' | 'PRODUCT'
  rate = 20.0,           // Rate in ₹
  occupiedArea = 100.0,  // sq ft
  occupiedVolume = 1000.0, // cu ft
  quantity = 500,        // units
  gstPercent = 18.0,
  intraState = true,
  sacCode = '996729'
}) {
  const r = parseFloat(rate) || 0;
  let subtotal = 0;
  let billableQty = 0;
  let metricLabel = '';

  if (method === 'FLOOR_AREA') {
    billableQty = parseFloat(occupiedArea) || 0;
    subtotal = billableQty * r;
    metricLabel = 'sq ft';
  } else if (method === 'VOLUME') {
    billableQty = parseFloat(occupiedVolume) || 0;
    subtotal = billableQty * r;
    metricLabel = 'cu ft';
  } else {
    // PRODUCT
    billableQty = parseInt(quantity, 10) || 0;
    subtotal = billableQty * r;
    metricLabel = 'units';
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const gstRate = parseFloat(gstPercent) || 18.0;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (intraState) {
    // CGST + SGST (Eq. 9.3: round2(subtotal * g / 200))
    cgst = Math.round((subtotal * gstRate / 200) * 100) / 100;
    sgst = Math.round((subtotal * gstRate / 200) * 100) / 100;
  } else {
    // IGST (Eq. 9.3: round2(subtotal * g / 100))
    igst = Math.round((subtotal * gstRate / 100) * 100) / 100;
  }

  const totalGst = Math.round((cgst + sgst + igst) * 100) / 100;
  const total = Math.round((subtotal + totalGst) * 100) / 100;

  const costPerUnit = quantity > 0 ? Math.round((total / quantity) * 100) / 100 : 0;
  const dailyCharge = Math.round((total / 30) * 100) / 100;

  return {
    method,
    rate: r,
    billableQty,
    metricLabel,
    subtotal,
    gstPercent: gstRate,
    sacCode,
    intraState,
    cgst,
    sgst,
    igst,
    totalGst,
    total,
    costPerUnit,
    dailyCharge
  };
}

// ── 7. CAPACITY GUARD FOR PURCHASE INVOICES / GRN (Section 10.2) ──
export function checkPurchaseWarehouseCapacity(arg1 = DEFAULT_GODOWN, arg2 = [], arg3 = 0, arg4 = 'BLOCK') {
  let godown = DEFAULT_GODOWN;
  let existingOccupiedArea = 0;
  let purchaseLineItems = [];
  let policy = 'BLOCK';

  if (arg1 && typeof arg1 === 'object' && ('purchaseLineItems' in arg1 || 'existingOccupiedArea' in arg1)) {
    godown = arg1.godown || DEFAULT_GODOWN;
    existingOccupiedArea = Number(arg1.existingOccupiedArea) || 0;
    purchaseLineItems = Array.isArray(arg1.purchaseLineItems) ? arg1.purchaseLineItems : [];
    policy = arg1.policy || 'BLOCK';
  } else if (Array.isArray(arg1)) {
    purchaseLineItems = arg1;
    godown = (arg2 && typeof arg2 === 'object') ? arg2 : DEFAULT_GODOWN;
    existingOccupiedArea = Number(arg3) || 0;
    policy = typeof arg4 === 'string' ? arg4 : 'BLOCK';
  } else {
    godown = (arg1 && typeof arg1 === 'object') ? { ...DEFAULT_GODOWN, ...arg1 } : DEFAULT_GODOWN;
    purchaseLineItems = Array.isArray(arg2) ? arg2 : [];
    existingOccupiedArea = Number(arg3) || 0;
    policy = typeof arg4 === 'string' ? arg4 : 'BLOCK';
  }

  const layout = computeWarehouseLayout(godown);
  const availableArea = Math.max(0, layout.netStorageArea - existingOccupiedArea);

  let totalRequiredArea = 0;
  let totalRequiredVolume = 0;
  let totalStacks = 0;
  let totalUnits = 0;
  const itemFootprints = [];
  const items = [];

  for (const item of (purchaseLineItems || [])) {
    if (!item) continue;
    const qty = parseInt(item.qty ?? item.quantity, 10) || 0;
    if (qty <= 0) continue;

    const itemDim = item.dimensions || {};
    const itemSpec = item.spec || {};
    const spec = {
      length: parseFloat(item.lengthFt ?? item.cartonLength ?? item.length ?? itemSpec.length ?? itemDim.length ?? 2.0),
      width: parseFloat(item.widthFt ?? item.cartonWidth ?? item.width ?? itemSpec.width ?? itemDim.width ?? 1.0),
      height: parseFloat(item.heightFt ?? item.cartonHeight ?? item.height ?? itemSpec.height ?? itemDim.height ?? 1.0),
      stackable: item.stackable !== false && itemSpec.stackable !== false,
      maxStackHeight: item.maxStackHeight ? parseFloat(item.maxStackHeight) : null,
      maxUnitsPerStack: item.maxUnitsPerStack ? parseInt(item.maxUnitsPerStack, 10) : null,
      handlingGap: parseFloat(item.handlingGap ?? 0.25)
    };

    const stacking = computeVerticalStacking(spec, godown, qty);
    totalRequiredArea += stacking.occupiedFloorArea;
    totalRequiredVolume += stacking.occupiedVolume;
    totalStacks += stacking.stacksNeeded;
    totalUnits += qty;

    const itemObj = {
      id: item.id || item.itemCode || item.sku || 'SKU',
      itemCode: item.itemCode || item.sku || item.id || 'SKU',
      sku: item.sku || item.itemCode || 'SKU',
      name: item.name || 'Product',
      qty,
      quantity: qty,
      unitCost: item.unitCost || 0,
      unitsPerStack: stacking.unitsPerStack,
      stacksNeeded: stacking.stacksNeeded,
      occupiedFloorArea: stacking.occupiedFloorArea,
      occupiedVolume: stacking.occupiedVolume,
      stacking: {
        unitsPerStack: stacking.unitsPerStack,
        stacksNeeded: stacking.stacksNeeded,
        areaPerStackSqFt: stacking.footprintPerStack,
        totalAreaSqFt: stacking.occupiedFloorArea,
        occupiedVolume: stacking.occupiedVolume
      }
    };

    itemFootprints.push(itemObj);
    items.push(itemObj);
  }

  totalRequiredArea = Math.round(totalRequiredArea * 100) / 100;
  const fits = totalRequiredArea <= availableArea + EPS;
  const overflowArea = fits ? 0 : Math.round((totalRequiredArea - availableArea) * 100) / 100;
  const projectedTotalArea = Math.round((existingOccupiedArea + totalRequiredArea) * 100) / 100;
  const projectedUtilizationPct = layout.netStorageArea > 0
    ? Math.round((projectedTotalArea / layout.netStorageArea) * 10000) / 100
    : 0;

  // Monthly storage cost estimate for this incoming batch
  const storageCost = computeStorageBilling({
    method: godown.pricingMethod || 'FLOOR_AREA',
    rate: godown.storageRate || 20,
    occupiedArea: totalRequiredArea,
    occupiedVolume: totalRequiredVolume,
    quantity: totalUnits,
    gstPercent: godown.gstPercent || 18,
    intraState: true
  });

  let statusLevel = 'GREEN';
  let message = `Capacity Verified: Inbound batch requires ${totalRequiredArea} sq ft (${totalStacks} stacks). Fits within ${availableArea.toFixed(1)} sq ft remaining in ${layout.name}.`;

  if (!fits) {
    statusLevel = policy === 'BLOCK' ? 'RED' : 'AMBER';
    message = `CAPACITY EXCEEDED: Inbound order needs ${totalRequiredArea} sq ft (${totalStacks} stacks), but only ${availableArea.toFixed(1)} sq ft available in ${layout.name}. Space deficit: ${overflowArea} sq ft.`;
  } else if (projectedUtilizationPct >= 85) {
    statusLevel = 'AMBER';
    message = `Capacity Warning: Inbound order will raise godown utilization to ${projectedUtilizationPct.toFixed(1)}% (Threshold: 85%).`;
  }

  const remainingAreaSqFt = Math.max(0, Math.round((availableArea - totalRequiredArea) * 100) / 100);

  const godownDetails = {
    ...layout,
    lengthFt: layout.length,
    widthFt: layout.width,
    heightFt: layout.height,
    netStorageAreaSqFt: layout.netStorageArea
  };

  return {
    fits,
    policy,
    statusLevel,
    status: statusLevel,
    message,
    recommendation: message,
    godown: godownDetails,
    godownNetArea: layout.netStorageArea,
    existingOccupiedArea,
    availableArea,
    remainingAreaSqFt,
    totalRequiredArea,
    requiredAreaSqFt: totalRequiredArea,
    totalRequiredVolume,
    totalStacks,
    totalUnits,
    totalQuantity: totalUnits,
    overflowArea,
    projectedTotalArea,
    projectedUtilizationPct,
    occupancyPctAfterInbound: projectedUtilizationPct,
    itemFootprints,
    items,
    estimatedMonthlyStorageCost: storageCost.total,
    storageCostBurdenPerUnit: storageCost.costPerUnit,
    storageBillingDetails: storageCost,
    storageBilling: storageCost
  };
}
