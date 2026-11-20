import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Calendar, Building2, Users, Shield, Cpu, BookOpen,
  PieChart, Settings, BarChart3, Store, TrendingUp, TrendingDown,
  ClipboardList, AlertTriangle, CheckCircle2, Clock, ChevronRight,
  MapPin, Package, DollarSign, ShoppingCart, CreditCard, Truck,
  Wallet, Receipt, Boxes, Search, Filter, Download, Plus, Eye,
  RefreshCw, Hash, Layers, ArrowUpRight, ArrowDownRight, Globe,
  Lock, Unlock, Server, Database, HardDrive, Info, Activity, Wrench,
  Briefcase, Tag, Percent, GitBranch, Zap, AlertCircle, Sparkles,
  MessageSquare, Send, Check, ShieldAlert, ArrowRight, CornerDownLeft,
  FileCheck, ShieldCheck, X, Trash2, Navigation, Compass, Key,
  ExternalLink, FileCode, Copy
} from 'lucide-react';
import { OwnerReportsChartSection } from './AnalyticsComponents';
import { TablePagination, useTablePagination } from './TablePagination';

import { downloadCSV } from './exportUtils';
export { downloadCSV };

/* ========================================================================
   OWNER DASHBOARD PAGES — One component per sidebar tab
   ======================================================================== */

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────
export function OwnerOverview({ stats, recentActivity, availableBranches, handleEnterBranchDashboard, currentUser, currentTenant, onNavigateTab }) {
  const modules = [
    { name: 'Chart of Accounts', desc: 'Manage COA templates & account groups', icon: FileSpreadsheet, color: '#38bdf8', tab: 'accounts' },
    { name: 'Financial Periods', desc: 'Lock/unlock periods & fiscal year', icon: Calendar, color: '#10b981', tab: 'finance' },
    { name: 'Companies & GST', desc: 'GSTIN, PAN, state codes, legal entities', icon: Building2, color: '#a855f7', tab: 'companies' },
    { name: 'Branch Management', desc: 'Add, configure, and monitor branches', icon: Store, color: '#f59e0b', tab: 'branches' },
    { name: 'User Roles & ACL', desc: 'Role-based access control & permissions', icon: Shield, color: '#ec4899', tab: 'users' },
    { name: 'Loss Prevention & Audit', desc: 'Shrinkage detection & maker-checker', icon: BookOpen, color: '#84cc16', tab: 'lossPrevention' },
    { name: 'Reports Dashboard', desc: 'P&L, Trial Balance, Cash Flow', icon: PieChart, color: '#f97316', tab: 'reports' },
    { name: 'System Configuration', desc: 'Currency, timezone, integrations', icon: Settings, color: '#6366f1', tab: 'settings' },
  ];

  return (
    <>
      {/* Welcome */}
      <div className="dash-welcome-banner animate-fade-in">
        <div>
          <h2 className="dash-welcome-title">Welcome back, {currentUser?.name || 'Owner'} 👋</h2>
          <p className="dash-welcome-desc">Here's what's happening across your franchise network today.</p>
        </div>
        <div className="dash-welcome-date">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid animate-fade-in">
        {stats.map((stat, i) => (
          <div className="dash-stat-card" key={i}>
            <div className="stat-card-header">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-icon-circle" style={{ background: `${stat.color}20`, color: stat.color }}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.up ? 'positive' : 'neutral'}`}>
              {stat.up ? <TrendingUp size={13} /> : <AlertTriangle size={13} />}
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modules + Activity */}
      <div className="dash-two-col animate-fade-in">
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">System Modules</h3>
            <span className="dash-panel-badge">{modules.length} Modules</span>
          </div>
          <div className="dash-modules-grid">
            {modules.map((mod, i) => (
              <button
                className="dash-module-card"
                key={i}
                onClick={() => onNavigateTab && onNavigateTab(mod.tab)}
                title={`Open ${mod.name}`}
              >
                <div className="module-icon-wrap" style={{ background: `${mod.color}15`, color: mod.color }}>
                  <mod.icon size={20} />
                </div>
                <div className="module-info">
                  <span className="module-name">{mod.name}</span>
                  <span className="module-desc">{mod.desc}</span>
                </div>
                <ChevronRight size={16} className="module-arrow" />
              </button>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Recent Activity</h3>
            <button className="dash-panel-link" onClick={() => onNavigateTab && onNavigateTab('reports')}>View All</button>
          </div>
          <div className="dash-activity-feed">
            {recentActivity.map((act, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${act.type}`}></div>
                <div className="activity-info">
                  <span className="activity-action">{act.action}</span>
                  <span className="activity-branch">{act.branch}</span>
                </div>
                <span className="activity-time"><Clock size={12} /> {act.time}</span>
              </div>
            ))}
          </div>

          <div className="dash-panel-header" style={{ marginTop: '1.5rem' }}>
            <h3 className="dash-panel-title">Branch Quick Access</h3>
          </div>
          <div className="dash-branch-quick">
            {availableBranches.map((b) => (
              <button key={b.id} className="dash-branch-pill" onClick={() => handleEnterBranchDashboard(b)}>
                <Store size={14} /><span>{b.name}</span>
                <span className="dash-branch-code">{b.code}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── GUJARAT CITY GPS COORDINATES PRESETS ──────────────────────────────
const GUJARAT_CITY_PRESETS = [
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { city: 'Vadodara', lat: 22.3072, lng: 73.1812 },
  { city: 'Surat', lat: 21.1702, lng: 72.8311 },
  { city: 'Rajkot', lat: 22.3039, lng: 70.8022 },
  { city: 'Bhavnagar', lat: 21.7645, lng: 72.1519 },
  { city: 'Jamnagar', lat: 22.4707, lng: 70.0577 },
  { city: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
  { city: 'Anand', lat: 22.5645, lng: 72.9289 },
  { city: 'Bharuch', lat: 21.7051, lng: 72.9959 },
  { city: 'Mehsana', lat: 23.5880, lng: 72.3693 },
  { city: 'Junagadh', lat: 21.5222, lng: 70.4579 },
  { city: 'Bhuj', lat: 23.2420, lng: 69.6669 },
  { city: 'Vapi', lat: 20.3893, lng: 72.9106 },
  { city: 'Navsari', lat: 20.9467, lng: 72.9520 },
  { city: 'Morbi', lat: 22.8120, lng: 70.8236 },
  { city: 'Surendranagar', lat: 22.7274, lng: 71.6370 }
];

// ─── BRANCHES TAB (LIVE POSTGRESQL PERSISTENCE) ────────────────────────
export function OwnerBranches({ availableBranches = [], handleEnterBranchDashboard, onAddBranch, currentTenant }) {
  const compId = currentTenant?.id || 'comp_mann';

  const [branchesList, setBranchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'BRANCH_OFFICE',
    latitude: 23.0225,
    longitude: 72.5714,
    warehouses: '1'
  });

  // Fetch branches directly from PostgreSQL
  const loadBranchesFromDb = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/branches?companyId=${compId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setBranchesList(data.data);
      } else if (availableBranches && availableBranches.length > 0) {
        setBranchesList(availableBranches);
      } else {
        setBranchesList([
          { id: 1, code: 'AMD-01', name: 'Amd-Branch (Ahmedabad)', city: 'Ahmedabad', state: 'Gujarat', type: 'CENTRAL_HUB', latitude: 23.0225, longitude: 72.5714, status: 'Active' },
          { id: 2, code: 'BRD-02', name: 'Brd-Branch (Baroda)', city: 'Vadodara', state: 'Gujarat', type: 'BRANCH_OFFICE', latitude: 22.3072, longitude: 73.1812, status: 'Active' }
        ]);
      }
    } catch (err) {
      console.warn('Could not fetch branches from PostgreSQL:', err);
      if (availableBranches && availableBranches.length > 0) {
        setBranchesList(availableBranches);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranchesFromDb();
  }, [compId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // City preset clicked: auto-fills city + latitude + longitude
  const handleSelectCityPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      city: preset.city,
      latitude: preset.lat,
      longitude: preset.lng
    }));
  };

  // Get current device GPS location via browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
        setToastMessage(`Acquired device GPS coordinates: ${lat}, ${lng}`);
        setTimeout(() => setToastMessage(''), 3500);
      },
      (err) => {
        setLocating(false);
        alert(`Could not retrieve location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Save new branch one-by-one to PostgreSQL database
  const handleAddBranchSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    setSaving(true);
    try {
      const payload = {
        companyId: compId,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        city: formData.city.trim() || 'Gujarat City',
        state: formData.state || 'Gujarat',
        type: formData.type || 'BRANCH_OFFICE',
        latitude: parseFloat(formData.latitude) || 23.0225,
        longitude: parseFloat(formData.longitude) || 72.5714,
        status: 'Active'
      };

      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to save branch to PostgreSQL database.');
        setSaving(false);
        return;
      }

      const savedBranch = data.data || payload;
      setBranchesList(prev => [...prev.filter(b => b.code !== savedBranch.code), savedBranch]);
      if (onAddBranch) onAddBranch(savedBranch);

      setShowAddModal(false);
      setToastMessage(`Branch "${savedBranch.name}" (${savedBranch.code}) stored in PostgreSQL with coordinates [${savedBranch.latitude}, ${savedBranch.longitude}]!`);
      setTimeout(() => setToastMessage(''), 5000);

      // Reset form
      setFormData({
        name: '',
        code: '',
        city: 'Ahmedabad',
        state: 'Gujarat',
        type: 'BRANCH_OFFICE',
        latitude: 23.0225,
        longitude: 72.5714,
        warehouses: '1'
      });
    } catch (err) {
      console.error('Save branch error:', err);
      alert('Error connecting to backend API: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete branch from PostgreSQL
  const handleDeleteBranch = async (branch) => {
    if (!window.confirm(`Are you sure you want to delete branch "${branch.name}" (${branch.code}) from the database?`)) {
      return;
    }
    try {
      if (branch.id) {
        await fetch(`/api/branches/${branch.id}`, { method: 'DELETE' });
      }
      setBranchesList(prev => prev.filter(b => b.code !== branch.code));
      setToastMessage(`Branch "${branch.name}" removed from database.`);
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      console.error('Failed to delete branch:', err);
    }
  };

  const handleExport = () => {
    const headers = ['Branch Name', 'Code', 'City', 'Latitude', 'Longitude', 'Type', 'Status'];
    const rows = [headers, ...branchesList.map(b => [b.name, b.code, b.city, b.latitude, b.longitude, b.type, b.status])];
    downloadCSV('branches_directory.csv', rows);
    setToastMessage('Exported branches directory with GPS coordinates to CSV!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredBranches = branchesList.filter(b => 
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      {/* Database Sync Banner */}
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          marginBottom: '1rem',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Database size={17} color="#38bdf8" />
          <span>
            <strong style={{ color: '#38bdf8' }}>PostgreSQL Live Sync Active:</strong> Branches & GPS coordinates stored in <code style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>bizzpilot.branches</code> table.
          </span>
        </div>
        <button
          onClick={loadBranchesFromDb}
          style={{
            background: 'transparent',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            borderRadius: '6px',
            padding: '4px 10px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          <span>Refresh DB</span>
        </button>
      </div>

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Branch Master & GPS Coordinates</h2>
          <p className="page-desc">Add and manage company branches one-by-one with accurate GPS latitude/longitude for inter-branch replenishment.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="secondary-action-btn" onClick={handleExport}><Download size={14} /><span>Export CSV</span></button>
          <button className="primary-action-btn" onClick={() => setShowAddModal(true)}><Plus size={16} /><span>Add Branch One-by-One</span></button>
        </div>
      </div>

      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Total Branches in DB</span><div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Store size={18} /></div></div>
          <div className="stat-value">{branchesList.length}</div>
          <div className="stat-change positive"><TrendingUp size={13} /><span>All GPS tagged</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Coordinates Loaded</span><div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><Navigation size={18} /></div></div>
          <div className="stat-value">{branchesList.filter(b => b.latitude && b.longitude).length}</div>
          <div className="stat-change positive"><CheckCircle2 size={13} /><span>Haversine distance ready</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Active Company Workspace</span><div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><Building2 size={18} /></div></div>
          <div className="stat-value" style={{ fontSize: '1.15rem' }}>{currentTenant?.name || 'Mann Engineers'}</div>
          <div className="stat-change positive"><CheckCircle2 size={13} /><span>Strict tenant isolated</span></div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <h3 className="dash-panel-title">Registered Branches ({filteredBranches.length})</h3>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '220px' }}>
              <Search size={14} />
              <input
                placeholder="Search by name, code, city..."
                className="dash-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Branch Full Name</th>
                <th>Code</th>
                <th>City & State</th>
                <th>GPS Coordinates (Lat, Lng)</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((b, i) => (
                <tr key={b.id || b.code || i}>
                  <td className="td-bold">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Store size={15} color="var(--brand-accent)" />
                      <span>{b.name}</span>
                    </div>
                  </td>
                  <td><span className="mono-badge">{b.code}</span></td>
                  <td><span className="td-with-icon"><MapPin size={12} />{b.city}, {b.state || 'Gujarat'}</span></td>
                  <td>
                    {b.latitude && b.longitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mono-badge"
                        style={{
                          background: 'rgba(56, 189, 248, 0.12)',
                          color: '#38bdf8',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                        title="View on Google Maps"
                      >
                        <Navigation size={11} />
                        <span>{parseFloat(b.latitude).toFixed(4)}°, {parseFloat(b.longitude).toFixed(4)}°</span>
                      </a>
                    ) : (
                      <span className="td-sub">—</span>
                    )}
                  </td>
                  <td><span className="type-tag">{b.type?.replace(/_/g, ' ')}</span></td>
                  <td><span className="status-badge active">{b.status || 'Active'}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button className="table-action-btn" onClick={() => handleEnterBranchDashboard(b)} title="Open Branch Portal">
                        <Eye size={13} /><span>Open</span>
                      </button>
                      <button
                        className="table-action-btn"
                        onClick={() => handleDeleteBranch(b)}
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Delete branch from PostgreSQL"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Branch Modal (One-by-One Storage in PostgreSQL) */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Store size={20} color="var(--brand-accent)" />
                <div>
                  <h3 className="modal-title-text">Store Branch in Database (One-by-One)</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Stores directly in PostgreSQL <code style={{ color: '#38bdf8' }}>branches</code> table with GPS coordinates.
                  </p>
                </div>
              </div>
              <button className="modal-close-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddBranchSubmit}>
              <div className="modal-form-grid">
                <div className="modal-form-field full-width">
                  <label className="modal-field-label">Branch Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajkot Regional Hub & Store"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Branch Code *</label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. RJK-04"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Branch Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="modal-field-select"
                  >
                    <option value="BRANCH_OFFICE">Branch Office / Store</option>
                    <option value="CENTRAL_HUB">Central Regional Hub</option>
                    <option value="WAREHOUSE_DEPOT">Warehouse Storage Depot</option>
                    <option value="FRANCHISE_RETAIL">Franchise Retail Store</option>
                  </select>
                </div>

                <div className="modal-form-field full-width">
                  <label className="modal-field-label">City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajkot"
                    className="modal-field-input"
                    required
                  />
                </div>

                {/* City Presets Quick Selector */}
                <div className="modal-form-field full-width" style={{ marginTop: '-0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Quick-Select Gujarat City (Auto-fills Latitude & Longitude):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {GUJARAT_CITY_PRESETS.map((p) => (
                      <button
                        key={p.city}
                        type="button"
                        onClick={() => handleSelectCityPreset(p)}
                        style={{
                          background: formData.city === p.city ? 'var(--brand-accent)' : 'rgba(255,255,255,0.06)',
                          color: formData.city === p.city ? '#000' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '12px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          fontWeight: formData.city === p.city ? '700' : '400'
                        }}
                      >
                        {p.city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPS Coordinates */}
                <div className="modal-form-field">
                  <label className="modal-field-label">Latitude (GPS)</label>
                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 23.0225"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Longitude (GPS)</label>
                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 72.5714"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.4rem' }}>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: 600
                    }}
                  >
                    <Compass size={13} className={locating ? 'animate-spin' : ''} />
                    <span>{locating ? 'Detecting Location...' : '📍 Use Device Live GPS'}</span>
                  </button>
                </div>
              </div>

              <div className="modal-form-actions" style={{ marginTop: '1.25rem' }}>
                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={saving}>
                  {saving ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                  <span>{saving ? 'Saving to Database...' : 'Save Branch to PostgreSQL'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── CHART OF ACCOUNTS TAB ────────────────────────────────────────────
export function OwnerAccounts({ currentTenant, currentUser }) {
  const companyId = currentTenant?.id || 'comp_mann';
  const [accountGroups, setAccountGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLedgerModal, setShowAddLedgerModal] = useState(false);
  const [selectedLedgerDetail, setSelectedLedgerDetail] = useState(null);
  const [selectedLedgerVouchers, setSelectedLedgerVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newLedgerForm, setNewLedgerForm] = useState({
    name: '',
    group: 'Current Assets - Bank',
    nature: 'ASSET',
    balance: '',
    dr: true,
    notes: ''
  });

  const natureColors = { ASSET: '#38bdf8', LIABILITY: '#f59e0b', INCOME: '#10b981', EXPENSE: '#ef4444', EQUITY: '#a855f7' };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/finance/accounts?companyId=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setAccountGroups(data.accounts);
      }
    } catch (err) {
      console.error('Failed to load accounts from db:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [companyId]);

  const handleOpenLedgerDetail = async (ledger) => {
    setSelectedLedgerDetail(ledger);
    setLoadingVouchers(true);
    try {
      const res = await fetch(`/api/finance/accounts/${ledger.id}/vouchers?companyId=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.vouchers)) {
        setSelectedLedgerVouchers(data.vouchers);
      } else {
        setSelectedLedgerVouchers([]);
      }
    } catch (err) {
      console.error('Failed to load vouchers:', err);
      setSelectedLedgerVouchers([]);
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleAddLedgerSubmit = async (e) => {
    e.preventDefault();
    if (!newLedgerForm.name.trim()) return;

    const amt = parseFloat(newLedgerForm.balance.replace(/[^0-9.]/g, '')) || 0;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/finance/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          name: newLedgerForm.name.trim(),
          nature: newLedgerForm.nature,
          accountGroup: newLedgerForm.group,
          openingBalance: amt,
          balanceType: newLedgerForm.dr ? 'DR' : 'CR',
          notes: newLedgerForm.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddLedgerModal(false);
        setToastMessage(`Ledger account "${newLedgerForm.name}" created and synced with DB!`);
        setTimeout(() => setToastMessage(''), 4000);
        setNewLedgerForm({ name: '', group: 'Current Assets - Bank', nature: 'ASSET', balance: '', dr: true, notes: '' });
        await fetchAccounts();
      } else {
        setToastMessage(data.message || 'Failed to create ledger account');
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error creating ledger in db:', err);
      setToastMessage('Network error creating ledger');
      setTimeout(() => setToastMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLedger = async (ledgerId, ledgerName) => {
    if (!window.confirm(`Are you sure you want to delete ledger "${ledgerName}"?`)) return;
    try {
      const res = await fetch(`/api/finance/accounts/${ledgerId}?companyId=${encodeURIComponent(companyId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Ledger account "${ledgerName}" deleted from database.`);
        setTimeout(() => setToastMessage(''), 4000);
        await fetchAccounts();
      } else {
        setToastMessage(data.message || 'Cannot delete this ledger.');
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setToastMessage('Error deleting account');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleExportCOA = () => {
    const headers = ['Account Group / Ledger', 'Nature', 'Classification Group', 'Child Ledgers', 'Closing Balance', 'Balance Type', 'System Protected'];
    const rows = [headers, ...filteredGroups.map(g => [
      g.name,
      g.nature,
      g.account_group || 'General',
      g.child_ledgers_count || 1,
      `₹${Number(g.current_balance || g.opening_balance || 0).toLocaleString('en-IN')}`,
      g.balance_type || (g.dr ? 'DR' : 'CR'),
      g.is_system_locked ? 'YES (Protected)' : 'NO'
    ])];
    downloadCSV('chart_of_accounts.csv', rows);
    setToastMessage('Exported Chart of Accounts to CSV!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredGroups = accountGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.nature.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.account_group && g.account_group.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Chart of Accounts (COA)</h2>
          <p className="page-desc">Double-entry ledger structure with account groups, natures, and opening balances linked to PostgreSQL database.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={fetchAccounts} title="Sync with Database">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>
          <button className="secondary-action-btn" onClick={handleExportCOA}><Download size={14} /><span>Export</span></button>
          <button className="primary-action-btn" onClick={() => setShowAddLedgerModal(true)}><Plus size={16} /><span>Add Ledger</span></button>
        </div>
      </div>

      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {Object.entries(natureColors).map(([nature, color]) => (
          <div className="dash-stat-card" key={nature}>
            <div className="stat-card-header">
              <span className="stat-label">{nature}</span>
              <div className="stat-icon-circle" style={{ background: `${color}20`, color }}><Layers size={16} /></div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.3rem' }}>
              {accountGroups.filter(g => g.nature === nature).length}
            </div>
            <div className="stat-change positive"><span>Live DB Accounts</span></div>
          </div>
        ))}
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h3 className="dash-panel-title">Account Groups & Ledgers ({filteredGroups.length})</h3>
            <span className="mono-badge" style={{ background: '#38bdf820', color: '#38bdf8' }}>PostgreSQL Live</span>
          </div>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '220px' }}>
              <Search size={14} />
              <input
                placeholder="Search accounts or groups..."
                className="dash-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="data-table-wrap">
          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.5rem' }}><RefreshCw size={24} /></div>
              <p>Loading Chart of Accounts from PostgreSQL database...</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Account Group / Name</th>
                  <th>Classification</th>
                  <th>Nature</th>
                  <th>Ledgers</th>
                  <th>Balance</th>
                  <th>Type</th>
                  <th>System Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((g) => (
                    <tr key={g.id || g.name}>
                      <td className="td-bold">{g.name}</td>
                      <td><span className="type-tag">{g.account_group || 'General'}</span></td>
                      <td><span className="nature-tag" style={{ background: `${natureColors[g.nature]}20`, color: natureColors[g.nature], borderColor: `${natureColors[g.nature]}40` }}>{g.nature}</span></td>
                      <td>{g.child_ledgers_count || 1}</td>
                      <td className="td-money">₹{Number(g.current_balance || g.opening_balance || 0).toLocaleString('en-IN')}</td>
                      <td><span className="mono-badge">{g.balance_type || (g.dr ? 'DR' : 'CR')}</span></td>
                      <td>
                        {g.is_system_locked ? (
                          <span className="mono-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>🔒 Protected Root</span>
                        ) : (
                          <span className="mono-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>User Custom</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button className="table-action-btn" onClick={() => handleOpenLedgerDetail(g)}>
                            <Eye size={14} /><span>Vouchers</span>
                          </button>
                          {!g.is_system_locked && (
                            <button
                              onClick={() => handleDeleteLedger(g.id, g.name)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Ledger Modal */}
      {showAddLedgerModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddLedgerModal(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileSpreadsheet size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">Create Ledger Account in DB</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setShowAddLedgerModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddLedgerSubmit}>
              <div className="modal-form-grid">
                <div className="modal-form-field full-width">
                  <label className="modal-field-label">Ledger Name *</label>
                  <input
                    value={newLedgerForm.name}
                    onChange={(e) => setNewLedgerForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. HDFC Current A/c - Branch 01"
                    className="modal-field-input"
                    required
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">Classification Nature</label>
                  <select
                    value={newLedgerForm.nature}
                    onChange={(e) => setNewLedgerForm(prev => ({ ...prev, nature: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="ASSET">ASSET</option>
                    <option value="LIABILITY">LIABILITY</option>
                    <option value="INCOME">INCOME</option>
                    <option value="EXPENSE">EXPENSE</option>
                    <option value="EQUITY">EQUITY</option>
                  </select>
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">Account Group</label>
                  <input
                    value={newLedgerForm.group}
                    onChange={(e) => setNewLedgerForm(prev => ({ ...prev, group: e.target.value }))}
                    placeholder="e.g. Bank Accounts, Fixed Assets"
                    className="modal-field-input"
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">Opening Balance (₹)</label>
                  <input
                    value={newLedgerForm.balance}
                    onChange={(e) => setNewLedgerForm(prev => ({ ...prev, balance: e.target.value }))}
                    placeholder="e.g. 50000"
                    className="modal-field-input"
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">Balance Type</label>
                  <select
                    value={newLedgerForm.dr ? 'DR' : 'CR'}
                    onChange={(e) => setNewLedgerForm(prev => ({ ...prev, dr: e.target.value === 'DR' }))}
                    className="modal-field-select"
                  >
                    <option value="DR">Debit (DR)</option>
                    <option value="CR">Credit (CR)</option>
                  </select>
                </div>
              </div>
              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddLedgerModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={isSubmitting}>
                  <Plus size={16} /><span>{isSubmitting ? 'Saving to DB...' : 'Add Ledger to DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ledger Inspection & Vouchers Modal */}
      {selectedLedgerDetail && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedLedgerDetail(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">{selectedLedgerDetail.name}</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setSelectedLedgerDetail(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><strong>Nature:</strong> <span className="mono-badge">{selectedLedgerDetail.nature}</span></div>
                <div><strong>Balance:</strong> <span className="td-money">₹{Number(selectedLedgerDetail.current_balance || selectedLedgerDetail.opening_balance || 0).toLocaleString('en-IN')} {selectedLedgerDetail.balance_type || 'DR'}</span></div>
                <div><strong>Classification:</strong> {selectedLedgerDetail.account_group || 'General'}</div>
                <div><strong>Protection:</strong> {selectedLedgerDetail.is_system_locked ? 'Immutable Core' : 'Custom'}</div>
              </div>
            </div>
            <div className="data-table-wrap">
              {loadingVouchers ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.5rem' }}><RefreshCw size={20} /></div>
                  <p>Loading vouchers from PostgreSQL...</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Voucher Date</th>
                      <th>Voucher #</th>
                      <th>Type</th>
                      <th>Narration</th>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLedgerVouchers.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                          No recent journal or payment vouchers found for this account.
                        </td>
                      </tr>
                    ) : (
                      selectedLedgerVouchers.map((v, i) => (
                        <tr key={v.id || i}>
                          <td>{v.voucher_date}</td>
                          <td><span className="mono-badge">{v.voucher_no}</span></td>
                          <td><span className="type-tag">{v.voucher_type}</span></td>
                          <td>{v.narration}</td>
                          <td className="td-money">{v.debit_amount > 0 ? `₹${Number(v.debit_amount).toLocaleString('en-IN')} DR` : '—'}</td>
                          <td className="td-money">{v.credit_amount > 0 ? `₹${Number(v.credit_amount).toLocaleString('en-IN')} CR` : '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-form-actions">
              <button className="primary-action-btn" onClick={() => setSelectedLedgerDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── FINANCIAL PERIODS TAB ────────────────────────────────────────────
export function OwnerFinance({ currentTenant, currentUser }) {
  const companyId = currentTenant?.id || 'comp_mann';
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [periodForm, setPeriodForm] = useState({
    month: '',
    fiscal_year: '2025–2026',
    start_date: '',
    end_date: ''
  });

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/finance/periods?companyId=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.periods)) {
        setPeriods(data.periods);
      }
    } catch (err) {
      console.error('Failed to load financial periods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, [companyId]);

  const handleLockPeriod = async (id, monthName) => {
    try {
      const res = await fetch('/api/finance/periods/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          lockedBy: currentUser?.name || 'Tenant Owner'
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Period "${monthName}" has been permanently locked in DB! Backdated entries blocked.`);
        fetchPeriods();
      } else {
        alert(data.message || 'Failed to lock period.');
      }
    } catch (err) {
      console.error('Lock period error:', err);
      alert('Error connecting to database to lock period.');
    }
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleUnlockPeriod = async (id, monthName) => {
    if (!window.confirm(`Are you sure you want to re-open period "${monthName}"? This permits voucher modifications.`)) return;
    try {
      const res = await fetch('/api/finance/periods/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          unlockedBy: currentUser?.name || 'Tenant Owner'
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Period "${monthName}" re-opened for transactions.`);
        fetchPeriods();
      } else {
        alert(data.message || 'Failed to unlock period.');
      }
    } catch (err) {
      console.error('Unlock period error:', err);
      alert('Error connecting to database to unlock period.');
    }
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCreatePeriod = async (e) => {
    e.preventDefault();
    if (!periodForm.month.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/finance/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          month: periodForm.month.trim(),
          fiscal_year: periodForm.fiscal_year,
          start_date: periodForm.start_date || null,
          end_date: periodForm.end_date || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Financial period "${periodForm.month}" created in PostgreSQL!`);
        setShowAddPeriodModal(false);
        setPeriodForm({ month: '', fiscal_year: '2025–2026', start_date: '', end_date: '' });
        fetchPeriods();
      } else {
        alert(data.message || 'Could not create period.');
      }
    } catch (err) {
      console.error('Create period error:', err);
      alert('Failed to connect to database.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const filteredPeriods = periods.filter(p =>
    (p.month || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.locked_by || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.fiscal_year || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportPeriods = () => {
    const headers = ['Financial Period', 'Fiscal Year', 'Status', 'Vouchers Count', 'Locked By', 'Locked At', 'Cryptographic Lock Hash'];
    const rows = [headers, ...filteredPeriods.map(p => [
      p.month,
      p.fiscal_year || '2025–2026',
      p.status,
      p.vouchers_count || 0,
      p.locked_by || '—',
      p.locked_at ? new Date(p.locked_at).toLocaleDateString('en-GB') : '—',
      p.lock_hash || 'UNLOCKED'
    ])];
    downloadCSV('financial_periods_lock_audit.csv', rows);
    setToastMessage('Exported financial periods audit to CSV!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const lockedCount = periods.filter(p => p.status === 'Locked').length;
  const openCount = periods.filter(p => p.status === 'Open').length;
  const totalVouchers = periods.reduce((sum, p) => sum + Number(p.vouchers_count || 0), 0);
  const activeFY = periods.length > 0 ? (periods[0].fiscal_year || '2025–2026') : '2025–2026';

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Financial Periods & Year Lock</h2>
          <p className="page-desc">Manage fiscal year periods. Locked periods block backdated entries, reversals, and modifications. Period closing is irreversible.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={handleExportPeriods}><Download size={14} /><span>Export Audit Log</span></button>
          <button className="primary-action-btn" onClick={() => setShowAddPeriodModal(true)}><Plus size={16} /><span>Create Fiscal Period</span></button>
        </div>
      </div>

      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Financial Year</span><div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Calendar size={18} /></div></div>
          <div className="stat-value" style={{ fontSize: '1.3rem' }}>{activeFY}</div>
          <div className="stat-change positive"><span>Apr 2025 – Mar 2026</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Locked Periods</span><div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><Lock size={18} /></div></div>
          <div className="stat-value">{lockedCount}</div>
          <div className="stat-change positive"><span>Permanently secured</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Open Periods</span><div className="stat-icon-circle" style={{ background: '#f59e0b20', color: '#f59e0b' }}><Calendar size={18} /></div></div>
          <div className="stat-value">{openCount}</div>
          <div className="stat-change neutral"><AlertTriangle size={13} /><span>Open for transactions</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Audited Vouchers</span><div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><FileSpreadsheet size={18} /></div></div>
          <div className="stat-value">{totalVouchers}</div>
          <div className="stat-change positive"><span>Across all periods</span></div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <h3 className="dash-panel-title">Period Lock Status ({filteredPeriods.length})</h3>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '220px' }}>
              <Search size={14} />
              <input
                placeholder="Search periods..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="dash-icon-btn" title="Refresh from PostgreSQL" onClick={fetchPeriods}>
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {loading && periods.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.75rem' }}><RefreshCw size={24} /></div>
            <p>Loading periods from PostgreSQL database...</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Fiscal Year</th>
                  <th>Status</th>
                  <th>Vouchers</th>
                  <th>Locked By</th>
                  <th>Locked At</th>
                  <th>Lock Cryptographic Hash</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeriods.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No periods found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPeriods.map((p) => (
                    <tr key={p.id}>
                      <td className="td-bold">{p.month}</td>
                      <td><span className="mono-badge">{p.fiscal_year || '2025–2026'}</span></td>
                      <td>
                        <span className={`status-badge ${p.status === 'Locked' ? 'locked' : 'active'}`}>
                          {p.status === 'Locked' ? '🔒 Locked' : '🟢 Open'}
                        </span>
                      </td>
                      <td>{p.vouchers_count || 0}</td>
                      <td>{p.locked_by || '—'}</td>
                      <td>{p.locked_at ? new Date(p.locked_at).toLocaleDateString('en-GB') : '—'}</td>
                      <td>
                        {p.lock_hash ? (
                          <span className="mono" style={{ fontSize: '0.72rem', color: '#10b981' }} title={p.lock_hash}>
                            {p.lock_hash.substring(0, 16)}...
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unsealed</span>
                        )}
                      </td>
                      <td>
                        {p.status === 'Open' ? (
                          <button className="table-action-btn danger" onClick={() => handleLockPeriod(p.id, p.month)}>
                            <Lock size={14} /><span>Lock Period</span>
                          </button>
                        ) : (
                          <button className="table-action-btn neutral" onClick={() => handleUnlockPeriod(p.id, p.month)} title="Emergency re-open">
                            <Unlock size={14} /><span>Re-Open</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Period Modal */}
      {showAddPeriodModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddPeriodModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title-text">Create Fiscal Accounting Period</h3>
              <button className="modal-close-icon" onClick={() => setShowAddPeriodModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreatePeriod}>
              <div className="modal-form-group">
                <label className="modal-label">Period Name (Month & Year)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. December 2025"
                  className="modal-input"
                  value={periodForm.month}
                  onChange={(e) => setPeriodForm({ ...periodForm, month: e.target.value })}
                />
              </div>
              <div className="modal-form-group">
                <label className="modal-label">Fiscal Year</label>
                <input
                  type="text"
                  required
                  placeholder="2025–2026"
                  className="modal-input"
                  value={periodForm.fiscal_year}
                  onChange={(e) => setPeriodForm({ ...periodForm, fiscal_year: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="modal-form-group">
                  <label className="modal-label">Start Date</label>
                  <input
                    type="date"
                    className="modal-input"
                    value={periodForm.start_date}
                    onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label">End Date</label>
                  <input
                    type="date"
                    className="modal-input"
                    value={periodForm.end_date}
                    onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddPeriodModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={isSubmitting}>
                  <Plus size={16} /><span>{isSubmitting ? 'Creating in DB...' : 'Create Period'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── COMPANIES & GST TAB ──────────────────────────────────────────────
export function OwnerCompanies() {
  const [companies, setCompanies] = useState([
    {
      id: 'comp-1',
      legalName: 'Mann Safety Equipment Pvt Ltd',
      tradeName: 'Mann Engineers & Automation',
      gstin: '24AABCM8921K1ZK',
      pan: 'AABCM8921K',
      state: '24 — Gujarat',
      fy: '2025–2026',
      currency: 'INR (₹)',
      branchesCount: 3,
      status: 'Active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [form, setForm] = useState({
    legalName: '',
    tradeName: '',
    gstin: '',
    pan: '',
    state: '27 — Maharashtra'
  });

  const handleAddCompanySubmit = (e) => {
    e.preventDefault();
    if (!form.legalName.trim() || !form.gstin.trim()) return;

    const newComp = {
      id: `comp-${Date.now()}`,
      legalName: form.legalName.trim(),
      tradeName: form.tradeName.trim() || form.legalName.trim(),
      gstin: form.gstin.trim().toUpperCase(),
      pan: form.pan.trim().toUpperCase() || form.gstin.substring(2, 12).toUpperCase(),
      state: form.state,
      fy: '2025–2026',
      currency: 'INR (₹)',
      branchesCount: 0,
      status: 'Active'
    };

    setCompanies(prev => [...prev, newComp]);
    setShowAddModal(false);
    setToastMessage(`Company "${newComp.legalName}" registered with GSTIN ${newComp.gstin}!`);
    setTimeout(() => setToastMessage(''), 4000);
    setForm({ legalName: '', tradeName: '', gstin: '', pan: '', state: '27 — Maharashtra' });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredCompanies = companies.filter(c =>
    c.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Companies & GST Registration</h2>
          <p className="page-desc">Manage legal entities (GSTIN, PAN), state codes, and company-level settings. Each company can have multiple branches.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="dash-search-box" style={{ minWidth: '220px' }}>
            <Search size={14} />
            <input
              placeholder="Search companies by name, GSTIN..."
              className="dash-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="primary-action-btn" onClick={() => setShowAddModal(true)}><Plus size={16} /><span>Add Company</span></button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredCompanies.map((c) => (
          <div className="dash-panel animate-fade-in" key={c.id}>
            <div className="company-detail-card">
              <div className="company-card-header">
                <div className="company-icon"><Building2 size={24} /></div>
                <div>
                  <h3 className="company-name">{c.legalName}</h3>
                  <p className="company-sub">{c.tradeName} • Legal entity</p>
                </div>
                <span className="status-badge active">{c.status}</span>
              </div>
              <div className="company-info-grid">
                <div className="company-info-item"><span className="info-label">GSTIN</span><span className="info-value mono">{c.gstin}</span></div>
                <div className="company-info-item"><span className="info-label">PAN</span><span className="info-value mono">{c.pan}</span></div>
                <div className="company-info-item"><span className="info-label">State Code</span><span className="info-value">{c.state}</span></div>
                <div className="company-info-item"><span className="info-label">Financial Year</span><span className="info-value">{c.fy}</span></div>
                <div className="company-info-item"><span className="info-label">Currency</span><span className="info-value">{c.currency}</span></div>
                <div className="company-info-item"><span className="info-label">Branches</span><span className="info-value">{c.branchesCount} Configured</span></div>
                <div className="company-info-item"><span className="info-label">GST Type</span><span className="info-value">Regular (Monthly)</span></div>
                <div className="company-info-item"><span className="info-label">E-Invoice</span><span className="info-value">Enabled (IRN/QR)</span></div>
              </div>
              <div className="company-gst-summary">
                <h4>GST & Statutory Features</h4>
                <div className="gst-badges-row">
                  <span className="gst-badge">CGST + SGST (Intra-state)</span>
                  <span className="gst-badge">IGST (Inter-state)</span>
                  <span className="gst-badge">HSN 4-digit mandatory</span>
                  <span className="gst-badge">Reverse Charge: Off</span>
                  <span className="gst-badge">E-Way Bill: Auto (₹50k threshold)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">Add Legal Entity / Company</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCompanySubmit}>
              <div className="modal-form-grid">
                <div className="modal-form-field full-width">
                  <label className="modal-field-label">Legal Company Name *</label>
                  <input
                    value={form.legalName}
                    onChange={(e) => setForm(prev => ({ ...prev, legalName: e.target.value }))}
                    placeholder="e.g. Mann Safety Solutions Maharashtra Pvt Ltd"
                    className="modal-field-input"
                    required
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">Trade / Brand Name</label>
                  <input
                    value={form.tradeName}
                    onChange={(e) => setForm(prev => ({ ...prev, tradeName: e.target.value }))}
                    placeholder="e.g. Mann Safety Mumbai"
                    className="modal-field-input"
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">GSTIN (15 characters) *</label>
                  <input
                    value={form.gstin}
                    onChange={(e) => setForm(prev => ({ ...prev, gstin: e.target.value }))}
                    placeholder="e.g. 27AABCM8921K1ZP"
                    className="modal-field-input"
                    maxLength={15}
                    required
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">PAN (10 characters)</label>
                  <input
                    value={form.pan}
                    onChange={(e) => setForm(prev => ({ ...prev, pan: e.target.value }))}
                    placeholder="e.g. AABCM8921K"
                    className="modal-field-input"
                    maxLength={10}
                  />
                </div>
                <div className="modal-form-field">
                  <label className="modal-field-label">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="24 — Gujarat">24 — Gujarat</option>
                    <option value="27 — Maharashtra">27 — Maharashtra</option>
                    <option value="07 — Delhi">07 — Delhi</option>
                    <option value="29 — Karnataka">29 — Karnataka</option>
                  </select>
                </div>
              </div>
              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn"><Plus size={16} /><span>Save Company</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── USER MANAGEMENT TAB ──────────────────────────────────────────────
// ─── USER & EMPLOYEE MANAGEMENT TAB (ALL-IN-ONE CONSOLIDATED VIEW) ───
export function OwnerUsers() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [resettingEmp, setResettingEmp] = useState(null);
  const [deletingEmp, setDeletingEmp] = useState(null);
  const [showSalaries, setShowSalaries] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'STAFF',
    branchCode: 'AMD-01',
    branchName: 'Amd-Branch (Ahmedabad)',
    designation: 'Sales & POS Officer',
    department: 'Sales & Billing',
    salary: '35000'
  });

  const [newPasswordVal, setNewPasswordVal] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/employees');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEmployees(json.data);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const roleColors = {
    TENANT_OWNER: '#a855f7',
    BRANCH_MANAGER: '#38bdf8',
    STAFF: '#10b981',
    ACCOUNTANT: '#f59e0b',
    CASHIER: '#06b6d4'
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showToast('Name and Email are required.');
      return;
    }

    try {
      const bName = form.branchCode === 'BRD-02' ? 'Brd-Branch (Baroda)' : (form.branchCode === '*' ? 'All Branches (Master HQ)' : 'Amd-Branch (Ahmedabad)');
      const payload = {
        ...form,
        branchName: bName,
        salary: parseFloat(form.salary) || 0
      };
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Employee "${json.data?.name || form.name}" registered into PostgreSQL!`);
        setShowAddModal(false);
        setForm({
          name: '',
          username: '',
          email: '',
          password: '',
          phone: '',
          role: 'STAFF',
          branchCode: 'AMD-01',
          branchName: 'Amd-Branch (Ahmedabad)',
          designation: 'Sales & POS Officer',
          department: 'Sales & Billing',
          salary: '35000'
        });
        fetchEmployees();
      } else {
        showToast(`Failed to add employee: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error adding employee: ${err.message}`);
    }
  };

  const handleToggleStatus = async (emp) => {
    try {
      if (emp.isLocked) {
        return handleUnlockEmployee(emp);
      }
      const nextActive = !emp.isActive;
      const res = await fetch(`/api/employees/${emp.id || emp.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActive, status: nextActive ? 'Active' : 'Suspended' })
      });
      const json = await res.json();
      if (json.success) {
        setEmployees(prev => prev.map(e => (e.id === emp.id ? { ...e, isActive: nextActive, status: nextActive ? 'Active' : 'Suspended' } : e)));
        showToast(`Employee "${emp.name}" is now ${nextActive ? 'Active' : 'Suspended'}!`);
      }
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`);
    }
  };

  const handleUnlockEmployee = async (emp) => {
    try {
      const res = await fetch(`/api/employees/${emp.id || emp.userId}/unlock`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Staff member "${emp.name}" unlocked! Failed attempts reset to 0.`);
        fetchEmployees();
      } else {
        showToast(`Unlock failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error unlocking account: ${err.message}`);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordVal || newPasswordVal.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch(`/api/employees/${resettingEmp.id || resettingEmp.userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordVal })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Password for "${resettingEmp.name}" reset successfully in database!`);
        setResettingEmp(null);
        setNewPasswordVal('');
      } else {
        showToast(`Reset failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error resetting password: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmp) return;

    try {
      const res = await fetch(`/api/employees/${editingEmp.id || editingEmp.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEmp)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Employee details for "${editingEmp.name}" updated!`);
        setEditingEmp(null);
        fetchEmployees();
      } else {
        showToast(`Update failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error updating employee: ${err.message}`);
    }
  };

  const handleDeleteEmployee = async (emp) => {
    try {
      const res = await fetch(`/api/employees/${emp.id || emp.userId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Employee "${emp.name}" removed from database.`);
        setDeletingEmp(null);
        fetchEmployees();
      } else {
        showToast(`Delete failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error deleting employee: ${err.message}`);
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchSearch =
      (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.phone || '').includes(searchQuery) ||
      (emp.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.branchCode || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchBranch = branchFilter === 'ALL' || emp.branchCode === branchFilter;
    const matchRole = roleFilter === 'ALL' || emp.role === roleFilter;
    const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;

    return matchSearch && matchBranch && matchRole && matchDept;
  });

  const totalMonthlyPayroll = employees.reduce((acc, curr) => acc + (parseFloat(curr.salary) || 0), 0);
  const activeStaffCount = employees.filter(e => e.isActive).length;
  const branchManagerCount = employees.filter(e => e.role === 'BRANCH_MANAGER').length;

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div className="page-header-row animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="page-title">Enterprise Employee & User Directory</h2>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              🐘 PostgreSQL Live: bizzpilot.users
            </span>
          </div>
          <p className="page-desc">
            Consolidated single-page view of all staff, branch managers, and owners across Ahmedabad, Baroda & HQ. Manage roles, salaries, status, and direct password resets.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={() => setShowSalaries(!showSalaries)}>
            <Eye size={15} />
            <span>{showSalaries ? 'Hide Payroll / CTC' : 'Show Payroll / CTC'}</span>
          </button>
          <button className="primary-action-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Consolidated Metric Cards */}
      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.25rem' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Franchise Staff</span>
            <div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Users size={18} /></div>
          </div>
          <div className="stat-value">{employees.length}</div>
          <div className="stat-change positive">Across 2 branches + HQ</div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Active on Duty</span>
            <div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-value">{activeStaffCount}</div>
          <div className="stat-change positive">{Math.round((activeStaffCount / (employees.length || 1)) * 100)}% attendance rate</div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Branch Managers</span>
            <div className="stat-icon-circle" style={{ background: '#f59e0b20', color: '#f59e0b' }}><Store size={18} /></div>
          </div>
          <div className="stat-value">{branchManagerCount}</div>
          <div className="stat-change neutral">AMD-01 & BRD-02 Leads</div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Monthly Payroll Outlay</span>
            <div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">
            {showSalaries ? `₹${(totalMonthlyPayroll / 100000).toFixed(2)}L` : '••••••'}
          </div>
          <div className="stat-change neutral">Direct Bank Transfer</div>
        </div>
      </div>

      {/* Main Consolidated Panel */}
      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <h3 className="dash-panel-title">All Employees on One Page ({filteredEmployees.length})</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time consolidated database view</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Branch Filter Pills */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="modal-field-select"
              style={{ width: 'auto', minWidth: '160px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            >
              <option value="ALL">🏢 All Branches (Consolidated)</option>
              <option value="AMD-01">📍 AMD-01 (Ahmedabad)</option>
              <option value="BRD-02">📍 BRD-02 (Baroda)</option>
              <option value="*">👑 Master HQ Only</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="modal-field-select"
              style={{ width: 'auto', minWidth: '130px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            >
              <option value="ALL">All Roles</option>
              <option value="TENANT_OWNER">Tenant Owner</option>
              <option value="BRANCH_MANAGER">Branch Manager</option>
              <option value="STAFF">Operations Staff</option>
            </select>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="modal-field-select"
              style={{ width: 'auto', minWidth: '140px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            >
              <option value="ALL">All Departments</option>
              <option value="Executive Board">Executive Board</option>
              <option value="Branch Operations">Branch Operations</option>
              <option value="Sales & Billing">Sales & Billing</option>
              <option value="Warehouse & Stores">Warehouse & Stores</option>
              <option value="Technical Services">Technical Services</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
            </select>

            {/* Search Input */}
            <div className="dash-search-box" style={{ minWidth: '220px' }}>
              <Search size={14} />
              <input
                placeholder="Search by name, phone, email, branch..."
                className="dash-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="secondary-action-btn" onClick={fetchEmployees} title="Refresh Table">
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            </button>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee / User</th>
                <th>Branch Location</th>
                <th>Role</th>
                <th>Designation & Dept</th>
                <th>Contact</th>
                <th>Monthly Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No employees found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const roleColor = roleColors[emp.role] || '#38bdf8';
                  const initials = (emp.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

                  return (
                    <tr key={emp.id || emp.userId}>
                      <td>
                        <div className="user-cell">
                          <div
                            className="user-cell-avatar"
                            style={{
                              background: `${roleColor}25`,
                              color: roleColor,
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              border: `1px solid ${roleColor}40`
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="td-bold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{emp.name}</span>
                              {emp.role === 'TENANT_OWNER' && <span style={{ fontSize: '0.65rem', background: '#a855f725', color: '#a855f7', padding: '1px 5px', borderRadius: '4px' }}>Owner</span>}
                            </div>
                            <div className="td-sub" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              @{emp.username} • ID: {emp.userId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            className="mono-badge"
                            style={{
                              background: emp.branchCode === 'AMD-01' ? 'rgba(56, 189, 248, 0.12)' : (emp.branchCode === 'BRD-02' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(168, 85, 247, 0.12)'),
                              color: emp.branchCode === 'AMD-01' ? '#38bdf8' : (emp.branchCode === 'BRD-02' ? '#10b981' : '#a855f7'),
                              fontWeight: 700
                            }}
                          >
                            {emp.branchCode === '*' ? 'GLOBAL HQ' : emp.branchCode}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {emp.branchName || (emp.branchCode === 'BRD-02' ? 'Baroda' : 'Ahmedabad')}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className="nature-tag"
                          style={{
                            background: `${roleColor}15`,
                            color: roleColor,
                            borderColor: `${roleColor}40`,
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}
                        >
                          {emp.role.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{emp.designation}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{emp.department}</div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.78rem' }}>
                          <div style={{ color: 'var(--text-secondary)' }}>{emp.phone || '+91 9825X XXXXX'}</div>
                          <div style={{ color: 'var(--brand-accent)', fontSize: '0.72rem' }}>{emp.email}</div>
                        </div>
                      </td>

                      <td className="td-money">
                        {showSalaries ? (
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            ₹{(parseFloat(emp.salary) || 0).toLocaleString('en-IN')}<span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}> /mo</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>••••••</span>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(emp)}
                          className={`status-badge ${emp.isLocked ? 'warning' : (emp.isActive ? 'active' : 'warning')}`}
                          style={{
                            cursor: 'pointer',
                            border: emp.isLocked ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                            background: emp.isLocked ? 'rgba(239, 68, 68, 0.15)' : undefined,
                            color: emp.isLocked ? '#ef4444' : undefined,
                            fontWeight: 700
                          }}
                          title={emp.isLocked ? "Account Locked: Click to Unlock in DB" : "Click to toggle status"}
                        >
                          {emp.isLocked ? '🔒 Locked (3/3)' : (emp.isActive ? 'Active' : 'Suspended')}
                        </button>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {(emp.isLocked || emp.failedAttempts > 0) && (
                            <button
                              type="button"
                              className="table-action-btn"
                              style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.35)', fontWeight: 700 }}
                              onClick={() => handleUnlockEmployee(emp)}
                              title="Unlock Account & Reset Attempts"
                            >
                              <Unlock size={13} />
                              <span>Unlock</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="table-action-btn"
                            onClick={() => {
                              setEditingEmp({ ...emp });
                            }}
                            title="Edit Employee Details"
                          >
                            <Settings size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="table-action-btn"
                            style={{ color: '#38bdf8' }}
                            onClick={() => {
                              setResettingEmp(emp);
                              setNewPasswordVal('');
                            }}
                            title="Reset Password directly in Database"
                          >
                            <Key size={13} />
                            <span>Password</span>
                          </button>

                          {emp.role !== 'TENANT_OWNER' && (
                            <button
                              type="button"
                              className="table-action-btn"
                              style={{ color: '#ef4444' }}
                              onClick={() => setDeletingEmp(emp)}
                              title="Delete Employee"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================
          MODAL: ADD NEW EMPLOYEE
          ======================================================================== */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Users size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">Register New Franchise Employee</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="modal-form-field">
                  <label className="modal-field-label">Full Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Username *</label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="e.g. rahul_sales"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Work Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. rahul@mannengineers.in"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Default Password *</label>
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="e.g. Pass@123"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Contact Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98250 12345"
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Assigned Branch *</label>
                  <select
                    value={form.branchCode}
                    onChange={(e) => setForm(prev => ({ ...prev, branchCode: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="AMD-01">Ahmedabad Central Hub (AMD-01)</option>
                    <option value="BRD-02">Baroda Regional Depot (BRD-02)</option>
                    <option value="*">Global Master HQ (*)</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Role Classification</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="STAFF">Operations Staff</option>
                    <option value="BRANCH_MANAGER">Branch Manager</option>
                    <option value="TENANT_OWNER">Tenant Owner / Executive</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="Sales & Billing">Sales & Billing</option>
                    <option value="Warehouse & Stores">Warehouse & Stores</option>
                    <option value="Technical Services">Technical Services</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Branch Operations">Branch Operations</option>
                    <option value="Executive Board">Executive Board</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Designation Title</label>
                  <input
                    value={form.designation}
                    onChange={(e) => setForm(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="e.g. Senior POS Cashier"
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Monthly Salary (INR)</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={(e) => setForm(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="35000"
                    className="modal-field-input"
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn"><Plus size={16} /><span>Register Employee</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: RESET EMPLOYEE PASSWORD
          ======================================================================== */}
      {resettingEmp && (
        <div className="modal-backdrop-overlay" onClick={() => setResettingEmp(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Key size={20} color="#38bdf8" />
                <h3 className="modal-title-text">Reset Password</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setResettingEmp(null)}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Set a new secure password for <strong>{resettingEmp.name}</strong> ({resettingEmp.email}). This will directly update their PostgreSQL account hash.
            </p>

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="modal-form-field full-width" style={{ marginBottom: '1rem' }}>
                <label className="modal-field-label">New Password *</label>
                <input
                  type="text"
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Min. 6 characters (e.g. SafePass@2026)"
                  className="modal-field-input"
                  required
                />
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setResettingEmp(null)}>Cancel</button>
                <button type="submit" className="primary-action-btn" style={{ background: '#38bdf8' }}>
                  <Check size={16} />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: EDIT EMPLOYEE DETAILS
          ======================================================================== */}
      {editingEmp && (
        <div className="modal-backdrop-overlay" onClick={() => setEditingEmp(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Settings size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">Edit Employee Information</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setEditingEmp(null)}><X size={18} /></button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="modal-form-field">
                  <label className="modal-field-label">Full Name</label>
                  <input
                    value={editingEmp.name || ''}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, name: e.target.value }))}
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Email</label>
                  <input
                    type="email"
                    value={editingEmp.email || ''}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, email: e.target.value }))}
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Phone</label>
                  <input
                    value={editingEmp.phone || ''}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, phone: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Branch Assignment</label>
                  <select
                    value={editingEmp.branchCode || 'AMD-01'}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, branchCode: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="AMD-01">AMD-01 (Ahmedabad)</option>
                    <option value="BRD-02">BRD-02 (Baroda)</option>
                    <option value="*">All Branches (*)</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Designation</label>
                  <input
                    value={editingEmp.designation || ''}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, designation: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Department</label>
                  <input
                    value={editingEmp.department || ''}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, department: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Monthly Salary (INR)</label>
                  <input
                    type="number"
                    value={editingEmp.salary || 0}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, salary: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Account Status</label>
                  <select
                    value={editingEmp.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditingEmp(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="modal-field-select"
                  >
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditingEmp(null)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: CONFIRM DELETE
          ======================================================================== */}
      {deletingEmp && (
        <div className="modal-backdrop-overlay" onClick={() => setDeletingEmp(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '420px', textAlign: 'center', padding: '28px 24px' }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Confirm Employee Deletion
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
              Are you sure you want to permanently delete <strong>{deletingEmp.name}</strong> ({deletingEmp.userId}) from the PostgreSQL users table?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="secondary-action-btn" onClick={() => setDeletingEmp(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEmployee(deletingEmp)}
                style={{
                  flex: 1,
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '10px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── REPORTS & ANALYTICS TAB ──────────────────────────────────────────
export function OwnerReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const reportSections = [
    { title: 'Financial Reports', reports: [
      { id: 'tb', name: 'Trial Balance', desc: 'All ledgers with opening, period Dr/Cr, and closing balance', icon: FileSpreadsheet, color: '#38bdf8' },
      { id: 'pl', name: 'Profit & Loss', desc: 'Trading + P&L: Sales, COGS, Gross Profit, Net Profit', icon: TrendingUp, color: '#10b981' },
      { id: 'bs', name: 'Balance Sheet', desc: 'Liabilities vs Assets with equity carry-forward', icon: PieChart, color: '#a855f7' },
      { id: 'cf', name: 'Cash Flow Statement', desc: 'Indirect method: Operating, Investing, Financing', icon: Activity, color: '#f59e0b' },
      { id: 'db', name: 'Day Book', desc: 'All vouchers posted on a date range with Dr/Cr totals', icon: BookOpen, color: '#ec4899' },
      { id: 'cb', name: 'Cash Book / Bank Book', desc: 'Opening, receipts, payments, running balance by ledger', icon: Wallet, color: '#06b6d4' },
    ]},
    { title: 'Inventory Reports', reports: [
      { id: 'ss', name: 'Stock Summary', desc: 'By warehouse, branch, category with valuation', icon: Boxes, color: '#38bdf8' },
      { id: 'sl', name: 'Stock Ledger', desc: 'Movement history per product — all in/out', icon: BookOpen, color: '#10b981' },
      { id: 'sv', name: 'Stock Valuation', desc: 'Weighted average cost or FIFO layer valuation', icon: DollarSign, color: '#a855f7' },
      { id: 'ls', name: 'Low Stock / Reorder', desc: 'Items below reorder point with suggested PO qty', icon: AlertTriangle, color: '#ef4444' },
    ]},
    { title: 'GST & Statutory', reports: [
      { id: 'gstr1', name: 'GSTR-1 Data', desc: 'B2B, B2C, credit/debit notes, HSN summary, doc summary', icon: FileSpreadsheet, color: '#38bdf8' },
      { id: 'gstr3b', name: 'GSTR-3B Summary', desc: 'Outward supplies, ITC available, tax payable', icon: Receipt, color: '#10b981' },
      { id: 'hsn', name: 'HSN Summary', desc: 'Quantity and value grouped by HSN code', icon: Hash, color: '#a855f7' },
      { id: 'itc', name: 'ITC Register', desc: 'Eligible, ineligible, reversed input tax credit', icon: CreditCard, color: '#f59e0b' },
    ]},
    { title: 'Receivables & Payables', reports: [
      { id: 'recv', name: 'Receivables Ageing', desc: 'Customer outstanding: 0-30, 31-60, 61-90, 90+ days', icon: ArrowDownRight, color: '#38bdf8' },
      { id: 'pay', name: 'Payables Ageing', desc: 'Supplier outstanding with ageing buckets', icon: ArrowUpRight, color: '#ef4444' },
      { id: 'sr', name: 'Sales Register', desc: 'All sales invoices with tax breakup', icon: Receipt, color: '#10b981' },
      { id: 'pr', name: 'Purchase Register', desc: 'All purchase invoices with landed cost', icon: ShoppingCart, color: '#a855f7' },
    ]},
  ];

  const filteredSections = reportSections.map(section => ({
    ...section,
    reports: section.reports.filter(r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.reports.length > 0);

  const handleDownloadReport = (rep) => {
    const headers = ['Account / Metric', 'Category', 'Debit / Inward', 'Credit / Outward', 'Net Balance'];
    const sampleRows = [
      headers,
      ['Sales Revenue - Extinguishers', 'Operating Income', '₹0', '₹4,25,000', '₹4,25,000 CR'],
      ['Cost of Goods Sold (COGS)', 'Direct Cost', '₹2,58,000', '₹0', '₹2,58,000 DR'],
      ['Gross Profit Margin', 'Operating Metric', '—', '—', '39.29%'],
      ['GST Output Collected', 'Statutory Liability', '₹0', '₹76,500', '₹76,500 CR'],
      ['ITC Credit Claimed', 'Statutory Asset', '₹46,440', '₹0', '₹46,440 DR'],
    ];
    downloadCSV(`${rep.id}_${Date.now()}.csv`, sampleRows);
    setToastMessage(`Downloaded ${rep.name} report as CSV!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Reports & Analytics</h2>
          <p className="page-desc">Tenant-scoped, company-scoped financial, inventory, and statutory reports. All export to PDF & XLSX.</p>
        </div>
        <div className="header-actions">
          <div className="table-search-box" style={{ minWidth: '260px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Live search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Interactive Visual Graphs */}
      <OwnerReportsChartSection />

      {filteredSections.length === 0 ? (
        <div className="dash-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No reports found matching "{searchQuery}".
        </div>
      ) : filteredSections.map((section, si) => (
        <div className="dash-panel animate-fade-in" key={si} style={{ marginBottom: '1rem' }}>
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">{section.title}</h3>
            <span className="dash-panel-badge">{section.reports.length} Reports</span>
          </div>
          <div className="reports-grid">
            {section.reports.map((r, ri) => (
              <button
                className="report-card"
                key={ri}
                onClick={() => setSelectedReport(r)}
                title={`Generate ${r.name}`}
              >
                <div className="module-icon-wrap" style={{ background: `${r.color}15`, color: r.color }}><r.icon size={20} /></div>
                <div className="module-info">
                  <span className="module-name">{r.name}</span>
                  <span className="module-desc">{r.desc}</span>
                </div>
                <ChevronRight size={16} className="module-arrow" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Report Modal */}
      {selectedReport && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileSpreadsheet size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">{selectedReport.name}</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setSelectedReport(null)}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedReport.desc}</p>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead><tr><th>Particulars</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Balance (₹)</th></tr></thead>
                <tbody>
                  <tr><td className="td-bold">Domestic Sales (GST 18%)</td><td>—</td><td className="td-money">₹4,25,000</td><td className="td-money">₹4,25,000 CR</td></tr>
                  <tr><td className="td-bold">Purchases & Raw Materials</td><td className="td-money">₹2,58,000</td><td>—</td><td className="td-money">₹2,58,000 DR</td></tr>
                  <tr><td className="td-bold">Output CGST (9%)</td><td>—</td><td className="td-money">₹38,250</td><td className="td-money">₹38,250 CR</td></tr>
                  <tr><td className="td-bold">Output SGST (9%)</td><td>—</td><td className="td-money">₹38,250</td><td className="td-money">₹38,250 CR</td></tr>
                  <tr><td className="td-bold">Input Tax Credit (ITC)</td><td className="td-money">₹46,440</td><td>—</td><td className="td-money">₹46,440 DR</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-form-actions">
              <button className="modal-cancel-btn" onClick={() => setSelectedReport(null)}>Close</button>
              <button className="primary-action-btn" onClick={() => handleDownloadReport(selectedReport)}>
                <Download size={16} /><span>Download CSV Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



// ─── SYSTEM SETTINGS TAB ──────────────────────────────────────────────
export function OwnerSettings() {
  const [settings, setSettings] = useState({
    tenantName: 'Mann Fire & Safety Solutions',
    legalName: 'Mann Engineers Ltd.',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +5:30)',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'Indian (12,34,567.89)',
    valuationMethod: 'Weighted Average Cost',
    negativeStock: 'Blocked (Prevent by default)',
    autoReorder: 'Enabled — notify Branch Manager',
    barcodeSupport: 'Enabled (EAN-13, Code-128)'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    setToastMessage('System settings saved successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">System Settings</h2>
          <p className="page-desc">Tenant-wide configuration: general, inventory, security policies, and third-party integrations.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing ? (
            <button className="primary-action-btn" onClick={handleSave}><Check size={16} /><span>Save Configuration</span></button>
          ) : (
            <button className="secondary-action-btn" onClick={() => setIsEditing(true)}><Settings size={14} /><span>Edit Settings</span></button>
          )}
        </div>
      </div>

      <div className="settings-grid animate-fade-in">
        <div className="dash-panel">
          <div className="dash-panel-header"><h3 className="dash-panel-title">General</h3></div>
          <div className="settings-list">
            <div className="settings-row">
              <span className="settings-label">Tenant Name</span>
              {isEditing ? (
                <input value={settings.tenantName} onChange={(e) => setSettings({ ...settings, tenantName: e.target.value })} className="modal-field-input" style={{ width: '220px' }} />
              ) : (
                <span className="settings-value">{settings.tenantName}</span>
              )}
            </div>
            <div className="settings-row">
              <span className="settings-label">Primary Currency</span>
              <span className="settings-value">{settings.currency}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Timezone</span>
              <span className="settings-value">{settings.timezone}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Date Format</span>
              <span className="settings-value">{settings.dateFormat}</span>
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header"><h3 className="dash-panel-title">Inventory & Stock</h3></div>
          <div className="settings-list">
            <div className="settings-row">
              <span className="settings-label">Valuation Method</span>
              <span className="settings-value">{settings.valuationMethod}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Negative Stock</span>
              <span className="settings-value">{settings.negativeStock}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Auto Reorder</span>
              <span className="settings-value">{settings.autoReorder}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Barcode Support</span>
              <span className="settings-value">{settings.barcodeSupport}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SECTION 15A: PRODUCT 360 INSIGHT (UNIFIED ACROSS ADMIN & BRANCH) ─────────
export { default as OwnerProduct360 } from './Product360';

// ─── SECTION 15D: LOSS PREVENTION & SHRINKAGE DETECTION ──────────────
export function OwnerLossPrevention({ currentTenant, currentUser, availableBranches = [] }) {
  const companyId = currentTenant?.id || 'comp_mann';
  const [activeTab, setActiveTab] = useState('alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [summary, setSummary] = useState({
    overall_shrink_rate: '0.42%',
    unexplained_variance: '₹14,250',
    logged_damaged_goods: '₹4,975',
    active_inquiries: '2 Cases'
  });
  const [alerts, setAlerts] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [cycleCounts, setCycleCounts] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);

  // Schedule Count Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    branch_code: availableBranches[0]?.code || 'AMD-01',
    session_name: '',
    mode: 'Blind Count',
    section_name: '',
    auditor_name: currentUser?.name || 'Lead Auditor',
    scheduled_date: new Date().toISOString().split('T')[0],
    ledger_qty: 50,
    physical_qty: 50
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [sumRes, alertRes, appRes, countRes, benchRes] = await Promise.all([
        fetch(`/api/loss-prevention/summary?companyId=${encodeURIComponent(companyId)}`).then(r => r.json()).catch(() => null),
        fetch(`/api/loss-prevention/alerts?companyId=${encodeURIComponent(companyId)}`).then(r => r.json()).catch(() => null),
        fetch(`/api/loss-prevention/approvals?companyId=${encodeURIComponent(companyId)}`).then(r => r.json()).catch(() => null),
        fetch(`/api/loss-prevention/counts?companyId=${encodeURIComponent(companyId)}`).then(r => r.json()).catch(() => null),
        fetch(`/api/loss-prevention/benchmarks?companyId=${encodeURIComponent(companyId)}`).then(r => r.json()).catch(() => null),
      ]);

      if (sumRes?.success) {
        setSummary(sumRes.summary || sumRes);
      }
      if (alertRes?.success && Array.isArray(alertRes.alerts)) {
        setAlerts(alertRes.alerts);
      }
      if (appRes?.success && Array.isArray(appRes.approvals)) {
        setApprovals(appRes.approvals);
      }
      if (countRes?.success && Array.isArray(countRes.counts)) {
        setCycleCounts(countRes.counts);
      }
      if (benchRes?.success && Array.isArray(benchRes.benchmarks)) {
        setBenchmarks(benchRes.benchmarks);
      }
    } catch (err) {
      console.error('Failed to load Loss Prevention data from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [companyId]);

  const handleResolveAlert = async (id, alertTitle) => {
    try {
      const res = await fetch(`/api/loss-prevention/alerts/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved_by: currentUser?.name || 'Tenant Owner' })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Alert resolved and archived in PostgreSQL database!`);
        fetchAllData();
      } else {
        alert(data.message || 'Failed to resolve alert.');
      }
    } catch (err) {
      console.error('Resolve alert error:', err);
      alert('Error updating alert in DB.');
    }
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleApprove = async (id, adjNo) => {
    try {
      const res = await fetch(`/api/loss-prevention/approvals/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          approver_name: currentUser?.name || 'Tenant Owner',
          notes: 'Approved by Owner — stock adjusted in PostgreSQL'
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Stock adjustment ${adjNo || id} APPROVED! Quantities updated in DB.`);
        fetchAllData();
      } else {
        alert(data.message || 'Approval failed.');
      }
    } catch (err) {
      console.error('Approve stock error:', err);
      alert('Error connecting to database to approve stock write-off.');
    }
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleReject = async (id, adjNo) => {
    try {
      const res = await fetch(`/api/loss-prevention/approvals/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          approver_name: currentUser?.name || 'Tenant Owner',
          notes: 'Rejected by Owner — recount required'
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Stock adjustment ${adjNo || id} REJECTED in PostgreSQL.`);
        fetchAllData();
      } else {
        alert(data.message || 'Rejection failed.');
      }
    } catch (err) {
      console.error('Reject stock error:', err);
      alert('Error connecting to database to reject write-off.');
    }
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleScheduleCount = async (e) => {
    e.preventDefault();
    if (!scheduleForm.session_name.trim() || !scheduleForm.section_name.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/loss-prevention/counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          branch_code: scheduleForm.branch_code,
          session_name: scheduleForm.session_name.trim(),
          mode: scheduleForm.mode,
          section_name: scheduleForm.section_name.trim(),
          auditor_name: scheduleForm.auditor_name || (currentUser?.name || 'Lead Auditor'),
          scheduled_date: scheduleForm.scheduled_date,
          ledger_qty: Number(scheduleForm.ledger_qty) || 0,
          physical_qty: Number(scheduleForm.physical_qty) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Cycle count session "${scheduleForm.session_name}" scheduled in PostgreSQL!`);
        setShowScheduleModal(false);
        setScheduleForm({
          branch_code: availableBranches[0]?.code || 'AMD-01',
          session_name: '',
          mode: 'Blind Count',
          section_name: '',
          auditor_name: currentUser?.name || 'Lead Auditor',
          scheduled_date: new Date().toISOString().split('T')[0],
          ledger_qty: 50,
          physical_qty: 50
        });
        fetchAllData();
      } else {
        alert(data.message || 'Could not schedule cycle count.');
      }
    } catch (err) {
      console.error('Schedule count error:', err);
      alert('Failed to connect to database.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const shrinkStats = [
    { label: 'Overall Shrink Rate', value: summary.overall_shrink_rate || summary.overallShrinkRate || '0.41%', benchmark: 'Industry Target: < 1.20%', color: '#10b981', up: true },
    { label: 'Unexplained Variance', value: summary.unexplained_variance || summary.unexplainedVariance || '₹14,250', benchmark: 'Across network counts', color: '#f59e0b', up: false },
    { label: 'Logged Damaged Goods', value: summary.logged_damaged_goods || summary.loggedDamagedGoods || '₹0', benchmark: 'Photo evidence verified', color: '#38bdf8', up: true },
    { label: 'Active Inquiries', value: summary.active_inquiries || summary.activeInquiries || '4 Cases', benchmark: 'Transfer & receiving checks', color: '#a855f7', up: false }
  ];

  const q = searchQuery.toLowerCase();
  const filteredAlerts = alerts.filter(a =>
    (a.title || '').toLowerCase().includes(q) ||
    (a.description || '').toLowerCase().includes(q) ||
    (a.branch_code || '').toLowerCase().includes(q)
  );

  const filteredApprovals = approvals.filter(a =>
    (a.adjustment_no || '').toLowerCase().includes(q) ||
    (a.branch_code || '').toLowerCase().includes(q) ||
    (a.item_name || '').toLowerCase().includes(q) ||
    (a.sku || '').toLowerCase().includes(q) ||
    (a.reason_code || '').toLowerCase().includes(q) ||
    (a.requested_by || '').toLowerCase().includes(q)
  );

  const filteredCycleCounts = cycleCounts.filter(c =>
    (c.session_no || '').toLowerCase().includes(q) ||
    (c.branch_code || '').toLowerCase().includes(q) ||
    (c.section_name || '').toLowerCase().includes(q) ||
    (c.auditor_name || '').toLowerCase().includes(q) ||
    (c.status || '').toLowerCase().includes(q) ||
    (c.mode || '').toLowerCase().includes(q)
  );

  const filteredBenchmarks = benchmarks.filter(b =>
    (b.branch_name || '').toLowerCase().includes(q) ||
    (b.branch_code || '').toLowerCase().includes(q) ||
    (b.grade || '').toLowerCase().includes(q)
  );

  const handleExportCSV = () => {
    let filename = 'loss_prevention_audit.csv';
    let rows = [];

    if (activeTab === 'approvals') {
      filename = 'stock_adjustment_maker_checker.csv';
      rows = [
        ['Adjustment #', 'Branch', 'Item Name', 'SKU', 'Quantity', 'Value Amount', 'Reason Code', 'Requested By', 'Status', 'Date'],
        ...filteredApprovals.map(a => [a.adjustment_no, a.branch_code, a.item_name, a.sku, a.quantity, `₹${a.value_amount}`, a.reason_code, a.requested_by, a.status, a.created_at])
      ];
    } else if (activeTab === 'counts') {
      filename = 'cycle_counts_audit.csv';
      rows = [
        ['Session #', 'Branch', 'Mode', 'Section', 'Auditor', 'Ledger Qty', 'Physical Qty', 'Variance', 'Status', 'Scheduled Date'],
        ...filteredCycleCounts.map(c => [c.session_no, c.branch_code, c.mode, c.section_name, c.auditor_name, c.ledger_qty, c.physical_qty, c.variance, c.status, c.scheduled_date])
      ];
    } else if (activeTab === 'benchmarks') {
      filename = 'branch_shrink_benchmarks.csv';
      rows = [
        ['Branch Name', 'Branch Code', 'Monthly Turnover', 'Variance Amount', 'Shrink Rate %', 'Peer Benchmark', 'Grade'],
        ...filteredBenchmarks.map(b => [b.branch_name, b.branch_code, `₹${b.monthly_turnover}`, `₹${b.variance_amount}`, `${b.shrink_rate_percent}%`, b.peer_benchmark_text, b.grade])
      ];
    } else {
      filename = 'loss_prevention_alerts.csv';
      rows = [
        ['Alert Title', 'Branch', 'Severity', 'Description', 'Status', 'Reported Time'],
        ...filteredAlerts.map(a => [a.title, a.branch_code, a.severity, a.description, a.status, a.time_ago || a.created_at])
      ];
    }

    downloadCSV(filename, rows);
    setToastMessage(`Exported ${filename} to CSV!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={14} /></button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Loss Prevention & Shrinkage Detection</h2>
          <p className="page-desc">Section 15D: Real-time detection of unexplained variances, transfer mismatches, blind cycle count audit, and PostgreSQL maker-checker approvals.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={handleExportCSV}>
            <Download size={14} /><span>Export Audit Log</span>
          </button>
          <button className="dash-icon-btn" title="Refresh all tables from DB" onClick={fetchAllData}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="primary-action-btn" onClick={() => setShowScheduleModal(true)}>
            <Plus size={16} /><span>Schedule Cycle Count</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {shrinkStats.map((st, i) => (
          <div className="dash-stat-card" key={i}>
            <div className="stat-card-header"><span className="stat-label">{st.label}</span><div className="stat-icon-circle" style={{ background: `${st.color}20`, color: st.color }}><ShieldAlert size={18} /></div></div>
            <div className="stat-value">{st.value}</div>
            <div className="stat-change positive"><span>{st.benchmark}</span></div>
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'alerts', label: `Real-Time Detectors & Alerts (${filteredAlerts.length})` },
          { id: 'approvals', label: `Maker-Checker Approvals (${filteredApprovals.length})` },
          { id: 'counts', label: `Cycle & Blind Counts (${filteredCycleCounts.length})` },
          { id: 'benchmarks', label: `Branch Shrink Benchmark (${filteredBenchmarks.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: activeTab === tab.id ? 'var(--brand-accent)' : 'transparent',
              color: activeTab === tab.id ? '#070b14' : 'var(--text-secondary)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Real-time Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="dash-panel animate-fade-in">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Automated Detection Feed ({filteredAlerts.length})</h3>
            <div className="table-toolbar">
              <div className="dash-search-box" style={{ minWidth: '220px' }}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="dash-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
            {loading && alerts.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
                <p>Loading alerts from PostgreSQL...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No alerts matching search query.</div>
            ) : filteredAlerts.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                padding: '1rem', borderRadius: '8px',
                background: 'var(--bg-input)', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: a.severity === 'danger' ? 'rgba(239, 68, 68, 0.2)' : a.severity === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: a.severity === 'danger' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#38bdf8'
                }}>
                  <AlertTriangle size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{a.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="mono-badge">{a.branch_code}</span>
                      <span className={`status-badge ${a.status === 'RESOLVED' ? 'active' : 'warning'}`}>
                        {a.status === 'RESOLVED' ? 'Resolved' : 'Active Alert'}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{a.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {a.time_ago || (a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Just now')}
                    </span>
                    {a.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveAlert(a.id, a.title)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="dash-panel animate-fade-in">
          <div className="dash-panel-header">
            <div>
              <h3 className="dash-panel-title">Maker-Checker Stock Adjustment Approvals (Section 15D.3)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Approving automatically records financial write-off vouchers and deducts units from PostgreSQL <code>branch_stock</code>.
              </p>
            </div>
            <div className="table-toolbar">
              <div className="dash-search-box" style={{ minWidth: '220px' }}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search approvals..."
                  className="dash-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="dash-panel-badge">{filteredApprovals.length} Pending Owner Approval</span>
            </div>
          </div>
          {loading && approvals.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>Loading approval queue from PostgreSQL...</p>
            </div>
          ) : filteredApprovals.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>No pending stock write-offs matching search query. All branch adjustments tallied!</p>
            </div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Adjustment #</th>
                    <th>Branch</th>
                    <th>Item</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Loss Value</th>
                    <th>Reason Code</th>
                    <th>Requested By</th>
                    <th>Evidence</th>
                    <th>Status</th>
                    <th>Maker-Checker Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map(app => (
                    <tr key={app.id}>
                      <td><span className="mono-badge">{app.adjustment_no || app.id}</span></td>
                      <td><span className="mono">{app.branch_code}</span></td>
                      <td className="td-bold">{app.item_name}</td>
                      <td className="mono">{app.sku}</td>
                      <td className="td-bold">{app.quantity}</td>
                      <td className="td-money td-red">₹{Number(app.value_amount || 0).toLocaleString('en-IN')}</td>
                      <td><span className="type-tag">{app.reason_code}</span></td>
                      <td className="td-sub">{app.requested_by}</td>
                      <td>
                        {app.has_photo_evidence ? (
                          <span className="nature-tag" style={{ background: '#38bdf820', color: '#38bdf8' }}>📷 Photo Verified</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${app.status === 'APPROVED' ? 'active' : app.status === 'REJECTED' ? 'locked' : 'warning'}`}>
                          {app.status || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        {app.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleApprove(app.id, app.adjustment_no)}
                              style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(app.id, app.adjustment_no)}
                              style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="mono-badge">{app.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cycle Counts Tab */}
      {activeTab === 'counts' && (
        <div className="dash-panel animate-fade-in">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Blind & Cycle Count Sessions ({filteredCycleCounts.length})</h3>
            <div className="table-toolbar">
              <div className="dash-search-box" style={{ minWidth: '220px' }}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search count sessions..."
                  className="dash-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          {loading && cycleCounts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>Loading cycle counts from PostgreSQL...</p>
            </div>
          ) : filteredCycleCounts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No cycle count sessions matching search query.</div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Session #</th>
                    <th>Branch</th>
                    <th>Mode</th>
                    <th>Section</th>
                    <th>Auditor</th>
                    <th>Ledger Qty</th>
                    <th>Physical Qty</th>
                    <th>Variance</th>
                    <th>Status</th>
                    <th>Scheduled Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCycleCounts.map((c) => (
                    <tr key={c.id}>
                      <td><span className="mono-badge">{c.session_no}</span></td>
                      <td className="mono">{c.branch_code}</td>
                      <td><span className="type-tag">{c.mode}</span></td>
                      <td className="td-bold">{c.section_name}</td>
                      <td>{c.auditor_name}</td>
                      <td>{c.ledger_qty}</td>
                      <td className="td-bold">{c.physical_qty}</td>
                      <td className={c.variance < 0 ? 'td-money td-red' : 'td-money td-green'}>
                        {c.variance === 0 ? '0' : c.variance}
                      </td>
                      <td>
                        <span className={`status-badge ${c.variance === 0 || c.status === 'Tallied ⚖️' || c.status === 'Approved' ? 'active' : 'warning'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{c.scheduled_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div className="dash-panel animate-fade-in">
          <div className="dash-panel-header">
            <div>
              <h3 className="dash-panel-title">Branch Shrink Rate vs Network Peers (PostgreSQL Benchmarks)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated grading based on variance vs monthly inventory turnover.</p>
            </div>
            <div className="table-toolbar">
              <div className="dash-search-box" style={{ minWidth: '220px' }}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search branch peers..."
                  className="dash-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          {loading && benchmarks.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>Loading peer benchmarks from PostgreSQL...</p>
            </div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Code</th>
                    <th>Monthly Inventory Turnover</th>
                    <th>Variance Value</th>
                    <th>Shrink Rate %</th>
                    <th>Peer Benchmark</th>
                    <th>Audit Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBenchmarks.map((b) => (
                    <tr key={b.id}>
                      <td className="td-bold">{b.branch_name}</td>
                      <td><span className="mono-badge">{b.branch_code}</span></td>
                      <td className="td-money">₹{Number(b.monthly_turnover || 0).toLocaleString('en-IN')}</td>
                      <td className="td-money td-green">₹{Number(b.variance_amount || 0).toLocaleString('en-IN')}</td>
                      <td className="mono" style={{ color: Number(b.shrink_rate_percent) > 0.8 ? '#f59e0b' : '#10b981', fontWeight: '700' }}>
                        {b.shrink_rate_percent}%
                      </td>
                      <td>{b.peer_benchmark_text}</td>
                      <td>
                        <span className={`status-badge ${b.grade.includes('A') ? 'active' : 'warning'}`}>
                          {b.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Schedule Cycle Count Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title-text">Schedule Blind / Cycle Count Audit</h3>
              <button className="modal-close-icon" onClick={() => setShowScheduleModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleScheduleCount}>
              <div className="modal-form-group">
                <label className="modal-label">Audit Target Branch</label>
                <select
                  className="modal-select"
                  value={scheduleForm.branch_code}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, branch_code: e.target.value })}
                >
                  {availableBranches.map((b) => (
                    <option key={b.code || b.id} value={b.code}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="modal-form-group">
                  <label className="modal-label">Session Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Fire Safety Audit"
                    className="modal-input"
                    value={scheduleForm.session_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, session_name: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label">Count Mode</label>
                  <select
                    className="modal-select"
                    value={scheduleForm.mode}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, mode: e.target.value })}
                  >
                    <option value="Blind Count">Blind Count (Auditor sees 0 ledger qty)</option>
                    <option value="Spot Count">Spot Count (High value SKUs)</option>
                    <option value="Full Stock Take">Full Stock Take (Depot-wide)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="modal-form-group">
                  <label className="modal-label">Depot Section / Rack</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rack B4 — Extinguishers"
                    className="modal-input"
                    value={scheduleForm.section_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, section_name: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label">Assigned Auditor</label>
                  <input
                    type="text"
                    required
                    className="modal-input"
                    value={scheduleForm.auditor_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, auditor_name: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="modal-form-group">
                  <label className="modal-label">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    className="modal-input"
                    value={scheduleForm.scheduled_date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduled_date: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label">System Qty</label>
                  <input
                    type="number"
                    min="0"
                    className="modal-input"
                    value={scheduleForm.ledger_qty}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, ledger_qty: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label">Counted Qty</label>
                  <input
                    type="number"
                    min="0"
                    className="modal-input"
                    value={scheduleForm.physical_qty}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, physical_qty: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={isSubmitting}>
                  <Plus size={16} /><span>{isSubmitting ? 'Saving to DB...' : 'Record Session in DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
