import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Layers,
  ShieldCheck,
  Maximize2,
  RotateCw,
  Compass,
  DollarSign,
  AlertTriangle,
  Info,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Box,
  Eye
} from 'lucide-react';
import {
  computeWarehouseLayout,
  computeVerticalStacking,
  packWarehousePlacements,
  verifyGodownCapacityForProduct,
  computeStorageBilling,
  DEFAULT_GODOWN,
  DEFAULT_PRODUCT_SPEC
} from './warehouseEngine';

export default function WarehouseVisualizer({
  productSpec = DEFAULT_PRODUCT_SPEC,
  godownConfig = DEFAULT_GODOWN,
  quantity = 500,
  productName = 'Product Stacks',
  productSku = 'PRD-001',
  unitCost = 1000
}) {
  const [viewMode, setViewMode] = useState('2d'); // '2d' | '3d'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedStack, setSelectedStack] = useState(null);
  const [orbitAngle, setOrbitAngle] = useState(45); // degrees for 3D
  const [orbitPitch, setOrbitPitch] = useState(30); // degrees for 3D
  const [billingMethod, setBillingMethod] = useState('FLOOR_AREA'); // 'FLOOR_AREA' | 'VOLUME' | 'PRODUCT'
  const [storageRate, setStorageRate] = useState(godownConfig.storageRate || 20);

  // Compute Layout & Stacking
  const layout = useMemo(() => {
    try {
      return computeWarehouseLayout(godownConfig) || computeWarehouseLayout(DEFAULT_GODOWN);
    } catch (err) {
      console.warn('computeWarehouseLayout fallback to DEFAULT_GODOWN:', err);
      return computeWarehouseLayout(DEFAULT_GODOWN);
    }
  }, [godownConfig]);

  const stacking = useMemo(() => {
    try {
      return computeVerticalStacking(productSpec, godownConfig, quantity);
    } catch (err) {
      console.warn('computeVerticalStacking fallback:', err);
      return computeVerticalStacking(DEFAULT_PRODUCT_SPEC, DEFAULT_GODOWN, quantity);
    }
  }, [productSpec, godownConfig, quantity]);

  // Compute Placements via MaxRects Packer
  const packResult = useMemo(() => {
    try {
      return packWarehousePlacements(godownConfig, [
        {
          id: productSku,
          sku: productSku,
          name: productName,
          quantity,
          spec: productSpec
        }
      ]);
    } catch (err) {
      console.warn('packWarehousePlacements fallback:', err);
      return { placements: [], zones: layout?.zones || [], unplacedCount: 0, overflow: false, totalPackedCount: 0 };
    }
  }, [godownConfig, productSku, productName, quantity, productSpec, layout]);

  // Capacity Verification (Estimated vs Verified)
  const capacityMetrics = useMemo(() => {
    try {
      return verifyGodownCapacityForProduct(godownConfig, [], productSpec);
    } catch (err) {
      return { maxCapacityUnits: 0, totalStorageArea: 3496 };
    }
  }, [godownConfig, productSpec]);

  // Storage Billing Calculation
  const billing = useMemo(() => {
    try {
      return computeStorageBilling({
        method: billingMethod,
        rate: storageRate,
        occupiedArea: stacking?.occupiedFloorArea || 0,
        occupiedVolume: stacking?.occupiedVolume || 0,
        quantity,
        gstPercent: godownConfig.gstPercent || 18,
        intraState: true,
        sacCode: godownConfig.sacCode || '996729'
      });
    } catch (err) {
      return { baseRent: 0, gstAmount: 0, total: 0, costPerUnit: 0, sacCode: '996729', gstPercent: 18 };
    }
  }, [billingMethod, storageRate, stacking, quantity, godownConfig]);

  const L = layout?.length || layout?.lengthFt || 100;
  const W = layout?.width || layout?.widthFt || 50;
  const c = layout?.wallClearance ?? 4;
  const a = layout?.aisleWidth ?? 4;
  const z = layout?.zoneWidth ?? 21;

  return (
    <div className="warehouse-visualizer-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Overview Banner: Option C Godown Architecture ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '1.2rem 1.4rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Boxes size={22} color="var(--brand-accent, #0284c7)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Warehouse Space Optimization & Stacking (Option C)
            </h3>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: '6px',
                background: stacking.level === 'GREEN' ? 'rgba(16, 185, 129, 0.15)' : stacking.level === 'AMBER' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: stacking.level === 'GREEN' ? '#10b981' : stacking.level === 'AMBER' ? '#f59e0b' : '#ef4444',
                border: `1px solid ${stacking.level === 'GREEN' ? 'rgba(16, 185, 129, 0.3)' : stacking.level === 'AMBER' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}
            >
              {stacking.utilizationPct.toFixed(2)}% {stacking.level} UTILIZATION
            </span>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Physical floor plan: {L} × {W} × {layout.height} ft godown • 4 ft perimeter wall clearance • 4 ft central walking aisle • 2 dedicated storage zones ({layout.netStorageArea.toLocaleString('en-IN')} sq ft net).
          </p>
        </div>

        {/* View Switcher Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === '2d' ? 'var(--brand-primary, #0284c7)' : 'transparent',
                color: viewMode === '2d' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Grid size={14} />
              <span>2D Plan (SVG)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === '3d' ? 'var(--brand-primary, #0284c7)' : 'transparent',
                color: viewMode === '3d' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Box size={14} />
              <span>3D Godown View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))}
            className="secondary-action-btn"
            style={{ padding: '0.4rem', height: '32px' }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
            className="secondary-action-btn"
            style={{ padding: '0.4rem', height: '32px' }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* ── Visual Canvas Container (2D SVG Plan or 3D Isometric View) ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '1.2rem',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Compass size={16} color="var(--brand-accent)" />
            <span>{viewMode === '2d' ? '2D Godown Orthogonal Floor Plan (MaxRects Placement)' : '3D Godown Stacking & Clearance Model'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              (Zoom: {(zoomLevel * 100).toFixed(0)}%)
            </span>
          </div>

          {/* Legend Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.74rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444' }} />
              <span>4ft Wall Clearance (No Storage)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.25)', border: '1px solid #f59e0b' }} />
              <span>4ft Walking Aisle</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.4)', border: '1px solid #0284c7' }} />
              <span>Active Stacks ({(packResult?.placed || []).length} Placed)</span>
            </div>
          </div>
        </div>

        {/* ── 2D SVG FLOOR PLAN ── */}
        {viewMode === '2d' && (
          <div style={{ width: '100%', overflowX: 'auto', background: '#0a101f', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg
              viewBox={`0 0 ${L * 10} ${W * 10}`}
              style={{
                width: '100%',
                maxHeight: '440px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
                display: 'block'
              }}
            >
              <defs>
                {/* Red diagonal hatching for perimeter clearance */}
                <pattern id="clearanceHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="2" />
                </pattern>
                {/* Dashed pattern for zone floor */}
                <pattern id="zoneGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* 1. Entire Godown Gross Area */}
              <rect x="0" y="0" width={L * 10} height={W * 10} fill="#070c17" stroke="#334155" strokeWidth="3" />

              {/* 2. Perimeter Clearance Area (Red hatched) */}
              <rect x="0" y="0" width={L * 10} height={W * 10} fill="url(#clearanceHatch)" />

              {/* 3. Inner Usable Rectangle */}
              <rect x={c * 10} y={c * 10} width={(L - 2 * c) * 10} height={(W - 2 * c) * 10} fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />

              {/* 4. Central Walking Aisle (Amber) */}
              {layout.aisleRect && (
                <g>
                  <rect
                    x={layout.aisleRect.x * 10}
                    y={layout.aisleRect.y * 10}
                    width={layout.aisleRect.w * 10}
                    height={layout.aisleRect.h * 10}
                    fill="rgba(245, 158, 11, 0.18)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={(layout.aisleRect.x + layout.aisleRect.w / 2) * 10}
                    y={(layout.aisleRect.y + layout.aisleRect.h / 2 + 1.2) * 10}
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    CENTRAL WALKING AISLE (4 FT)
                  </text>
                </g>
              )}

              {/* 5. Storage Zones A & B */}
              {layout.zones.map(zone => (
                <g key={zone.id}>
                  <rect
                    x={zone.x * 10}
                    y={zone.y * 10}
                    width={zone.w * 10}
                    height={zone.h * 10}
                    fill="url(#zoneGrid)"
                    stroke="rgba(16, 185, 129, 0.4)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={(zone.x + 5) * 10}
                    y={(zone.y + 3) * 10}
                    fill="rgba(52, 211, 153, 0.6)"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {zone.name} (92 × 19 ft)
                  </text>
                </g>
              ))}

              {/* 6. Placed Stacks from MaxRects Packer */}
              {(packResult?.placed || []).map((stack, idx) => {
                if (!stack) return null;
                const isSelected = selectedStack?.id === stack.id;
                const sWidth = stack.width || stack.w || 2;
                const sLength = stack.length || stack.h || 2;
                return (
                  <g
                    key={stack.id || idx}
                    onClick={() => setSelectedStack(stack)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={(stack.x || 0) * 10}
                      y={(stack.y || 0) * 10}
                      width={sWidth * 10}
                      height={sLength * 10}
                      fill={isSelected ? '#38bdf8' : 'rgba(2, 132, 199, 0.65)'}
                      stroke={isSelected ? '#ffffff' : '#0284c7'}
                      strokeWidth={isSelected ? '2' : '1'}
                      rx="1.5"
                    >
                      <title>{`${stack.productName || 'Product'}\nStack #${idx + 1}: ${stack.stackQuantity || 1} units\nDimensions: ${sWidth} x ${sLength} ft\nCoordinates: (${stack.x || 0}, ${stack.y || 0})`}</title>
                    </rect>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* ── 3D ISOMETRIC / PERSPECTIVE GODOWN MODEL ── */}
        {viewMode === '3d' && (
          <div style={{ width: '100%', height: '420px', background: '#070b14', borderRadius: '8px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.85)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Orbit:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={orbitAngle}
                  onChange={(e) => setOrbitAngle(parseInt(e.target.value, 10))}
                  style={{ width: '80px', accentColor: 'var(--brand-accent)' }}
                />
                <span>{orbitAngle}°</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Pitch:</span>
                <input
                  type="range"
                  min="15"
                  max="75"
                  value={orbitPitch}
                  onChange={(e) => setOrbitPitch(parseInt(e.target.value, 10))}
                  style={{ width: '70px', accentColor: 'var(--brand-accent)' }}
                />
                <span>{orbitPitch}°</span>
              </div>
            </div>

            {/* Isometric 3D Projection Canvas Simulation */}
            <svg
              viewBox="-250 -120 700 460"
              style={{ width: '100%', height: '100%', transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              {(() => {
                // Isometric projection math
                const rad = (orbitAngle * Math.PI) / 180;
                const pRad = (orbitPitch * Math.PI) / 180;
                const isoX = (x, y) => (x - y) * Math.cos(rad) * 2.2 + 100;
                const isoY = (x, y, zHeight = 0) => (x + y) * Math.sin(pRad) * 1.3 - zHeight * 6.5 + 80;

                return (
                  <g>
                    {/* Floor Base */}
                    <polygon
                      points={`
                        ${isoX(0, 0)},${isoY(0, 0)}
                        ${isoX(L, 0)},${isoY(L, 0)}
                        ${isoX(L, W)},${isoY(L, W)}
                        ${isoX(0, W)},${isoY(0, W)}
                      `}
                      fill="#0b1329"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />

                    {/* 4 ft Perimeter Clearance Decal (Pink / Red) */}
                    <polygon
                      points={`
                        ${isoX(c, c)},${isoY(c, c)}
                        ${isoX(L - c, c)},${isoY(L - c, c)}
                        ${isoX(L - c, W - c)},${isoY(L - c, W - c)}
                        ${isoX(c, W - c)},${isoY(c, W - c)}
                      `}
                      fill="#111c38"
                      stroke="rgba(244, 63, 94, 0.4)"
                      strokeWidth="1.5"
                    />

                    {/* Central Walking Aisle (Amber 3D Decal) */}
                    {layout.aisleRect && (
                      <polygon
                        points={`
                          ${isoX(layout.aisleRect.x, layout.aisleRect.y)},${isoY(layout.aisleRect.x, layout.aisleRect.y)}
                          ${isoX(layout.aisleRect.x + layout.aisleRect.w, layout.aisleRect.y)},${isoY(layout.aisleRect.x + layout.aisleRect.w, layout.aisleRect.y)}
                          ${isoX(layout.aisleRect.x + layout.aisleRect.w, layout.aisleRect.y + layout.aisleRect.h)},${isoY(layout.aisleRect.x + layout.aisleRect.w, layout.aisleRect.y + layout.aisleRect.h)}
                          ${isoX(layout.aisleRect.x, layout.aisleRect.y + layout.aisleRect.h)},${isoY(layout.aisleRect.x, layout.aisleRect.y + layout.aisleRect.h)}
                        `}
                        fill="rgba(245, 158, 11, 0.25)"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Stacks as 3D Extruded Blocks */}
                    {(packResult?.placed || []).map((stack, sIdx) => {
                      if (!stack) return null;
                      const sx = stack.x || 0;
                      const sy = stack.y || 0;
                      const sw = stack.width || stack.w || 2;
                      const sl = stack.length || stack.h || 2;
                      const sh = Math.min(layout?.effectiveHeight || 18, stack.height || stack.unitHeight || 4);

                      return (
                        <g key={stack.id || sIdx}>
                          {/* Top Face */}
                          <polygon
                            points={`
                              ${isoX(sx, sy)},${isoY(sx, sy, sh)}
                              ${isoX(sx + sw, sy)},${isoY(sx + sw, sy, sh)}
                              ${isoX(sx + sw, sy + sl)},${isoY(sx + sw, sy + sl, sh)}
                              ${isoX(sx, sy + sl)},${isoY(sx, sy + sl, sh)}
                            `}
                            fill="#38bdf8"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                          {/* Right Face */}
                          <polygon
                            points={`
                              ${isoX(sx + sw, sy)},${isoY(sx + sw, sy, 0)}
                              ${isoX(sx + sw, sy)},${isoY(sx + sw, sy, sh)}
                              ${isoX(sx + sw, sy + sl)},${isoY(sx + sw, sy + sl, sh)}
                              ${isoX(sx + sw, sy + sl)},${isoY(sx + sw, sy + sl, 0)}
                            `}
                            fill="#0369a1"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                          {/* Left Face */}
                          <polygon
                            points={`
                              ${isoX(sx, sy + sl)},${isoY(sx, sy + sl, 0)}
                              ${isoX(sx, sy + sl)},${isoY(sx, sy + sl, sh)}
                              ${isoX(sx + sw, sy + sl)},${isoY(sx + sw, sy + sl, sh)}
                              ${isoX(sx + sw, sy + sl)},${isoY(sx + sw, sy + sl, 0)}
                            `}
                            fill="#075985"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                        </g>
                      );
                    })}

                    {/* Dashed Sprinkler Plane at H - s */}
                    <polygon
                      points={`
                        ${isoX(0, 0)},${isoY(0, 0, layout.effectiveHeight)}
                        ${isoX(L, 0)},${isoY(L, 0, layout.effectiveHeight)}
                        ${isoX(L, W)},${isoY(L, W, layout.effectiveHeight)}
                        ${isoX(0, W)},${isoY(0, W, layout.effectiveHeight)}
                      `}
                      fill="none"
                      stroke="rgba(244, 63, 94, 0.6)"
                      strokeWidth="1.5"
                      strokeDasharray="6,6"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>
        )}
      </div>

      {/* ── 4 KPI Summary Cards (Section 12.1) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Net Usable Floor Area
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {layout.netStorageArea.toLocaleString('en-IN')} sq ft
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Inner ({layout.innerArea}) - Aisle ({layout.aisleArea} sq ft)
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
            Occupied by {productSku}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
            {stacking.occupiedFloorArea.toLocaleString('en-IN')} sq ft
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {stacking.stacksNeeded} stacks × {stacking.footprintPerStack} sq ft / stack
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
            Remaining Verified Space
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            {stacking.remainingFloorArea.toLocaleString('en-IN')} sq ft
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {((stacking.remainingFloorArea / layout.netStorageArea) * 100).toFixed(1)}% available buffer
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' }}>
            Monthly Storage Cost
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa', marginTop: '0.25rem' }}>
            ₹{billing.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Incl. 18% GST (₹{billing.costPerUnit} / unit burden)
          </div>
        </div>
      </div>

      {/* ── Vertical Stacking Sensitivity & Constraints Table (Section 5.4) ── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--brand-accent)" />
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Vertical Stacking Engine & Safety Constraints (Heff = {stacking.Heff} ft)
            </h4>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Active Limiting Constraint: <strong style={{ color: 'var(--brand-accent)' }}>{stacking.bindingConstraint}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Active Configuration Breakdown */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Current Stacking Parameters
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Carton Dimensions:</span>
                <strong>
                  {productSpec?.length ?? (productSpec?.dimensions?.length ? (productSpec.dimensions.unit === 'in' ? (productSpec.dimensions.length / 12).toFixed(1) : productSpec.dimensions.length) : 2)} × {productSpec?.width ?? (productSpec?.dimensions?.width ? (productSpec.dimensions.unit === 'in' ? (productSpec.dimensions.width / 12).toFixed(1) : productSpec.dimensions.width) : 1)} × {productSpec?.height ?? (productSpec?.dimensions?.height ? (productSpec.dimensions.unit === 'in' ? (productSpec.dimensions.height / 12).toFixed(1) : productSpec.dimensions.height) : 1)} ft
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Units Per Vertical Stack (n):</span>
                <strong style={{ color: '#10b981' }}>{stacking.unitsPerStack} units / stack</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Stack Height:</span>
                <strong>{stacking.stackHeight} ft (Ceiling limit: {stacking.Heff} ft)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Slenderness Stability Ratio:</span>
                <span style={{ color: stacking.slendernessRatio > 4 ? '#f59e0b' : 'inherit' }}>
                  {stacking.slendernessRatio} : 1 {stacking.slendernessRatio > 4 ? '(High Slenderness)' : '(Stable)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Stacks Needed (S):</span>
                <strong>{stacking.stacksNeeded} stacks ({stacking.fullStacks} full + {stacking.partialStackUnits ? `1 of ${stacking.partialStackUnits}` : '0 partial'})</strong>
              </div>
            </div>
          </div>

          {/* Automated Billing Card (Section 9) */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Storage Billing (SAC 996729)</span>
              <select
                value={billingMethod}
                onChange={(e) => setBillingMethod(e.target.value)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '5px',
                  padding: '0.15rem 0.4rem'
                }}
              >
                <option value="FLOOR_AREA">Floor Area (₹/sq ft)</option>
                <option value="VOLUME">Volume (₹/cu ft)</option>
                <option value="PRODUCT">Product Count (₹/unit)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Billable Base:</span>
                <strong>{billing.billableQty.toLocaleString('en-IN')} {billing.metricLabel} @ ₹{billing.rate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <strong>₹{billing.subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>CGST 9% + SGST 9%:</span>
                <strong>₹{billing.cgst.toFixed(2)} + ₹{billing.sgst.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                <span style={{ fontWeight: 700 }}>Total Monthly Storage Cost:</span>
                <strong style={{ color: '#a78bfa', fontSize: '0.92rem' }}>₹{billing.total.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Holding Cost Burden:</span>
                <span>+₹{billing.costPerUnit} / unit / month (₹{billing.dailyCharge}/day)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

