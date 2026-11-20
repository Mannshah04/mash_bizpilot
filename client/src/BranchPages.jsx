import React, { useState, useEffect, useMemo } from 'react';
import {
  Receipt, Boxes, Truck, Wallet, ShoppingCart, CreditCard, BarChart3,
  Store, TrendingUp, AlertTriangle, CheckCircle2, Clock, ChevronRight,
  MapPin, Package, DollarSign, Search, Plus, Eye, Hash, Activity,
  Calendar, FileSpreadsheet, BookOpen, PieChart, ArrowDownRight,
  ArrowUpRight, Users, Download, Filter, Percent, Tag, Zap,
  RefreshCw, ShieldCheck, Layers, Briefcase, AlertCircle, Home,
  ShieldAlert, Sparkles, Send, Check, Camera, X, Printer, FileText, CheckCircle, Upload, Database,
  Edit3, Trash2, QrCode, SlidersHorizontal, Barcode,
  ArrowLeft, Building2, UserPlus, FileCheck,
  Copy, FolderPlus, Image, FileUp, ExternalLink, ChevronDown, FolderTree, Folder,
  Lock, Unlock, Key, Phone, Mail, Compass, Sliders, User
} from 'lucide-react';
import { downloadCSV, formatWeightInKg, formatWeightInGrams } from './exportUtils';
import { TablePagination, useTablePagination } from './TablePagination';
import { BranchReportsChartSection } from './AnalyticsComponents';
import { computeInventoryArchitectureMetrics } from './inventoryArchitecture';
import { checkPurchaseWarehouseCapacity, DEFAULT_GODOWN } from './warehouseEngine';
export { downloadCSV, formatWeightInKg, formatWeightInGrams };

// Predefined sub-categories by category for drop down selections
export const DEFAULT_CATEGORY_SUBCATEGORIES = {
  'Fire Extinguishers': [
    'Powder Extinguisher',
    'Gas Extinguisher',
    'CO2 Extinguisher',
    'Water / Foam Extinguisher',
    'Clean Agent Extinguisher',
    'Automatic Modular Extinguisher',
    'Fire Extinguisher'
  ],
  'PPE': [
    'Head Protection',
    'Eye Protection',
    'Body Protection',
    'Safety Shoes',
    'Mask',
    'Industrial Safety',
    'Fall Protection',
    'Laser PPE'
  ],
  'First Aid': [
    'Medical Kits',
    'Burn Dressings & Kits',
    'Emergency Eyewash',
    'Trauma Bandages',
    'Splints & Immobilizers'
  ],
  'Detection': [
    'Fire Alarms',
    'Smoke Detectors',
    'Heat Detectors',
    'Beam Detectors',
    'Control Panels',
    'Manual Call Points'
  ],
  'Hardware': [
    'Hose Reels & Nozzles',
    'Couplings & Adapters',
    'Valves & Hydrants',
    'Mounting Brackets & Clamps',
    'Cabinets & Stands',
    'Safety Hardware & Fittings'
  ],
  'Fire Blankets': [
    'Fiberglass Blankets',
    'Industrial Fire Blankets',
    'Kitchen Fire Blankets',
    'Welding Blankets'
  ],
  'Networking': [
    'Cables & Patching',
    'Fiber Optics',
    'Patch Panels'
  ],
  'Network Security': [
    'Firewall Hardware',
    'Security Appliances'
  ],
  'Power Backup': [
    'Online UPS',
    'PDU Hardware',
    'Batteries'
  ],
  'Server Infrastructure': [
    'Racks & Enclosures',
    'Server Accessories'
  ],
  'Electronic Safety': [
    'ESD Protection',
    'Surge Protection'
  ],
  'Optical Safety': [
    'Laser PPE',
    'Safety Goggles'
  ],
  'Consumables': [
    'Commercial Supplies',
    'Maintenance Spares'
  ],
  'General': [
    'General',
    'Commercial Supplies',
    'Industrial Supplies'
  ]
};

export const CATEGORY_LABEL_ALIASES = {
  'PPE & Safety Gear': 'PPE',
  'First Aid & Emergency': 'First Aid',
  'Smoke & Fire Detection': 'Detection',
  'Safety Hardware & Fittings': 'Hardware',
  'Networking & Structured Cabling': 'Networking',
  'Network Security & Firewalls': 'Network Security',
  'Power Backup & UPS': 'Power Backup',
  'Server Infrastructure & Racks': 'Server Infrastructure',
  'Electronic Safety & ESD': 'Electronic Safety',
  'Consumables & Commercial Supplies': 'Consumables'
};

export function getSubCategoriesForCategory(cat, productList = [], dbCatSubList = []) {
  const rawCat = (cat || '').trim();
  const resolvedKey = CATEGORY_LABEL_ALIASES[rawCat] || rawCat;
  
  const mapKey = Object.keys(DEFAULT_CATEGORY_SUBCATEGORIES).find(
    k => k.toLowerCase() === resolvedKey.toLowerCase()
  );
  const predefined = mapKey ? DEFAULT_CATEGORY_SUBCATEGORIES[mapKey] : [];

  const dynamic = (productList || [])
    .filter(p => {
      const pCat = (p.category || '').trim();
      const pResolved = CATEGORY_LABEL_ALIASES[pCat] || pCat;
      return pResolved.toLowerCase() === resolvedKey.toLowerCase() && p.subCategory;
    })
    .map(p => (p.subCategory || '').trim());

  const fromDbCatSub = (dbCatSubList || [])
    .filter(c => c.type === 'subcategory' && c.tittle)
    .map(c => c.tittle.trim());

  const combined = Array.from(new Set([...predefined, ...dynamic, ...fromDbCatSub])).filter(Boolean);
  return combined.length > 0 ? combined : ['General', 'Commercial Supplies', 'Standard'];
}

/* ========================================================================
   BRANCH DASHBOARD PAGES — One component per sidebar tab
   Every button is fully functional with modals, CSV exports, & toast feedback

   ======================================================================== */

// ─── BRANCH OVERVIEW ──────────────────────────────────────────────────
export function BranchOverview({ activeBranch, branchStats, branchModules, branchActivity, onNavigateTab }) {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExportActivity = () => {
    const headers = ['Action', 'Detail', 'Time', 'Type'];
    const rows = [headers, ...branchActivity.map(a => [a.action, a.detail, a.time, a.type])];
    downloadCSV(`Branch_Activity_${activeBranch.code}.csv`, rows);
    showToast('Activity log exported to CSV successfully!');
  };

  return (
    <>
      {/* Branch Banner */}
      <div className="dash-welcome-banner branch-banner animate-fade-in">
        <div>
          <h2 className="dash-welcome-title">{activeBranch.name}</h2>
          <p className="dash-welcome-desc">Branch operational dashboard with RLS data isolation active.</p>
        </div>
        <div className="branch-status-pill"><CheckCircle2 size={16} /><span>Operational</span></div>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid animate-fade-in">
        {branchStats.map((stat, i) => (
          <div className="dash-stat-card" key={i}>
            <div className="stat-card-header">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-icon-circle" style={{ background: `${stat.color}20`, color: stat.color }}><stat.icon size={18} /></div>
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
            <h3 className="dash-panel-title">Branch Operations</h3>
            <span className="dash-panel-badge">{branchModules.length} Modules</span>
          </div>
          <div className="dash-modules-grid">
            {branchModules.map((mod, i) => (
              <button
                className="dash-module-card"
                key={i}
                onClick={() => onNavigateTab && onNavigateTab(mod.tab || 'pos')}
                title={`Open ${mod.name}`}
              >
                <div className="module-icon-wrap" style={{ background: `${mod.color}15`, color: mod.color }}><mod.icon size={20} /></div>
                <div className="module-info"><span className="module-name">{mod.name}</span><span className="module-desc">{mod.desc}</span></div>
                <ChevronRight size={16} className="module-arrow" />
              </button>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Branch Activity</h3>
            <button className="dash-panel-link" onClick={() => setShowActivityModal(true)}>View All</button>
          </div>
          <div className="dash-activity-feed">
            {branchActivity.map((act, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${act.type}`}></div>
                <div className="activity-info"><span className="activity-action">{act.action}</span><span className="activity-branch">{act.detail}</span></div>
                <span className="activity-time"><Clock size={12} /> {act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALL ACTIVITY MODAL */}
      {showActivityModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowActivityModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Activity size={20} color="var(--brand-accent)" />
                <span>Branch Operations Log • {activeBranch.code}</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowActivityModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-dialog-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Showing last 24 hours of operational events</span>
                <button className="secondary-action-btn" onClick={handleExportActivity}>
                  <Download size={14} /><span>Export Log</span>
                </button>
              </div>
              <div className="dash-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {branchActivity.map((act, i) => (
                  <div className="activity-item" key={i} style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <div className={`activity-dot ${act.type}`}></div>
                    <div className="activity-info">
                      <span className="activity-action" style={{ fontWeight: '600' }}>{act.action}</span>
                      <span className="activity-branch" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.detail}</span>
                    </div>
                    <span className="activity-time" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><Clock size={12} /> {act.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-dialog-footer">
              <button className="secondary-action-btn" onClick={() => setShowActivityModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── CREATE TAX INVOICE FULL PAGE (POSTGRESQL SYNCED) ───
export function CreateInvoicePage({ activeBranch, initialInvoice = null, onBack, onCreated }) {
  const isEditing = Boolean(initialInvoice);
  const [dbProducts, setDbProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form Fields
  const [invoiceNo, setInvoiceNo] = useState(() => initialInvoice?.invoiceNo || initialInvoice?.no || '');
  const [revisionNo, setRevisionNo] = useState(() => initialInvoice?.revisionNo || '1');
  const [customerSearch, setCustomerSearch] = useState(() => initialInvoice?.customerName || initialInvoice?.customer || '');
  const [showCustDropdown, setShowCustDropdown] = useState(false);
  const [selectedCustUid, setSelectedCustUid] = useState(() => initialInvoice?.customerUid || '');
  const [customerName, setCustomerName] = useState(() => initialInvoice?.customerName || initialInvoice?.customer || '');
  const [contactPerson, setContactPerson] = useState(() => initialInvoice?.contactPerson || '');
  const [customerPhone, setCustomerPhone] = useState(() => initialInvoice?.customerPhone || initialInvoice?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(() => initialInvoice?.customerEmail || initialInvoice?.email || '');
  const [customerAddress, setCustomerAddress] = useState(() => initialInvoice?.customerAddress || initialInvoice?.address || '');
  const [customerGstin, setCustomerGstin] = useState(() => initialInvoice?.customerGstin || initialInvoice?.gstin || '');

  const [invoiceDate, setInvoiceDate] = useState(() => {
    if (initialInvoice?.rawDate) return String(initialInvoice.rawDate).split('T')[0];
    if (initialInvoice?.date && /^\d{4}-\d{2}-\d{2}$/.test(initialInvoice.date)) return initialInvoice.date;
    return new Date().toISOString().split('T')[0];
  });
  const [followupBy, setFollowupBy] = useState(() => initialInvoice?.followupBy || 'Admin');
  const [referenceNo, setReferenceNo] = useState(() => initialInvoice?.referenceNo || '');
  const [paymentMode, setPaymentMode] = useState(() => initialInvoice?.payment || initialInvoice?.paymentMode || 'Cash');
  const [invoiceRemark, setInvoiceRemark] = useState(() => initialInvoice?.quoteRemark || initialInvoice?.remark || '');
  const [termsConditions, setTermsConditions] = useState(() => initialInvoice?.termsConditions || (
    "• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n" +
    "• GST: Extra as applicable (presently 18% or as defined per item).\n" +
    "• Payment: 100% against delivery.\n" +
    "• Delivery: Within 2 to 4 business days from PO receipt."
  ));

  // Line items state (supports initialInvoice lineItems if present)
  const [items, setItems] = useState(() => {
    if (initialInvoice?.lineItems && Array.isArray(initialInvoice.lineItems) && initialInvoice.lineItems.length > 0) {
      return initialInvoice.lineItems.map((it, idx) => ({
        id: it.id || idx + 1,
        itemCode: it.itemCode || '',
        name: it.name || it.itemName || '',
        unit: it.unit || 'NOS',
        hsn: it.hsn || it.hsnCode || '',
        price: it.price !== undefined ? it.price : (it.unitPrice || ''),
        discount: it.discount || 0,
        qty: it.qty || 1,
        taxRate: it.taxRate || 18,
        remark: it.remark || '',
        searchQuery: it.name || it.itemName || '',
        showDropdown: false
      }));
    }
    return [
      {
        id: 1,
        itemCode: '',
        name: '',
        unit: 'NOS',
        hsn: '',
        price: '',
        discount: 0,
        qty: 1,
        taxRate: 18,
        remark: '',
        searchQuery: '',
        showDropdown: false
      }
    ];
  });

  const [couponDiscount, setCouponDiscount] = useState(() => initialInvoice?.discountAmount || 0);
  const [roundOff, setRoundOff] = useState(() => initialInvoice?.roundOff || 0);

  // Quick Customer Creation Modal
  const [showNewCustModal, setShowNewCustModal] = useState(false);
  const [newCustForm, setNewCustForm] = useState({ company: '', name: '', phone: '', email: '', address: '', gstin: '' });
  const [savingCust, setSavingCust] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch PostgreSQL Products for this branch & Customers list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = activeBranch?.companyId || (activeBranch?.code?.startsWith('AND') || activeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');
        const [prodRes, custRes] = await Promise.all([
          fetch(`/api/inventory?branch=${encodeURIComponent(activeBranch.code)}&companyId=${encodeURIComponent(companyId)}`),
          fetch(`/api/customers`)
        ]);
        const prodJson = await prodRes.json();
        const custJson = await custRes.json();

        if (prodJson.success && Array.isArray(prodJson.data)) {
          setDbProducts(prodJson.data);
        }
        if (custJson.success && Array.isArray(custJson.data)) {
          setCustomers(custJson.data);
        }
      } catch (err) {
        console.warn('Failed to load DB products or customers for invoice:', err);
      }
    };
    fetchData();
  }, [activeBranch.code]);

  // Auto-calculate next sequential invoice number for this branch series (1, 2, 3...)
  useEffect(() => {
    if (!isEditing && !invoiceNo) {
      const fetchNextInvoiceNo = async () => {
        try {
          const res = await fetch(`/api/invoices?branch=${encodeURIComponent(activeBranch.code)}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const nums = json.data.map(inv => {
              const m = (inv.no || inv.invoiceNo || '').match(/^(\d+)$/);
              return m ? parseInt(m[1], 10) : 0;
            }).filter(n => !isNaN(n) && n > 0);
            const nextSeq = (nums.length > 0 ? Math.max(...nums) : 0) + 1;
            setInvoiceNo(String(nextSeq));
          } else {
            setInvoiceNo('1');
          }
        } catch (err) {
          setInvoiceNo('1');
        }
      };
      fetchNextInvoiceNo();
    }
  }, [activeBranch.code, isEditing]);

  // Customer selection helper
  const handleSelectCustomer = (cust) => {
    setSelectedCustUid(cust.uid || '');
    setCustomerName(cust.company || cust.name || '');
    setCustomerSearch(cust.company || cust.name || '');
    setContactPerson(cust.name || '');
    setCustomerPhone(cust.phone || '');
    setCustomerEmail(cust.email || '');
    setCustomerAddress(cust.address || '');
    setCustomerGstin(cust.gstin || '');
    setShowCustDropdown(false);
    showToast(`Customer "${cust.company || cust.name}" selected from directory!`);
  };

  // Quick save new customer into PostgreSQL
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!newCustForm.company.trim()) {
      alert('Company / Legal Name is required');
      return;
    }
    setSavingCust(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustForm)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCustomers(prev => [json.data, ...prev]);
        handleSelectCustomer(json.data);
        setShowNewCustModal(false);
        setNewCustForm({ company: '', name: '', phone: '', email: '', address: '', gstin: '' });
        showToast('New customer saved to PostgreSQL directory!');
      }
    } catch (err) {
      alert('Failed to save customer: ' + err.message);
    } finally {
      setSavingCust(false);
    }
  };

  // Row operations
  const handleAddItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        itemCode: '',
        name: '',
        unit: 'NOS',
        hsn: '8424',
        price: 0,
        discount: 0,
        qty: 1,
        taxRate: 18,
        remark: '',
        searchQuery: '',
        showDropdown: false
      }
    ]);
  };

  const handleRemoveItemRow = (id) => {
    if (items.length <= 1) {
      showToast('Invoice must contain at least one product row.');
      return;
    }
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      return { ...it, [field]: value };
    }));
  };

  const handleSelectProduct = (itemId, prod) => {
    setItems(prev => prev.map(it => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        itemCode: prod.pid,
        name: prod.name,
        unit: 'NOS',
        hsn: prod.hsn || '8424',
        price: prod.salePrice || 0,
        taxRate: prod.gst || 18,
        searchQuery: `${prod.pid} - ${prod.name}`,
        showDropdown: false
      };
    }));
    showToast(`Product "${prod.name}" (${prod.pid}) echoed from PostgreSQL!`);
  };

  // Calculations
  const calculatedItems = items.map(it => {
    const price = parseFloat(it.price) || 0;
    const discount = parseFloat(it.discount) || 0;
    const effectivePrice = Math.max(0, price - discount);
    const qty = parseFloat(it.qty) || 1;
    const subtotal = Math.round((effectivePrice * qty) * 100) / 100;
    const taxRate = parseFloat(it.taxRate) || 0;
    const taxAmount = Math.round(((subtotal * taxRate) / 100) * 100) / 100;
    return { ...it, effectivePrice, subtotal, taxAmount };
  });

  const subtotalBeforeTax = Math.round(calculatedItems.reduce((sum, it) => sum + it.subtotal, 0) * 100) / 100;
  const totalTax = Math.round(calculatedItems.reduce((sum, it) => sum + it.taxAmount, 0) * 100) / 100;
  const totalWithTax = Math.round((subtotalBeforeTax + totalTax) * 100) / 100;
  const grandTotal = Math.max(0, Math.round((totalWithTax - (parseFloat(couponDiscount) || 0) + (parseFloat(roundOff) || 0)) * 100) / 100);

  // Submit invoice to PostgreSQL
  const handleSubmitInvoice = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const effectiveCustName = (customerName || customerSearch).trim();
    if (!effectiveCustName) {
      alert('Please specify or select a Customer / Company Name.');
      return;
    }
    if (items.some(it => !(it.name || it.searchQuery || '').trim())) {
      alert('Please ensure all items have a valid product name or description.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        invoiceNo: (invoiceNo || '').trim() || undefined,
        branchCode: activeBranch.code,
        customerUid: selectedCustUid,
        customerName: effectiveCustName,
        contactPerson: contactPerson.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: customerAddress.trim(),
        customerGstin: customerGstin.trim(),
        invoiceDate,
        dueDate: invoiceDate,
        followupBy,
        referenceNo,
        revisionNo,
        subtotal: subtotalBeforeTax,
        totalTax,
        discountAmount: parseFloat(couponDiscount) || 0,
        roundOff: parseFloat(roundOff) || 0,
        grandTotal,
        paymentMode,
        quoteRemark: invoiceRemark,
        termsConditions,
        items: calculatedItems.map(it => ({
          itemCode: it.itemCode || 'CUSTOM',
          name: it.name,
          unit: it.unit,
          hsn: it.hsn,
          price: it.price,
          discount: it.discount,
          qty: it.qty,
          taxRate: it.taxRate,
          remark: it.remark
        }))
      };

      const url = isEditing
        ? `/api/invoices/${initialInvoice.id || initialInvoice.no || initialInvoice.invoiceNo}`
        : '/api/invoices';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.data) {
        showToast(isEditing ? `Invoice ${json.data.invoiceNo} successfully updated in PostgreSQL!` : `Invoice ${json.data.invoiceNo} successfully generated & saved into PostgreSQL!`);
        setTimeout(() => {
          onCreated(json.data);
        }, 600);
      } else {
        alert('Failed to save invoice: ' + (json.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error creating invoice: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered customer search
  const filteredCustomers = customers.filter(c => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.company || '').toLowerCase().includes(q) ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.gstin || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="invoice-page-container">
      {/* ── TOP HEADER BAR ── */}
      <div className="invoice-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="button" className="invoice-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /><span>Back to Invoices</span>
          </button>
          <div>
            <h2 className="page-title" style={{ margin: 0, fontSize: '1.45rem' }}>
              {isEditing ? `Edit Tax Invoice (${initialInvoice.invoiceNo || initialInvoice.no})` : 'Create Tax Invoice'}
            </h2>
            <p className="page-desc" style={{ margin: '0.2rem 0 0 0' }}>
              {isEditing
                ? `Update items, pricing, tax rates, or customer info for Invoice ${initialInvoice.invoiceNo || initialInvoice.no}.`
                : `GST-compliant multi-item billing linked directly with PostgreSQL inventory & customer ledger (${activeBranch.name}).`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="mono-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.35rem 0.75rem' }}>
            <Database size={13} style={{ marginRight: '5px' }} /> PostgreSQL: bizzpilot
          </span>
          <span className="mono-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.35rem 0.75rem' }}>
            Branch: {activeBranch.code}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitInvoice}>
        {/* ── CARD 1: INVOICE & CUSTOMER DETAILS ── */}
        <div className="invoice-form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <Receipt size={18} color="var(--brand-accent)" />
              Tax Invoice Details
            </h3>
            <button
              type="button"
              className="secondary-action-btn"
              onClick={() => setShowNewCustModal(true)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              <UserPlus size={14} /><span>+ New Customer</span>
            </button>
          </div>

          {/* ── UNIFIED 4-COLUMN INVOICE DETAILS GRID ── */}
          <div className="invoice-form-grid">
            {/* ROW 1: Invoice # (1), Customer Legal Name (span 2), Customer GSTIN (1) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">
                <span>Invoice # *</span>
                <span style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 600 }}>Series ({activeBranch.code})</span>
              </label>
              <input
                type="text"
                required
                className="invoice-input"
                style={{ fontWeight: 700, letterSpacing: '0.5px' }}
                value={invoiceNo}
                onChange={e => setInvoiceNo(e.target.value)}
                placeholder="1, 2, 3..."
                title={`Sequential invoice series for ${activeBranch.name}`}
              />
            </div>

            <div className="invoice-field-group invoice-col-span-2" style={{ position: 'relative' }}>
              <label className="invoice-field-label">
                Company / Legal Name *
                {selectedCustUid && <span style={{ color: '#10b981', fontSize: '0.72rem' }}>✓ Linked ({selectedCustUid})</span>}
              </label>
              <input
                type="text"
                required
                className="invoice-input"
                placeholder="Type to search customer company..."
                value={customerSearch}
                onChange={e => {
                  setCustomerSearch(e.target.value);
                  setCustomerName(e.target.value);
                  setShowCustDropdown(true);
                }}
                onFocus={() => setShowCustDropdown(true)}
              />

              {/* Customer Autocomplete Dropdown */}
              {showCustDropdown && customerSearch.trim() && (
                <div className="invoice-autocomplete-dropdown">
                  {filteredCustomers.length === 0 ? (
                    <div style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No registered customer found. Entering as walk-in / custom account.
                    </div>
                  ) : (
                    filteredCustomers.map(c => (
                      <div
                        key={c.id || c.uid}
                        className="invoice-autocomplete-item"
                        onClick={() => handleSelectCustomer(c)}
                      >
                        <div>
                          <strong>{c.company}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {c.name ? `Contact: ${c.name} • ` : ''}Phone: {c.phone || 'N/A'}
                          </div>
                        </div>
                        <span className="mono-badge" style={{ fontSize: '0.7rem' }}>{c.uid}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Customer GSTIN</label>
              <input
                type="text"
                className="invoice-input"
                value={customerGstin}
                onChange={e => setCustomerGstin(e.target.value.toUpperCase())}
                placeholder="24AAACR1234F1Z5 or URP"
              />
            </div>

            {/* ROW 2: Contact Person (1), Customer Phone (1), Customer Email (1), Customer Address (1) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Contact Person</label>
              <input
                type="text"
                className="invoice-input"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="Contact person name..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Customer Phone</label>
              <input
                type="text"
                className="invoice-input"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Phone number..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Customer Email</label>
              <input
                type="email"
                className="invoice-input"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="Email address..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Customer Address</label>
              <input
                type="text"
                className="invoice-input"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Customer delivery / billing address..."
              />
            </div>

            {/* ROW 3: Invoice Date (1), Payment Mode (1), Reference & Revision (1), Follow-up Rep (1) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Invoice Date</label>
              <input
                type="date"
                required
                className="invoice-input"
                value={invoiceDate}
                onChange={e => setInvoiceDate(e.target.value)}
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Payment Mode</label>
              <select
                className="invoice-select"
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value)}
              >
                <option value="Cash">Cash (Counter)</option>
                <option value="UPI">UPI / Dynamic QR Code</option>
                <option value="Bank Transfer">Bank Transfer / NEFT / RTGS</option>
                <option value="Card">Debit / Credit Card (EDC POS)</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Credit 30 Days">B2B Credit (30 Days)</option>
              </select>
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">
                <span>Reference No. (PO / Inquiry)</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>Rev</span>
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  className="invoice-input"
                  style={{ flex: 1 }}
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  placeholder="PO-441 / Ref #9921"
                />
                <input
                  type="text"
                  className="invoice-input"
                  style={{ width: '56px', textAlign: 'center', padding: '0.65rem 0.25rem' }}
                  value={revisionNo}
                  onChange={e => setRevisionNo(e.target.value)}
                  placeholder="Rev"
                  title="Revision count"
                />
              </div>
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Follow-up Representative</label>
              <select
                className="invoice-select"
                value={followupBy}
                onChange={e => setFollowupBy(e.target.value)}
              >
                <option value="Admin">Admin (Administrator)</option>
                <option value="Manoj Parmar">Manoj Parmar (Sales Lead)</option>
                <option value="Bhavin Patel">Bhavin Patel (Counter Billing)</option>
                <option value="Rajesh Dave">Rajesh Dave (Accounts)</option>
                <option value="Sanjay Verma">Sanjay Verma (Operations)</option>
              </select>
            </div>
          </div>

          {/* Notes & Terms Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-medium)' }}>
            <div className="invoice-field-group">
              <label className="invoice-field-label">Invoice Notes / Remarks</label>
              <textarea
                className="invoice-textarea"
                rows={3}
                value={invoiceRemark}
                onChange={e => setInvoiceRemark(e.target.value)}
                placeholder="Terms, dispatch notes, or remarks to be printed on the invoice..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Terms & Conditions</label>
              <textarea
                className="invoice-textarea"
                rows={3}
                value={termsConditions}
                onChange={e => setTermsConditions(e.target.value)}
                placeholder="Payment, delivery, and warranty terms..."
              />
            </div>
          </div>
        </div>

        {/* ── CARD 2: LINE ITEMS TABLE ── */}
        <div className="invoice-form-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <Boxes size={18} color="var(--brand-accent)" />
              Line Items • Echoing Live PostgreSQL Inventory
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {items.length} {items.length === 1 ? 'row' : 'rows'} configured
            </span>
          </div>

          <div className="invoice-items-table-wrap">
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th style={{ width: '27%' }}>Product / Item Description</th>
                  <th style={{ width: '7%' }}>Unit</th>
                  <th style={{ width: '9%' }}>HSN Code</th>
                  <th style={{ width: '11%' }}>Unit Price (₹)</th>
                  <th style={{ width: '9%' }}>Discount (₹)</th>
                  <th style={{ width: '8%' }}>Qty</th>
                  <th style={{ width: '8%' }}>Tax %</th>
                  <th style={{ width: '15%' }}>Subtotal (₹)</th>
                  <th style={{ width: '6%', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(calculatedItems || []).map((item, idx) => {
                  if (!item) return null;
                  const filteredRowProducts = (dbProducts || []).filter(p => {
                    if (!p) return false;
                    const q = (item.searchQuery || '').toLowerCase().trim();
                    if (!q) return true;
                    return (
                      (p.pid || '').toLowerCase().includes(q) ||
                      (p.name || '').toLowerCase().includes(q) ||
                      (p.category || '').toLowerCase().includes(q)
                    );
                  });

                  return (
                    <tr key={item.id} style={{ position: 'relative', zIndex: item.showDropdown ? 50 : 1 }}>
                      {/* Product search input + autocomplete */}
                      <td style={{ position: 'relative', overflow: 'visible' }}>
                        {/* Wrapper strictly around product search input so dropdown aligns directly below it */}
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            className="invoice-input"
                            style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', marginBottom: '4px' }}
                            placeholder="Type product PID or name..."
                            value={item.searchQuery}
                            onChange={e => {
                              handleUpdateItem(item.id, 'searchQuery', e.target.value);
                              handleUpdateItem(item.id, 'name', e.target.value);
                              handleUpdateItem(item.id, 'showDropdown', true);
                            }}
                            onFocus={() => handleUpdateItem(item.id, 'showDropdown', true)}
                          />

                          {/* Live Autocomplete Dropdown from PostgreSQL directly below the product name */}
                          {item.showDropdown && item.searchQuery.trim() && (
                            <div
                              className="invoice-autocomplete-dropdown"
                              style={{
                                top: 'calc(100% - 2px)',
                                minWidth: '380px',
                                zIndex: 1200,
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid var(--border-medium)'
                              }}
                            >
                              {filteredRowProducts.length === 0 ? (
                                <div style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  No database item matched. Entering as custom item.
                                </div>
                              ) : (
                                filteredRowProducts.map(prod => {
                                  const prodArch = computeInventoryArchitectureMetrics(prod);
                                  const isBelowRop = prodArch.availableStock <= prodArch.rop;

                                  return (
                                    <div
                                      key={prod.id || prod.pid}
                                      className="invoice-autocomplete-item"
                                      onClick={() => handleSelectProduct(item.id, prod)}
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <span className="mono-badge" style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>{prod.pid}</span>
                                          <strong>{prod.name}</strong>
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                          <span>{prod.category}</span>
                                          <span>•</span>
                                          <span>Stock: <strong style={{ color: isBelowRop ? '#ef4444' : '#10b981' }}>{prodArch.availableStock}</strong></span>
                                          <span>•</span>
                                          <span className="formula-badge" style={{ fontSize: '0.67rem', padding: '1px 5px' }}>
                                            fx SQR: {prodArch.sqr}/d
                                          </span>
                                          <span style={{ color: isBelowRop ? '#ef4444' : 'var(--text-secondary)' }}>
                                            ROP: <strong>{prodArch.rop}</strong>
                                          </span>
                                        </div>
                                      </div>
                                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontWeight: '750', color: 'var(--brand-accent)', fontSize: '0.82rem' }}>
                                          ₹{(prod.salePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                        {isBelowRop && (
                                          <span className="status-badge danger" style={{ fontSize: '0.65rem', padding: '1px 5px', marginTop: '2px' }}>
                                            ROP Triggered
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>

                        {/* Separate note/remark input below product input */}
                        <input
                          type="text"
                          className="invoice-input"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                          placeholder="Line note / batch remark..."
                          value={item.remark}
                          onChange={e => handleUpdateItem(item.id, 'remark', e.target.value)}
                        />

                        {/* Live Demand & Replenishment Architecture Indicator for Selected Product */}
                        {(() => {
                          const matched = dbProducts.find(p => (item.itemCode && p.pid === item.itemCode) || (item.name && p.name === item.name));
                          if (!matched) return null;
                          const arch = computeInventoryArchitectureMetrics(matched);
                          const remainingAfterSale = arch.availableStock - (parseFloat(item.qty) || 1);
                          const willTriggerRop = remainingAfterSale <= arch.rop;

                          return (
                            <div style={{ marginTop: '5px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span className="formula-badge" title="Formula A: SQR = Daily Sales Velocity over lookback window">
                                fx SQR: {arch.sqr}/day
                              </span>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                Net Avail: <strong style={{ color: arch.availableStock <= arch.rop ? '#ef4444' : 'var(--text-primary)' }}>{arch.availableStock}</strong>
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                ROP: <strong>{arch.rop}</strong>
                              </span>
                              {willTriggerRop && (
                                <span style={{ color: '#ea580c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  ⚠️ Invoicing drops stock ({remainingAfterSale}) ≤ ROP ({arch.rop})
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Unit */}
                      <td>
                        <input
                          type="text"
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.5rem', fontSize: '0.82rem', textAlign: 'center' }}
                          value={item.unit}
                          onChange={e => handleUpdateItem(item.id, 'unit', e.target.value.toUpperCase())}
                        />
                      </td>

                      {/* HSN */}
                      <td>
                        <input
                          type="text"
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.5rem', fontSize: '0.82rem' }}
                          value={item.hsn}
                          onChange={e => handleUpdateItem(item.id, 'hsn', e.target.value)}
                          placeholder="HSN"
                        />
                      </td>

                      {/* Unit Price */}
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          required
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                          value={item.price}
                          onChange={e => handleUpdateItem(item.id, 'price', e.target.value)}
                        />
                      </td>

                      {/* Discount */}
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                          value={item.discount}
                          onChange={e => handleUpdateItem(item.id, 'discount', e.target.value)}
                        />
                      </td>

                      {/* Qty */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          required
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', textAlign: 'center' }}
                          value={item.qty}
                          onChange={e => handleUpdateItem(item.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                        />
                      </td>

                      {/* Tax % */}
                      <td>
                        <select
                          className="invoice-select"
                          style={{ padding: '0.45rem 0.5rem', fontSize: '0.82rem' }}
                          value={item.taxRate}
                          onChange={e => handleUpdateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </td>

                      {/* Subtotal & Tax */}
                      <td>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          ₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginTop: '2px' }}>
                          tax: ₹{item.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Remove Row Action */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                          title="Remove item row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="secondary-action-btn"
            onClick={handleAddItemRow}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem', marginTop: '0.5rem' }}
          >
            <Plus size={15} /><span>Add Item Row</span>
          </button>

          {/* ── INVOICE DEMAND & REPLENISHMENT ARCHITECTURE AUDIT ── */}
          {(() => {
            let highVelocityCount = 0;
            const ropAlerts = [];
            calculatedItems.forEach(it => {
              const matched = dbProducts.find(p => (it.itemCode && p.pid === it.itemCode) || (it.name && p.name === it.name));
              if (matched) {
                const arch = computeInventoryArchitectureMetrics(matched);
                if (arch.sqr >= 2.0) highVelocityCount++;
                const remaining = arch.availableStock - (parseFloat(it.qty) || 1);
                if (remaining <= arch.rop) {
                  ropAlerts.push({ name: it.name || it.itemCode, remaining, rop: arch.rop });
                }
              }
            });

            return (
              <div
                style={{
                  margin: '1.25rem 0',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '10px',
                  background: ropAlerts.length > 0 ? 'rgba(234, 88, 12, 0.08)' : 'rgba(56, 189, 248, 0.06)',
                  border: `1px solid ${ropAlerts.length > 0 ? 'rgba(234, 88, 12, 0.3)' : 'rgba(56, 189, 248, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="formula-badge">fx Demand Spec</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Inventory Velocity & Replenishment Impact:
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {highVelocityCount} high-demand mover{highVelocityCount === 1 ? '' : 's'} (SQR ≥ 2.0/d)
                  </span>
                </div>
                {ropAlerts.length > 0 ? (
                  <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={14} />
                    <span>⚠️ {ropAlerts.length} item{ropAlerts.length === 1 ? '' : 's'} will trigger Reorder Point (ROP) after this invoice</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} />
                    <span>✓ Buffer positions optimal (Available Stock &gt; ROP)</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── TOTAL BOX ── */}
          <div className="invoice-total-box">
            <div className="invoice-total-row">
              <span>Subtotal (before tax):</span>
              <span style={{ fontWeight: '600' }}>₹{subtotalBeforeTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="invoice-total-row" style={{ color: '#f59e0b' }}>
              <span>Total Tax (GST):</span>
              <span style={{ fontWeight: '600' }}>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="invoice-total-row">
              <span>Total (with tax):</span>
              <span style={{ fontWeight: '700' }}>₹{totalWithTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="invoice-total-row" style={{ alignItems: 'center' }}>
              <span>Discount Amount (₹):</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="invoice-input"
                style={{ width: '130px', padding: '0.35rem 0.6rem', fontSize: '0.82rem', textAlign: 'right' }}
                value={couponDiscount}
                onChange={e => setCouponDiscount(e.target.value)}
              />
            </div>

            <div className="invoice-total-row" style={{ alignItems: 'center' }}>
              <span>Round Off (₹):</span>
              <input
                type="number"
                step="0.01"
                className="invoice-input"
                style={{ width: '130px', padding: '0.35rem 0.6rem', fontSize: '0.82rem', textAlign: 'right' }}
                value={roundOff}
                onChange={e => setRoundOff(e.target.value)}
              />
            </div>

            <div className="invoice-total-row grand">
              <span>Payable Total:</span>
              <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ACTION: GENERATE & SAVE INVOICE ── */}
        <div style={{ marginTop: '1.75rem', marginBottom: '2.5rem' }}>
          <button
            type="submit"
            id="btn-generate-save-invoice"
            className="invoice-submit-btn"
            disabled={loading}
            onClick={handleSubmitInvoice}
          >
            <FileText size={20} />
            <span>{loading ? (isEditing ? 'Updating in PostgreSQL...' : 'Posting to PostgreSQL...') : (isEditing ? 'UPDATE & SAVE CHANGES' : 'GENERATE & SAVE INVOICE')}</span>
          </button>
        </div>
      </form>

      {/* QUICK NEW CUSTOMER MODAL */}
      {showNewCustModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowNewCustModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <UserPlus size={20} color="var(--brand-accent)" />
                <span>Register New Customer Account</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowNewCustModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCustomer}>
              <div className="modal-dialog-body">
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Company / Legal Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={newCustForm.company}
                      onChange={e => setNewCustForm({ ...newCustForm, company: e.target.value })}
                      placeholder="e.g. Larsen & Toubro Hazira"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer GSTIN</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                      value={newCustForm.gstin}
                      onChange={e => setNewCustForm({ ...newCustForm, gstin: e.target.value.toUpperCase() })}
                      placeholder="e.g. 24AAACG1234F1Z5"
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newCustForm.name}
                      onChange={e => setNewCustForm({ ...newCustForm, name: e.target.value })}
                      placeholder="Person name..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newCustForm.phone}
                      onChange={e => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                      placeholder="e.g. 9825012345"
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={newCustForm.email}
                      onChange={e => setNewCustForm({ ...newCustForm, email: e.target.value })}
                      placeholder="accounts@company.com"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Billing / Delivery Address</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={newCustForm.address}
                    onChange={e => setNewCustForm({ ...newCustForm, address: e.target.value })}
                    placeholder="GIDC Estate, City, State, PIN"
                  />
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowNewCustModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={savingCust}>
                  <Check size={16} /><span>{savingCust ? 'Saving...' : 'Save Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// ─── DEDICATED INVOICE PRINT PAGE (GST TAX INVOICE FORMAT) ───
export function InvoicePrintPage({ invoice, activeBranch, currentUser, currentTenant, onBack, onEdit }) {
  if (!invoice) return null;

  // ── Multi-Tenant Company Profile Resolver ──
  const COMPANY_PROFILES = {
    comp_mann: {
      name: 'MANN ENGINEERS',
      legalName: 'Mann Engineers Fire Safety Pvt Ltd',
      subline: 'Precision Engineering & Industrial Solutions Provider',
      address: 'Plot No. 42/B, Phase-II, GIDC Industrial Estate, Halol - 389350, Gujarat, India',
      city: 'Halol / Vadodara',
      phone: '+91 98250 12345 / 02676 220199',
      email: 'billing@mannengineers.com',
      website: 'www.mannengineers.com',
      gstin: '24AABCM8920C1ZP',
      state: 'Gujarat',
      stateCode: '24',
      bankName: 'HDFC Bank Ltd',
      accountName: 'Mann Engineers Pvt Ltd',
      accountNo: '50200045892147',
      ifsc: 'HDFC0001042',
      bankBranch: 'GIDC Halol Main Branch'
    },
    comp_mashtech: {
      name: 'MASH TECH',
      legalName: 'Mash Tech Solutions Pvt Ltd',
      subline: 'Enterprise Tech & Industrial Automation Solutions',
      address: 'Tower B, 4th Floor, Infotech Park, Anand - 388001, Gujarat, India',
      city: 'Anand',
      phone: '+91 98790 54321 / 02692 230455',
      email: 'billing@mashtech.in',
      website: 'www.mashtech.in',
      gstin: '24AABCM9988T1Z9',
      state: 'Gujarat',
      stateCode: '24',
      bankName: 'ICICI Bank Ltd',
      accountName: 'Mash Tech Solutions Pvt Ltd',
      accountNo: '002405018992',
      ifsc: 'ICIC0000024',
      bankBranch: 'Infotech Park Branch, Anand'
    }
  };

  // Determine active company from invoice, branch, user, or tenant
  const branchCode = invoice.branchCode || activeBranch?.code || '';
  const isMash =
    invoice.companyId === 'comp_mashtech' ||
    activeBranch?.companyId === 'comp_mashtech' ||
    currentUser?.companyId === 'comp_mashtech' ||
    currentUser?.company_id === 'comp_mashtech' ||
    (currentUser?.companyName && currentUser.companyName.toLowerCase().includes('mash')) ||
    (currentTenant?.id === 'comp_mashtech') ||
    (currentTenant?.name && currentTenant.name.toLowerCase().includes('mash')) ||
    Boolean(branchCode.startsWith('AND') || branchCode.startsWith('SRU'));

  const baseProfile = isMash ? COMPANY_PROFILES.comp_mashtech : COMPANY_PROFILES.comp_mann;

  // Header Company Branding:
  const headerCompanyName = isMash ? 'MASH TECH' : 'MANN ENGINEERS';
  const headerSubline = baseProfile.subline;
  const headerAddress = baseProfile.address;
  const headerPhone = baseProfile.phone;
  const headerEmail = baseProfile.email;
  const headerWebsite = baseProfile.website;
  const headerGstin = baseProfile.gstin;
  const headerState = baseProfile.state;
  const headerStateCode = baseProfile.stateCode;
  const headerCity = baseProfile.city;

  const bankName = baseProfile.bankName;
  const bankAccountName = baseProfile.accountName;
  const bankAccountNo = baseProfile.accountNo;
  const bankIfsc = baseProfile.ifsc;
  const bankBranch = baseProfile.bankBranch;

  const invNo = invoice.invoiceNo || invoice.no || '1';
  const custName = invoice.customerName || invoice.customer || 'Walk-in Customer';
  const custPhone = invoice.customerPhone || invoice.phone || '';
  const custEmail = invoice.customerEmail || invoice.email || '';
  const custAddress = invoice.customerAddress || invoice.address || 'Local Customer Address';
  const custGstin = invoice.customerGstin || invoice.gstin || 'URP';
  const contactPerson = invoice.contactPerson || '';

  const invDate = invoice.date || (invoice.rawDate ? new Date(invoice.rawDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '23 Oct 2026');
  const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : invDate;
  const paymentMode = invoice.payment || invoice.paymentMode || 'Cash';
  const refNo = invoice.referenceNo || '-';

  const lineItems = Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0
    ? invoice.lineItems
    : [
      {
        id: 1,
        name: 'Industrial Spare Parts / Assembly Component',
        hsn: '8481',
        qty: invoice.items || 1,
        unit: 'NOS',
        price: invoice.subtotal || invoice.totalNum || 1000,
        discount: 0,
        effectivePrice: invoice.subtotal || invoice.totalNum || 1000,
        taxRate: 18,
        taxAmount: invoice.totalTax || Math.round((invoice.subtotal || 1000) * 0.18),
        subtotal: invoice.subtotal || invoice.totalNum || 1000
      }
    ];

  const subtotal = typeof invoice.subtotal === 'number' && invoice.subtotal > 0
    ? invoice.subtotal
    : (parseFloat(String(invoice.taxable || '').replace(/[^\d.]/g, '')) || lineItems.reduce((s, it) => s + (parseFloat(it.subtotal) || 0), 0));
  const totalTax = typeof invoice.totalTax === 'number' && invoice.totalTax > 0
    ? invoice.totalTax
    : (parseFloat(String(invoice.gst || '').replace(/[^\d.]/g, '')) || lineItems.reduce((s, it) => s + (parseFloat(it.taxAmount) || 0), 0));
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;
  const discountAmount = parseFloat(invoice.discountAmount) || 0;
  const roundOff = parseFloat(invoice.roundOff) || 0;
  const grandTotal = typeof invoice.totalNum === 'number' && invoice.totalNum > 0
    ? invoice.totalNum
    : (parseFloat(String(invoice.total || '').replace(/[^\d.]/g, '')) || (subtotal + totalTax - discountAmount + roundOff));

  // Helper: Indian currency to words
  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const n = Math.floor(Math.abs(num));
    if (n === 0) return 'Rupees Zero Only';
    const makeWords = (val) => {
      if (val < 20) return a[val];
      if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : '');
      if (val < 1000) return a[Math.floor(val / 100)] + ' Hundred' + (val % 100 !== 0 ? ' and ' + makeWords(val % 100) : '');
      if (val < 100000) return makeWords(Math.floor(val / 1000)) + ' Thousand' + (val % 1000 !== 0 ? ' ' + makeWords(val % 1000) : '');
      if (val < 10000000) return makeWords(Math.floor(val / 100000)) + ' Lakh' + (val % 100000 !== 0 ? ' ' + makeWords(val % 100000) : '');
      return makeWords(Math.floor(val / 10000000)) + ' Crore' + (val % 10000000 !== 0 ? ' ' + makeWords(val % 10000000) : '');
    };
    return 'Rupees ' + makeWords(n) + ' Only';
  };

  return (
    <div className="invoice-print-wrapper animate-fade-in">
      {/* ── TOP ACTION BAR (Hidden in print) ── */}
      <div className="print-action-bar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button type="button" className="secondary-action-btn" onClick={onBack}>
            <ArrowLeft size={16} /><span>Back to Invoices</span>
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Viewing Printable Tax Invoice: <strong style={{ color: 'var(--text-primary)' }}>{invNo}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {onEdit && (
            <button type="button" className="secondary-action-btn" onClick={() => onEdit(invoice)}>
              <Edit3 size={15} /><span>Edit Invoice</span>
            </button>
          )}
          <button type="button" className="primary-action-btn" onClick={() => window.print()}>
            <Printer size={16} /><span>Print Invoice / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* ── TAX INVOICE A4 SHEET ── */}
      <div className="printable-tax-invoice">
        <div className="pti-body-wrap">
          {/* Header */}
          <div className="pti-header">
            <div className="pti-company-info">
              <h1 className="pti-company-name">{headerCompanyName}</h1>
              <div className="pti-subline">{headerSubline}</div>
              <div className="pti-address">
                {headerAddress}<br />
                <strong>Branch:</strong> {activeBranch.name} ({activeBranch.code}) | <strong>Phone:</strong> {headerPhone}<br />
                <strong>Email:</strong> {headerEmail} | <strong>Website:</strong> {headerWebsite}<br />
                <strong>GSTIN:</strong> {headerGstin} | <strong>State:</strong> {headerState} (Code: {headerStateCode})
              </div>
            </div>
            <div className="pti-badge-box">
              <div className="pti-tax-title">TAX INVOICE</div>
              <div className="pti-tax-subtitle">(Original for Recipient)</div>
              <div className="pti-inv-no-badge">{invNo}</div>
            </div>
          </div>

          {/* Invoice & Customer Meta Grid */}
          <div className="pti-meta-grid">
            <div className="pti-meta-col">
              <div className="pti-col-title">INVOICE DETAILS</div>
              <table className="pti-meta-table">
                <tbody>
                  <tr><td>Invoice No:</td><td><strong>{invNo}</strong></td></tr>
                  <tr><td>Invoice Date:</td><td>{invDate}</td></tr>
                  <tr><td>Due Date:</td><td>{dueDate}</td></tr>
                  <tr><td>Payment Mode:</td><td><span className="pti-chip">{paymentMode}</span></td></tr>
                  <tr><td>Ref / PO No:</td><td>{refNo}</td></tr>
                  <tr><td>Place of Supply:</td><td>Gujarat (24)</td></tr>
                </tbody>
              </table>
            </div>

            <div className="pti-meta-col">
              <div className="pti-col-title">BILLED TO (CUSTOMER DETAILS)</div>
              <table className="pti-meta-table">
                <tbody>
                  <tr><td>Customer Name:</td><td><strong>{custName}</strong></td></tr>
                  {contactPerson && <tr><td>Contact Person:</td><td>{contactPerson}</td></tr>}
                  <tr><td>Billing Address:</td><td>{custAddress}</td></tr>
                  {custPhone && <tr><td>Phone:</td><td>{custPhone}</td></tr>}
                  {custEmail && <tr><td>Email:</td><td>{custEmail}</td></tr>}
                  <tr><td>Customer GSTIN:</td><td><strong style={{ color: '#0f766e' }}>{custGstin}</strong></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="pti-items-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>#</th>
                <th style={{ width: '38%' }}>Description of Goods / Services</th>
                <th style={{ width: '10%' }}>HSN/SAC</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Qty</th>
                <th style={{ width: '7%', textAlign: 'center' }}>Unit</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Tax %</th>
                <th style={{ width: '13%', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((it, idx) => {
                const qty = parseFloat(it.qty) || 1;
                const rate = parseFloat(it.price || it.effectivePrice || it.unitPrice) || 0;
                const taxR = parseFloat(it.taxRate) || 18;
                const lineSub = parseFloat(it.subtotal) || (qty * rate);
                const lineTax = parseFloat(it.taxAmount) || (lineSub * taxR / 100);
                const lineTot = Math.round((lineSub + lineTax) * 100) / 100;
                return (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td>
                      <strong>{it.name || it.itemName || 'Industrial Product Component'}</strong>
                      {it.itemCode && it.itemCode !== 'CUSTOM' && <div className="pti-item-code">SKU: {it.itemCode}</div>}
                      {it.remark && <div className="pti-item-remark">{it.remark}</div>}
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>{it.hsn || it.hsnCode || '8481'}</td>
                    <td style={{ textAlign: 'right' }}>{qty}</td>
                    <td style={{ textAlign: 'center' }}>{it.unit || 'NOS'}</td>
                    <td style={{ textAlign: 'right' }}>₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'right' }}>{taxR}%</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{lineTot.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pti-footer-wrap">
          {/* Calculation & Summary Footer */}
          <div className="pti-summary-grid">
            <div className="pti-summary-left">
              <div className="pti-amount-words">
                <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Total Amount in Words:</span>
                <div style={{ fontWeight: 700, color: '#111827', marginTop: '2px' }}>{numberToWords(grandTotal)}</div>
              </div>

              <div className="pti-bank-details">
                <div className="pti-section-label">Bank Details for RTGS / NEFT / IMPS Transfer:</div>
                <table className="pti-bank-table">
                  <tbody>
                    <tr><td>Bank Name:</td><td><strong>{bankName}</strong></td></tr>
                    <tr><td>Account Name:</td><td><strong>{bankAccountName}</strong></td></tr>
                    <tr><td>Account No:</td><td><strong>{bankAccountNo}</strong> (Current A/c)</td></tr>
                    <tr><td>IFSC Code:</td><td><strong>{bankIfsc}</strong></td></tr>
                    <tr><td>Branch:</td><td>{bankBranch}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pti-terms">
                <div className="pti-section-label">Terms & Conditions:</div>
                <ol>
                  <li>Goods once sold will not be accepted back or exchanged under any circumstances.</li>
                  <li>Interest @ 18% per annum will be charged on all delayed bills past the credit terms.</li>
                  <li>Any dispute arising from this invoice is strictly subject to {headerCity} jurisdiction.</li>
                </ol>
              </div>
            </div>

            <div className="pti-summary-right">
              <table className="pti-calc-table">
                <tbody>
                  <tr>
                    <td>Taxable Value:</td>
                    <td style={{ textAlign: 'right' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>CGST (9%):</td>
                    <td style={{ textAlign: 'right' }}>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>SGST (9%):</td>
                    <td style={{ textAlign: 'right' }}>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  {discountAmount > 0 && (
                    <tr>
                      <td>Special Discount:</td>
                      <td style={{ textAlign: 'right', color: '#16a34a' }}>- ₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  {roundOff !== 0 && (
                    <tr>
                      <td>Round Off:</td>
                      <td style={{ textAlign: 'right' }}>₹{roundOff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  <tr className="pti-grand-total-row">
                    <td><strong>GRAND TOTAL (₹):</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pti-sign-box">
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>For <strong>{headerCompanyName}</strong></div>
                <div className="pti-signature-line">
                  <div style={{ height: '50px' }}></div>
                  <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '4px', fontSize: '0.78rem', color: '#374151' }}>
                    Authorized Signatory / Seal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="pti-footer-note">
            This is a computer-generated tax invoice verified under Section 31 of the CGST Act 2017. E. & O.E.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── POS BILLING ──────────────────────────────────────────────────────
export function BranchPOS({ activeBranch }) {
  const [invoices, setInvoices] = useState([]);

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'create'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch live invoices from PostgreSQL table 'invoices'
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`/api/invoices?branch=${encodeURIComponent(activeBranch.code)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setInvoices(json.data);
        }
      } catch (err) {
        console.warn('Failed to fetch invoices from PostgreSQL:', err);
      }
    };
    fetchInvoices();
  }, [activeBranch.code]);

  const handleExportInvoices = () => {
    const headers = ['Invoice #', 'Customer', 'Items', 'Total Amount', 'Payment Mode', 'Status', 'Date'];
    const rows = [
      headers,
      ...invoices.map(inv => [inv.no || inv.invoiceNo, inv.customer || inv.customerName, inv.items, inv.total, inv.payment, inv.status, inv.date])
    ];
    downloadCSV(`Invoices_${activeBranch.code}.csv`, rows);
    showToast('Invoices exported to CSV successfully!');
  };

  const filteredInvoices = invoices.filter(inv =>
    (inv.no || inv.invoiceNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.customer || inv.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.payment || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { paginatedItems: pagedInvoices, paginationProps: posPagination } = useTablePagination(filteredInvoices, 10);

  const todayRevenue = invoices.reduce((sum, inv) => sum + (inv.totalNum || 0), 0);

  // If in 'create' viewMode, redirect to full CreateInvoicePage
  if (viewMode === 'create') {
    return (
      <CreateInvoicePage
        activeBranch={activeBranch}
        onBack={() => setViewMode('list')}
        onCreated={(newInv) => {
          setInvoices(prev => [newInv, ...prev]);
          setViewMode('list');
          showToast(`Invoice ${newInv.no || newInv.invoiceNo} posted to branch journal!`);
        }}
      />
    );
  }

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">POS Counter Billing</h2>
          <p className="page-desc">Real-time point-of-sale with barcode scan, GST-compliant invoicing, and multi-payment modes at {activeBranch.name}.</p>
        </div>
        <button className="primary-action-btn" onClick={() => setViewMode('create')}>
          <Plus size={16} /><span>New Invoice</span>
        </button>
      </div>

      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Today's Invoices</span><div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Receipt size={18} /></div></div>
          <div className="stat-value">{invoices.length}</div>
          <div className="stat-change positive"><TrendingUp size={13} /><span>PostgreSQL Synced</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Today's Revenue</span><div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><DollarSign size={18} /></div></div>
          <div className="stat-value">₹{(todayRevenue / 100000).toFixed(2)}L</div>
          <div className="stat-change positive"><TrendingUp size={13} /><span>Total ₹{todayRevenue.toLocaleString('en-IN')}</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">GST Collected</span><div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><Percent size={18} /></div></div>
          <div className="stat-value">₹{Math.round(todayRevenue * 0.18 / 1.18).toLocaleString('en-IN')}</div>
          <div className="stat-change positive"><span>CGST + SGST</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header"><span className="stat-label">Avg Invoice Value</span><div className="stat-icon-circle" style={{ background: '#f59e0b20', color: '#f59e0b' }}><BarChart3 size={18} /></div></div>
          <div className="stat-value">₹{invoices.length ? Math.round(todayRevenue / invoices.length).toLocaleString('en-IN') : 0}</div>
          <div className="stat-change positive"><TrendingUp size={13} /><span>Per billing ticket</span></div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <h3 className="dash-panel-title">Recent Invoices</h3>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '180px' }}>
              <Search size={14} />
              <input
                placeholder="Search invoices..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="secondary-action-btn" onClick={handleExportInvoices}>
              <Download size={14} /><span>Export</span>
            </button>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Invoice #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {pagedInvoices.map((inv, i) => (
                <tr key={i}>
                  <td><span className="mono-badge">{inv.no || inv.invoiceNo}</span></td>
                  <td className="td-bold">{inv.customer || inv.customerName}</td>
                  <td>{inv.items}</td>
                  <td className="td-money">{inv.total}</td>
                  <td><span className="type-tag">{inv.payment}</span></td>
                  <td><span className="status-badge active">{inv.status}</span></td>
                  <td className="td-sub">{inv.date || 'Today'}</td>
                  <td>
                    <button className="table-action-btn" onClick={() => setViewingInvoice(inv)}>
                      <Eye size={14} /><span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination {...posPagination} />
        </div>
      </div>

      {/* VIEW INVOICE DETAILS MODAL */}
      {viewingInvoice && (
        <div className="modal-backdrop-overlay" onClick={() => setViewingInvoice(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Receipt size={20} color="var(--brand-accent)" />
                <span>Invoice {viewingInvoice.no || viewingInvoice.invoiceNo} Details</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setViewingInvoice(null)}><X size={18} /></button>
            </div>
            <div className="modal-dialog-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px' }}>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer:</span> <div style={{ fontWeight: '600' }}>{viewingInvoice.customer || viewingInvoice.customerName}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span> <div><span className="status-badge active">{viewingInvoice.status}</span></div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Mode:</span> <div><span className="type-tag">{viewingInvoice.payment}</span></div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount:</span> <div style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>{viewingInvoice.total}</div></div>
                {viewingInvoice.phone && <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone:</span> <div>{viewingInvoice.phone}</div></div>}
                {viewingInvoice.gstin && <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTIN:</span> <div>{viewingInvoice.gstin}</div></div>}
              </div>

              {/* Line items if available */}
              {viewingInvoice.lineItems && viewingInvoice.lineItems.length > 0 && (
                <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>Invoice Line Items</h4>
                  <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                        <th style={{ padding: '0.4rem' }}>Item</th>
                        <th style={{ padding: '0.4rem' }}>Qty</th>
                        <th style={{ padding: '0.4rem' }}>Rate</th>
                        <th style={{ padding: '0.4rem' }}>Tax</th>
                        <th style={{ padding: '0.4rem', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingInvoice.lineItems.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.4rem' }}><strong>{it.name}</strong> <span style={{ color: 'var(--brand-accent)', fontSize: '0.7rem' }}>({it.itemCode})</span></td>
                          <td style={{ padding: '0.4rem' }}>{it.qty} {it.unit}</td>
                          <td style={{ padding: '0.4rem' }}>₹{it.price}</td>
                          <td style={{ padding: '0.4rem' }}>{it.taxRate}%</td>
                          <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '600' }}>₹{it.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tax & Total Breakdown</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span>Taxable Value:</span>
                  <span>₹{viewingInvoice.subtotal ? viewingInvoice.subtotal.toLocaleString('en-IN') : Math.round(viewingInvoice.totalNum / 1.18).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span>GST Amount:</span>
                  <span>₹{viewingInvoice.totalTax ? viewingInvoice.totalTax.toLocaleString('en-IN') : Math.round(viewingInvoice.totalNum * 0.18 / 1.18).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '700', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: 'var(--brand-accent)' }}>{viewingInvoice.total}</span>
                </div>
              </div>
            </div>
            <div className="modal-dialog-footer">
              <button
                type="button"
                className="secondary-action-btn"
                onClick={() => {
                  window.print();
                  showToast(`Invoice ${viewingInvoice.no || viewingInvoice.invoiceNo} opened for print.`);
                }}
              >
                <Printer size={14} /><span>Print Slip</span>
              </button>
              <button
                type="button"
                className="primary-action-btn"
                onClick={() => {
                  const headers = ['Field', 'Value'];
                  const rows = [
                    headers,
                    ['Invoice No', viewingInvoice.no || viewingInvoice.invoiceNo],
                    ['Customer', viewingInvoice.customer || viewingInvoice.customerName],
                    ['Payment Mode', viewingInvoice.payment],
                    ['Items', viewingInvoice.items],
                    ['Grand Total', viewingInvoice.total]
                  ];
                  downloadCSV(`Invoice_${viewingInvoice.no || viewingInvoice.invoiceNo}.csv`, rows);
                  showToast(`Invoice ${viewingInvoice.no || viewingInvoice.invoiceNo} downloaded.`);
                }}
              >
                <Download size={14} /><span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── INVENTORY ────────────────────────────────────────────────────────
export function BranchInventory({ activeBranch }) {
  // 18-column inventory state (synchronized with PostgreSQL table "product")
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbSource, setDbSource] = useState('Connecting to PostgreSQL (bizzpilot)...');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isCustomSubAdd, setIsCustomSubAdd] = useState(false);
  const [isCustomSubEdit, setIsCustomSubEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [labelProduct, setLabelProduct] = useState(null);
  const [dbCategories, setDbCategories] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Fetch live inventory from PostgreSQL "product" table and master categories
  const fetchProductsFromDb = async () => {
    setLoading(true);
    const branchCode = activeBranch?.code || 'AMD-01';
    const companyId = activeBranch?.companyId || activeBranch?.company_id || (branchCode.startsWith('AND') || branchCode.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');
    try {
      const res = await fetch(`/api/inventory?branch=${encodeURIComponent(branchCode)}&companyId=${encodeURIComponent(companyId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setProducts(json.data);
        setDbConnected(true);
        setDbSource(`PostgreSQL: bizzpilot (table: product | company: ${companyId})`);
      } else if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
        setDbConnected(true);
        setDbSource(`PostgreSQL: bizzpilot (table: product - 0 rows)`);
      }
    } catch (err) {
      console.warn('Failed to reach backend PostgreSQL, falling back to local dataset:', err);
      setDbConnected(false);
      setDbSource('Offline / Local Cache');
    }

    try {
      const catRes = await fetch('/api/cat-sub');
      const catJson = await catRes.json();
      if (catJson.success && Array.isArray(catJson.data)) {
        setDbCategories(catJson.data);
      }
    } catch (err) {
      console.warn('Failed to load cat_sub entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsFromDb();
  }, [activeBranch?.code, activeBranch?.companyId, activeBranch?.company_id]);

  // Master Categories list for Dropdowns
  const allAvailableCategories = useMemo(() => {
    const defaultCats = [
      'Fire Extinguishers',
      'PPE & Safety Gear',
      'First Aid & Emergency',
      'Smoke & Fire Detection',
      'Safety Hardware & Fittings',
      'Fire Blankets',
      'Networking & Structured Cabling',
      'Network Security & Firewalls',
      'Power Backup & UPS',
      'Server Infrastructure & Racks',
      'Electronic Safety & ESD',
      'Optical Safety',
      'Consumables & Commercial Supplies',
      'General'
    ];
    const fromDb = (dbCategories || []).filter(c => c.type === 'category').map(c => c.tittle).filter(Boolean);
    const fromProds = (products || []).map(p => p.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...fromDb, ...fromProds]));
  }, [dbCategories, products]);

  // Download Sample Excel Template matching user format with Excel Formulas
  const handleDownloadSampleTemplate = () => {
    const headers = [
      'Supplier',
      'Name',
      'Product Description',
      'Weight (kg)',
      'Category',
      'Sub - Category',
      'PID',
      'HSN/SAC',
      'Current Stock ( Qty )',
      'Minimum Stock Level',
      'Exp Time ( In Month )',
      'Purchase Price',
      'GST',
      'Sale Price',
      'Total Stock Value ( Without Tax )',
      'Total Stock Value ( With Tax )',
      'Exp Time ( In Days )'
    ];

    const sampleRows = [
      {
        supplier: 'FireTech Safety India Pvt Ltd',
        name: 'ABC Dry Powder Fire Ext. 6kg',
        description: 'Stored pressure dry chemical powder fire extinguisher 6kg capacity',
        weight: '9.2 kg',
        category: 'Fire Extinguishers',
        subCategory: 'Powder Extinguisher',
        pid: 'FE-ABC-6',
        hsn: '8424',
        currentStock: 30,
        minStock: 15,
        expMonths: 60,
        purchasePrice: 1450.00,
        gst: 18,
        salePrice: 1711.00,
        totalWithoutTax: 43500.00,
        totalWithTax: 51330.00,
        expDays: 1800
      },
      {
        supplier: 'SafeZone Equipments Ltd',
        name: 'Mechanical Foam Fire Ext. 9L',
        description: 'AFFF mechanical foam extinguisher for Class A and B fires',
        weight: '13.5 kg',
        category: 'Fire Extinguishers',
        subCategory: 'Foam Extinguisher',
        pid: 'FE-FOAM-9',
        hsn: '8424',
        currentStock: 18,
        minStock: 10,
        expMonths: 60,
        purchasePrice: 2100.00,
        gst: 18,
        salePrice: 2478.00,
        totalWithoutTax: 37800.00,
        totalWithTax: 44604.00,
        expDays: 1800
      },
      {
        supplier: 'Karam Safety Products',
        name: 'Safety Helmet Ratchet Type Yellow',
        description: 'ISI certified electrical resistant yellow safety helmet with chin strap',
        weight: '410 g',
        category: 'PPE',
        subCategory: 'Head Protection',
        pid: 'SH-M202',
        hsn: '6506',
        currentStock: 50,
        minStock: 25,
        expMonths: 36,
        purchasePrice: 320.00,
        gst: 18,
        salePrice: 377.60,
        totalWithoutTax: 16000.00,
        totalWithTax: 18880.00,
        expDays: 1080
      },
      {
        supplier: 'MediSafe First Aid Co.',
        name: 'Burn Dressing & Gel Kit',
        description: 'Hydrogel emergency burn relief dressing kit for factory use',
        weight: '650 g',
        category: 'First Aid',
        subCategory: 'Burn Care',
        pid: 'FA-BURN1',
        hsn: '3006',
        currentStock: 25,
        minStock: 10,
        expMonths: 24,
        purchasePrice: 680.00,
        gst: 12,
        salePrice: 761.60,
        totalWithoutTax: 17000.00,
        totalWithTax: 19040.00,
        expDays: 720
      }
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    sampleRows.forEach((row, idx) => {
      const r = idx + 2;
      const rowCells = [
        { t: 's', v: row.supplier },
        { t: 's', v: row.name },
        { t: 's', v: row.description },
        { t: 's', v: row.weight },
        { t: 's', v: row.category },
        { t: 's', v: row.subCategory },
        { t: 's', v: row.pid },
        { t: 's', v: row.hsn },
        { t: 'n', v: row.currentStock },
        { t: 'n', v: row.minStock },
        { t: 'n', v: row.expMonths },
        { t: 'n', v: row.purchasePrice },
        { t: 'n', v: row.gst },
        { t: 'n', f: `ROUND(L${r}*(1+M${r}/100),2)`, v: row.salePrice },
        { t: 'n', f: `ROUND(I${r}*L${r},2)`, v: row.totalWithoutTax },
        { t: 'n', f: `ROUND(I${r}*N${r},2)`, v: row.totalWithTax },
        { t: 'n', f: `K${r}*30`, v: row.expDays }
      ];
      XLSX.utils.sheet_add_aoa(ws, [rowCells], { origin: -1 });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, `Inventory_Template_${activeBranch.code}.xlsx`);
    showToast('Standard Excel template with formula calculations downloaded successfully!');
  };

  // Process selected or dropped Excel / CSV file
  const handleProcessExcelFile = (file) => {
    if (!file) return;
    setUploadError('');
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellFormula: true });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!data || data.length === 0) {
          setUploadError('The selected Excel sheet appears to be empty or contains no records.');
          setParsedPreview([]);
          return;
        }

        const cleanNum = (val, fallback = 0) => {
          if (typeof val === 'number') return isNaN(val) ? fallback : val;
          if (typeof val === 'string') {
            const cleaned = val.replace(/[^0-9.-]/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? fallback : parsed;
          }
          return fallback;
        };

        const getVal = (row, ...keys) => {
          for (const k of keys) {
            if (row[k] !== undefined && row[k] !== '') return row[k];
            const lowerKey = k.toLowerCase().replace(/[\s\-_()]/g, '');
            for (const rk of Object.keys(row)) {
              if (rk.toLowerCase().replace(/[\s\-_()]/g, '') === lowerKey) {
                if (row[rk] !== undefined && row[rk] !== '') return row[rk];
              }
            }
          }
          return '';
        };

        const mapped = data.map((row, idx) => {
          const supplier = (getVal(row, 'Supplier', 'Vendor') || 'General Supplier').toString().trim();
          const name = (getVal(row, 'Name', 'Product Name', 'Item Name', 'Description') || `Product ${idx + 1}`).toString().trim();
          const description = (getVal(row, 'Product Description', 'Description', 'Product Desc') || '').toString().trim();
          const weight = (getVal(row, 'Weight', 'Wt') || '1 kg').toString().trim();
          const category = (getVal(row, 'Category') || 'Fire Extinguishers').toString().trim();
          const subCategory = (getVal(row, 'Sub - Category', 'Sub-Category', 'Sub Category', 'Subcategory') || 'General').toString().trim();
          const pid = (getVal(row, 'PID', 'pid', 'Product ID', 'SKU', 'Item Code', 'Code') || `PRD-${1000 + idx}`).toString().trim().toUpperCase();
          const hsn = (getVal(row, 'HSN/SAC', 'HSN', 'HSN Code', 'SAC') || '8424').toString().trim();

          const currentStock = cleanNum(getVal(row, 'Current Stock ( Qty )', 'Current Stock', 'Stock ( Qty )', 'Quantity', 'Qty', 'Stock'), 0);
          const minStock = cleanNum(getVal(row, 'Minimum Stock Level', 'Min Stock', 'Minimum Stock', 'Reorder Level', 'Reorder'), 10);
          const expMonths = cleanNum(getVal(row, 'Exp Time ( In Month )', 'Exp Time (In Month)', 'Exp Time In Month', 'Exp Months'), 12);
          const rawPP = cleanNum(getVal(row, 'Purchase Price', 'Cost Price', 'Unit Cost', 'Purchase Cost', 'Cost'), 0);
          const rawSP = cleanNum(getVal(row, 'Sale Price', 'Selling Price', 'Sale Rate', 'MRP', 'Price'), 0);
          const gst = cleanNum(getVal(row, 'GST', 'GST Rate', 'Tax %', 'GST %', 'GST(%)'), 18);
          const purchasePrice = rawPP;

          // ── 4 AUTO CALCULATED COLUMNS (USING FORMULAS) ──
          // Formula 1: Sale Price = Purchase Price * (1 + GST/100)
          const salePrice = rawSP > 0 ? rawSP : (purchasePrice > 0 ? Math.round((purchasePrice * (1 + (gst / 100))) * 100) / 100 : 0);

          // Formula 2: Total Stock Value ( Without Tax ) = Current Stock ( Qty ) * Purchase Price
          const rawValWithoutTax = cleanNum(getVal(row, 'Total Stock Value ( Without Tax )', 'Total Stock Value Without Tax', 'Stock Value Without Tax'), 0);
          const totalWithoutTax = rawValWithoutTax > 0 ? rawValWithoutTax : Math.round((currentStock * purchasePrice) * 100) / 100;

          // Formula 3: Total Stock Value ( With Tax ) = Current Stock ( Qty ) * Sale Price
          const rawValWithTax = cleanNum(getVal(row, 'Total Stock Value ( With Tax )', 'Total Stock Value With Tax', 'Stock Value With Tax'), 0);
          const totalWithTax = rawValWithTax > 0 ? rawValWithTax : Math.round((currentStock * salePrice) * 100) / 100;

          // Formula 4: Exp Time ( In Days ) = Exp Time ( In Month ) * 30
          const rawDays = cleanNum(getVal(row, 'Exp Time ( In Days )', 'Exp Time (In Days)', 'Exp Time In Days', 'Exp Days'), 0);
          const expDays = rawDays > 0 ? rawDays : Math.round(expMonths * 30);

          let status = 'OK';
          if (currentStock === 0) status = 'Out';
          else if (currentStock <= 5) status = 'Critical';
          else if (currentStock <= minStock) status = 'Low';

          return {
            supplier,
            name,
            description,
            weight,
            category,
            subCategory,
            pid,
            hsn,
            currentStock,
            minStock,
            expMonths,
            salePrice,
            gst,
            purchasePrice,
            totalWithoutTax,
            totalWithTax,
            expDays,
            status,
            sku: pid,
            qty: currentStock,
            reorder: minStock,
            cost: `₹${purchasePrice.toLocaleString('en-IN')}`,
            value: `₹${totalWithoutTax.toLocaleString('en-IN')}`
          };
        });

        setParsedPreview(mapped);
      } catch (err) {
        console.error('Failed to parse Excel file:', err);
        setUploadError('Unable to parse file. Please upload a valid .xlsx, .xls, or .csv document in the given format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Commit imported items into state and PostgreSQL database
  const handleConfirmImport = async () => {
    if (!parsedPreview.length) return;

    const compId = activeBranch?.companyId || (activeBranch?.code?.startsWith('AND') || activeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');
    const compName = activeBranch?.companyName || (compId === 'comp_mashtech' ? 'Mash Tech' : 'Mann Engineers Fire Safety');

    try {
      const res = await fetch('/api/inventory/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchCode: activeBranch.code,
          companyId: compId,
          items: parsedPreview,
          mode: importMode
        })
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
        showToast(`Successfully saved ${parsedPreview.length} products into ${compName} common database!`);
      } else {
        throw new Error(json.message || 'Server error');
      }
    } catch (err) {
      console.warn('Postgres bulk import error, falling back to local update:', err);
      if (importMode === 'replace') {
        setProducts(parsedPreview);
        showToast(`Replaced inventory with ${parsedPreview.length} items (offline cache).`);
      } else {
        setProducts(prev => {
          const existingMap = new Map(prev.map(p => [p.pid || p.sku, p]));
          parsedPreview.forEach(newItem => {
            existingMap.set(newItem.pid, newItem);
          });
          return Array.from(existingMap.values());
        });
        showToast(`Merged ${parsedPreview.length} items (offline cache).`);
      }
    }

    setShowUploadModal(false);
    setParsedPreview([]);
    setUploadedFileName('');
  };

  // Stock count audit form
  const [auditSku, setAuditSku] = useState('');
  const [countedStock, setCountedStock] = useState('');

  useEffect(() => {
    if (products.length > 0 && (!auditSku || !products.some(p => (p.pid || p.sku) === auditSku))) {
      setAuditSku(products[0].pid || products[0].sku || '');
    }
  }, [products]);

  // Add Product Form State
  const [formData, setFormData] = useState({
    supplier: 'FireTech Safety India Pvt Ltd',
    name: '',
    description: '',
    weight: '1000',
    category: 'Fire Extinguishers',
    subCategory: 'Powder Extinguisher',
    pid: '',
    barcode: '',
    hsn: '8424',
    currentStock: '20',
    minStock: '10',
    expMonths: '24',
    purchasePrice: '1000',
    gst: '18',
    salePrice: ''
  });

  // Dynamic subcategories for Add and Edit Modals
  const currentSubOptionsAdd = useMemo(() => {
    return getSubCategoriesForCategory(formData.category, products, dbCategories);
  }, [formData.category, products, dbCategories]);

  const currentSubOptionsEdit = useMemo(() => {
    return editingProduct ? getSubCategoriesForCategory(editingProduct.category, products, dbCategories) : [];
  }, [editingProduct?.category, products, dbCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const subs = getSubCategoriesForCategory(value, products, dbCategories);
      setFormData(prev => ({
        ...prev,
        category: value,
        subCategory: subs[0] || 'General'
      }));
      setIsCustomSubAdd(false);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Live Formula Calculations for Add Modal
  const numCurrentStock = parseInt(formData.currentStock) || 0;
  const numMinStock = parseInt(formData.minStock) || 10;
  const numExpMonths = parseFloat(formData.expMonths) || 0;
  const numPurchasePrice = parseFloat(formData.purchasePrice) || 0;
  const numGst = parseFloat(formData.gst) || 0;

  // Formula 1: Sale Price = Purchase Price * (1 + GST/100)
  const liveSalePrice = formData.salePrice !== '' && !isNaN(parseFloat(formData.salePrice))
    ? parseFloat(formData.salePrice)
    : numPurchasePrice > 0
      ? Math.round((numPurchasePrice * (1 + (numGst / 100))) * 100) / 100
      : 0;

  // Formula 2: Total Stock Value (Without Tax) = Current Stock * Purchase Price
  const liveTotalWithoutTax = Math.round((numCurrentStock * numPurchasePrice) * 100) / 100;

  // Formula 3: Total Stock Value (With Tax) = Current Stock * Sale Price
  const liveTotalWithTax = Math.round((numCurrentStock * liveSalePrice) * 100) / 100;

  // Formula 4: Exp Time (In Days) = Exp Months * 30
  const liveExpDays = Math.round(numExpMonths * 30);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    let computedStatus = 'OK';
    if (numCurrentStock === 0) computedStatus = 'Out';
    else if (numCurrentStock <= 5) computedStatus = 'Critical';
    else if (numCurrentStock <= numMinStock) computedStatus = 'Low';

    const cleanPid = (formData.pid.trim() || `PRD-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();
    const cleanBarcode = (formData.barcode.trim() || cleanPid);

    const compId = activeBranch?.companyId || (activeBranch?.code?.startsWith('AND') || activeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');
    const compName = activeBranch?.companyName || (compId === 'comp_mashtech' ? 'Mash Tech' : 'Mann Engineers Fire Safety');

    const newProduct = {
      supplier: formData.supplier.trim() || 'General Supplier',
      name: formData.name.trim(),
      description: formData.description.trim(),
      weight: (() => {
        const rawW = formData.weight.trim();
        const numG = parseFloat(rawW.replace(/[^0-9.]/g, ''));
        return !isNaN(numG) ? `${numG} g` : (rawW || '1000 g');
      })(),
      category: formData.category,
      subCategory: formData.subCategory.trim() || 'General',
      pid: cleanPid,
      barcode: cleanBarcode,
      hsn: formData.hsn.trim() || '8424',
      currentStock: numCurrentStock,
      minStock: numMinStock,
      expMonths: numExpMonths,
      purchasePrice: numPurchasePrice,
      gst: numGst,
      salePrice: liveSalePrice,
      totalWithoutTax: liveTotalWithoutTax,
      totalWithTax: liveTotalWithTax,
      expDays: liveExpDays,
      status: computedStatus,
      sku: cleanPid,
      qty: numCurrentStock,
      reorder: numMinStock,
      cost: `₹${numPurchasePrice.toLocaleString('en-IN')}`,
      value: `₹${liveTotalWithoutTax.toLocaleString('en-IN')}`,
      branchCode: activeBranch.code,
      companyId: compId
    };

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProducts(prev => [json.data, ...prev.filter(p => p.pid !== json.data.pid)]);
        showToast(`Product "${newProduct.name}" (${newProduct.pid}) added to ${compName} common inventory!`);
      } else {
        setProducts(prev => [newProduct, ...prev]);
        showToast(`Product "${newProduct.name}" saved locally.`);
      }
    } catch (err) {
      console.warn('Postgres insert error, updating local state:', err);
      setProducts(prev => [newProduct, ...prev]);
      showToast(`Product "${newProduct.name}" added locally.`);
    }

    setShowAddModal(false);
    setFormData({
      supplier: 'FireTech Safety India Pvt Ltd',
      name: '',
      description: '',
      weight: '1000',
      category: 'Fire Extinguishers',
      subCategory: 'Powder Extinguisher',
      pid: '',
      barcode: '',
      hsn: '8424',
      currentStock: '20',
      minStock: '10',
      expMonths: '24',
      purchasePrice: '1000',
      gst: '18',
      salePrice: ''
    });
  };

  const handleApplyCount = async (e) => {
    e.preventDefault();
    const countVal = parseInt(countedStock);
    if (isNaN(countVal)) return;

    try {
      const res = await fetch('/api/inventory/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchCode: activeBranch.code,
          companyId: activeBranch.companyId || activeBranch.company_id,
          pid: auditSku,
          countVal
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProducts(prev => prev.map(p => (p.pid === auditSku ? json.data : p)));
        showToast(`Physical count audit saved to PostgreSQL! Product ${auditSku} updated to ${countVal} units.`);
      } else {
        throw new Error(json.message || 'Audit update failed');
      }
    } catch (err) {
      console.warn('Postgres audit update error, applying locally:', err);
      setProducts(prev => prev.map(p => {
        if ((p.pid || p.sku) === auditSku) {
          let computedStatus = 'OK';
          if (countVal === 0) computedStatus = 'Out';
          else if (countVal <= 5) computedStatus = 'Critical';
          else if (countVal <= (p.minStock ?? p.reorder ?? 10)) computedStatus = 'Low';

          const pp = p.purchasePrice ?? 0;
          const totalWithoutTax = Math.round((countVal * pp) * 100) / 100;
          const totalWithTax = Math.round((totalWithoutTax * (1 + (p.gst ?? 18) / 100)) * 100) / 100;

          return {
            ...p,
            currentStock: countVal,
            qty: countVal,
            totalWithoutTax,
            totalWithTax,
            value: `₹${totalWithoutTax.toLocaleString('en-IN')}`,
            status: computedStatus
          };
        }
        return p;
      }));
      showToast(`Physical count audit posted! Product ${auditSku} updated to ${countVal} units.`);
    }

    setShowCountModal(false);
    setCountedStock('');
  };

  const handleExportInventory = () => {
    const headers = [
      'Supplier',
      'Name',
      'Product Description',
      'Weight (kg)',
      'Category',
      'Sub - Category',
      'PID',
      'HSN/SAC',
      'Current Stock ( Qty )',
      'Minimum Stock Level',
      'Exp Time ( In Month )',
      'Purchase Price',
      'GST',
      'Sale Price',
      'Total Stock Value ( Without Tax )',
      'Total Stock Value ( With Tax )',
      'Exp Time ( In Days )'
    ];
    const rows = [
      headers,
      ...products.map(p => [
        p.supplier || '',
        p.name || '',
        p.description || '',
        formatWeightInKg(p.weight),
        p.category || '',
        p.subCategory || '',
        p.pid || p.sku || '',
        p.hsn || '',
        p.currentStock ?? p.qty ?? 0,
        p.minStock ?? p.reorder ?? 10,
        p.expMonths ?? 12,
        p.purchasePrice ?? 0,
        p.gst ?? 18,
        p.salePrice ?? 0,
        p.totalWithoutTax ?? 0,
        p.totalWithTax ?? 0,
        p.expDays ?? 0
      ])
    ];
    downloadCSV(`Inventory_${activeBranch.code}.csv`, rows);
    showToast('Inventory exported to CSV successfully in standard format!');
  };

  // Handle Edit Product Submit
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const numCurStock = parseInt(editingProduct.currentStock) || 0;
    const numMinStk = parseInt(editingProduct.minStock) || 10;
    const numExpMo = parseFloat(editingProduct.expMonths) || 12;
    const numPP = parseFloat(editingProduct.purchasePrice) || 0;
    const numG = parseFloat(editingProduct.gst) || 18;
    const rawSP = parseFloat(editingProduct.salePrice) || 0;
    const calcSP = rawSP > 0 ? rawSP : Math.round(numPP * (1 + numG / 100) * 100) / 100;
    const calcWithoutTax = Math.round(numCurStock * numPP * 100) / 100;
    const calcWithTax = Math.round(numCurStock * calcSP * 100) / 100;
    const calcExpDays = Math.round(numExpMo * 30);

    let compStatus = 'OK';
    if (numCurStock === 0) compStatus = 'Out';
    else if (numCurStock <= 5) compStatus = 'Critical';
    else if (numCurStock <= numMinStk) compStatus = 'Low';

    const updatedItem = {
      ...editingProduct,
      weight: (() => {
        const rawW = String(editingProduct.weight || '').trim();
        const numG = parseFloat(rawW.replace(/[^0-9.]/g, ''));
        return !isNaN(numG) ? `${numG} g` : (rawW || '1000 g');
      })(),
      currentStock: numCurStock,
      minStock: numMinStk,
      expMonths: numExpMo,
      purchasePrice: numPP,
      gst: numG,
      salePrice: calcSP,
      totalWithoutTax: calcWithoutTax,
      totalWithTax: calcWithTax,
      expDays: calcExpDays,
      status: compStatus,
      cost: `₹${numPP.toLocaleString('en-IN')}`,
      value: `₹${calcWithoutTax.toLocaleString('en-IN')}`,
      branchCode: activeBranch.code,
      companyId: activeBranch.companyId || (activeBranch.code.startsWith('AND') || activeBranch.code.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann')
    };

    try {
      const res = await fetch(`/api/inventory/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? json.data : p));
        showToast(`Product "${updatedItem.name}" updated in PostgreSQL database!`);
      } else {
        throw new Error(json.message || 'Update failed');
      }
    } catch (err) {
      console.warn('Postgres update error, applying locally:', err);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedItem : p));
      showToast(`Product "${updatedItem.name}" updated locally.`);
    }

    setEditingProduct(null);
  };

  // Handle Delete Product Confirm
  const handleDeleteProductConfirm = async () => {
    if (!deletingProduct) return;

    try {
      const res = await fetch(`/api/inventory/${deletingProduct.id}?branch=${encodeURIComponent(activeBranch.code)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
        showToast(`Product "${deletingProduct.name}" removed from PostgreSQL database.`);
      } else {
        throw new Error(json.message || 'Delete failed');
      }
    } catch (err) {
      console.warn('Postgres delete error, applying locally:', err);
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      showToast(`Product "${deletingProduct.name}" removed locally.`);
    }

    setDeletingProduct(null);
  };

  // Handle Quick Reorder using Reorder Point (ROP)
  const handleQuickReorder = (prod) => {
    const arch = computeInventoryArchitectureMetrics(prod);
    const recommendedQty = Math.max(arch.rop - arch.availableStock, 20);
    showToast(`🛒 Reorder PO Draft created for ${prod.name}! ${recommendedQty} units requested from ${prod.supplier || 'Supplier'}. (${arch.replenishment.primaryAction})`);
  };

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const uniqueSubCategories = ['All', ...new Set(
    products
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .map(p => p.subCategory)
      .filter(Boolean)
  )];

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (p.name || '').toLowerCase().includes(q) ||
      (p.pid || p.sku || '').toLowerCase().includes(q) ||
      (p.barcode || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.subCategory || '').toLowerCase().includes(q) ||
      (p.supplier || '').toLowerCase().includes(q) ||
      (p.hsn || '').toLowerCase().includes(q)
    );
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory;
    const matchesStatus = selectedStatus === 'All'
      ? true
      : selectedStatus === 'Low'
        ? (p.status === 'Low' || p.status === 'Critical')
        : p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
  });

  const { paginatedItems: pagedProducts, paginationProps: inventoryPagination } = useTablePagination(filteredProducts, 10);

  const totalStockUnits = products.reduce((acc, p) => acc + (p.currentStock ?? p.qty ?? 0), 0);
  const totalValWithoutTax = products.reduce((acc, p) => acc + (p.totalWithoutTax ?? 0), 0);
  const totalValWithTax = products.reduce((acc, p) => acc + (p.totalWithTax ?? 0), 0);
  const lowStockCount = products.filter(p => p.status === 'Low' || p.status === 'Critical').length;
  const outOfStockCount = products.filter(p => p.status === 'Out').length;

  return (
    <div className="branch-inventory-container animate-fade-in">
      {/* Page Header with balanced actions */}
      <div className="branch-inventory-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Branch Inventory</h2>
            <span className="mono-badge" style={{ background: 'rgba(2, 132, 199, 0.18)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', fontWeight: 700, fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
              📦 Common Items Catalog • Branch-Specific Stock
            </span>
          </div>
          <p className="page-desc">
            Common company product catalog with live stock balances tracked individually for {activeBranch.name}.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button className="secondary-action-btn" onClick={fetchProductsFromDb} title="Sync with PostgreSQL database">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /><span>{loading ? 'Syncing...' : 'Sync DB'}</span>
          </button>
          <button className="secondary-action-btn" onClick={() => setShowUploadModal(true)} title="Upload inventory via Excel">
            <FileSpreadsheet size={15} color="var(--brand-accent)" /><span>Upload Excel</span>
          </button>
          <button className="secondary-action-btn" onClick={() => setShowCountModal(true)}>
            <RefreshCw size={14} /><span>Stock Count</span>
          </button>
          <button className="primary-action-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /><span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Even 4-Column Balanced Stats Grid */}
      <div className="branch-inventory-stats-grid">
        <div className="inventory-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Products</span>
            <div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Package size={18} /></div>
          </div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-change positive"><span>{totalStockUnits} Physical Units</span></div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Stock Value (Without Tax)</span>
            <div className="stat-icon-circle" style={{ background: '#8b5cf620', color: '#a78bfa' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">₹{totalValWithoutTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="stat-change positive"><span className="formula-badge">fx</span><span>Qty × Purchase Price</span></div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Stock Value (With Tax)</span>
            <div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">₹{totalValWithTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="stat-change positive"><span className="formula-badge">fx</span><span>Qty × Sale Price</span></div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Stock Alerts</span>
            <div className="stat-icon-circle" style={{ background: '#ef444420', color: '#ef4444' }}><AlertCircle size={18} /></div>
          </div>
          <div className="stat-value">{lowStockCount + outOfStockCount}</div>
          <div className="stat-change neutral"><AlertTriangle size={13} /><span>{lowStockCount} Low / {outOfStockCount} Out</span></div>
        </div>
      </div>

      {/* Dedicated Search Bar & Quick Filters Above Table */}
      <div className="inventory-search-bar-above">
        <div className="inventory-search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by PID, Name, Category, HSN/SAC..."
            className="inventory-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Filter Selectors */}
        <div className="inventory-quick-filters">
          {/* Category Dropdown */}
          <div className="filter-select-wrap">
            <Filter size={13} className="filter-icon" />
            <select
              className="filter-select-input"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('All');
              }}
              title="Filter by Category"
            >
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category Dropdown */}
          <div className="filter-select-wrap">
            <Filter size={13} className="filter-icon" />
            <select
              className="filter-select-input"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              title="Filter by Sub-Category"
            >
              {uniqueSubCategories.map(sub => (
                <option key={sub} value={sub}>
                  {sub === 'All' ? 'All Sub-Categories' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Chips */}
          <div className="filter-chips-group">
            {[
              { id: 'All', label: 'All' },
              { id: 'OK', label: '🟢 OK' },
              { id: 'Low', label: '🟡 Low' },
              { id: 'Out', label: '🔴 Out' }
            ].map(st => (
              <button
                key={st.id}
                type="button"
                className={`filter-chip-btn ${selectedStatus === st.id ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st.id)}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Matching Count Badge */}
          {searchQuery || selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedStatus !== 'All' ? (
            <div className="search-results-pill">
              Found <strong>{filteredProducts.length}</strong> of {products.length}
            </div>
          ) : (
            <div className="search-results-pill search-results-pill-neutral">
              Total <strong>{products.length}</strong> items
            </div>
          )}
        </div>
      </div>

      {/* Master Inventory Panel with Contained Scrolling */}
      <div className="inventory-master-panel">
        <div className="inventory-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <h3 className="dash-panel-title" style={{ margin: 0 }}>Product Inventory Master</h3>
            <span className="dash-panel-badge">{filteredProducts.length} Items</span>
            <span className="formula-badge" title="7 Mathematical Specification & Accounting Formula Columns: SQR, ROP, Available Stock, Sale Price, Total Stock Values, Exp Time">
              7 Architectural Formula Columns
            </span>
          </div>

          <div className="inventory-toolbar-actions">
            <button className="secondary-action-btn" onClick={() => setShowUploadModal(true)} title="Upload inventory via Excel spreadsheet">
              <Upload size={14} /><span>Upload Excel</span>
            </button>
            <button className="secondary-action-btn" onClick={handleExportInventory} title="Export inventory to CSV">
              <Download size={14} /><span>Export</span>
            </button>
          </div>
        </div>

        {/* Contained Wide Table Wrapper */}
        <div className="inventory-table-container">
          <table className="inventory-wide-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Product Description</th>
                <th>Weight (kg)</th>
                <th>Category</th>
                <th>Sub - Category</th>
                <th>PID</th>
                <th>HSN/SAC</th>
                <th>Stock on Hand</th>
                <th className="formula-col-th" title="Formula A: SQR = Total Units Sold / 30 Days Lookback">
                  <span>SQR (Velocity)</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th className="formula-col-th" title="Formula D: ROP = Lead Time Demand (LTD) + Safety Stock (SS)">
                  <span>ROP Point</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th className="formula-col-th" title="Section 3: Net Available Stock = (OnHand + InTransit) - Allocated">
                  <span>Net Avail</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th>Minimum Stock Level</th>
                <th>Exp Time ( In Month )</th>
                <th>Purchase Price</th>
                <th>GST</th>
                <th className="formula-col-th" title="Auto Calculated: Purchase Price * (1 + GST/100)">
                  <span>Sale Price</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th className="formula-col-th" title="Auto Calculated: Current Stock ( Qty ) * Purchase Price">
                  <span>Total Stock Value ( Without Tax )</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th className="formula-col-th" title="Auto Calculated: Current Stock ( Qty ) * Sale Price">
                  <span>Total Stock Value ( With Tax )</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th className="formula-col-th" title="Auto Calculated: Exp Time ( In Month ) * 30">
                  <span>Exp Time ( In Days )</span>
                  <span className="formula-badge">fx</span>
                </th>
                <th>Replenishment Status</th>
                <th style={{ textAlign: 'center', minWidth: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={21} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Fetching products from database...' : 'No inventory items found matching your filter.'}
                  </td>
                </tr>
              ) : (
                pagedProducts.map((p, i) => {
                  const arch = computeInventoryArchitectureMetrics(p);
                  const isBelowRop = arch.availableStock <= arch.rop;

                  return (
                    <tr key={p.id || p.pid || i}>
                      <td className="td-bold" style={{ minWidth: '180px' }}>{p.name}</td>
                      <td className="td-sub" style={{ minWidth: '220px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description || '—'}</td>
                      <td><span className="td-sub">{formatWeightInKg(p.weight)}</span></td>
                      <td><span className="type-tag">{p.category}</span></td>
                      <td className="td-sub">{p.subCategory || '—'}</td>
                      <td><span className="mono-badge" style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>{p.pid}</span></td>
                      <td className="td-sub">{p.hsn}</td>
                      <td className={isBelowRop ? 'td-bold td-warning' : 'td-bold'}>{p.currentStock}</td>
                      {/* Architectural Formula Columns */}
                      <td className="formula-col-td">
                        <span style={{ fontWeight: 700, color: arch.sqr >= 2 ? '#38bdf8' : 'var(--text-primary)' }}>
                          {arch.sqr}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '3px' }}>u/d</span>
                      </td>
                      <td className="formula-col-td">
                        <span style={{ fontWeight: 700, color: isBelowRop ? '#ef4444' : 'var(--text-primary)' }}>
                          {arch.rop}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '3px' }}>u</span>
                      </td>
                      <td className="formula-col-td td-bold" style={{ color: isBelowRop ? '#ef4444' : 'var(--text-primary)' }}>
                        {arch.availableStock}
                      </td>
                      <td className="td-sub">{p.minStock}</td>
                      <td className="td-sub">{p.expMonths} mo</td>
                      <td className="td-money">₹{(p.purchasePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="td-sub">{(p.gst || 0)}%</td>
                      {/* Financial Formula Columns */}
                      <td className="formula-col-td td-money">₹{(p.salePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="formula-col-td td-money">₹{(p.totalWithoutTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="formula-col-td td-money">₹{(p.totalWithTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="formula-col-td">{p.expDays} days</td>
                      {/* Multi-Tier Replenishment Status */}
                      <td>
                        {isBelowRop ? (
                          <span className="status-badge danger" title={arch.replenishment.primaryAction} style={{ fontWeight: 700, fontSize: '0.74rem' }}>
                            🚨 ROP Triggered
                          </span>
                        ) : arch.replenishment.status === 'OVERSTOCK' ? (
                          <span className="status-badge warning" title={arch.replenishment.primaryAction} style={{ fontWeight: 700, fontSize: '0.74rem' }}>
                            ⚠️ Overstock
                          </span>
                        ) : arch.sqr >= 2.0 ? (
                          <span className="status-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700, fontSize: '0.74rem' }} title="High Daily Sales Velocity">
                            ⚡ High SQR ({arch.sqr}/d)
                          </span>
                        ) : (
                          <span className="status-badge active" style={{ fontWeight: 600, fontSize: '0.74rem' }}>
                            🟢 Optimal Buffer
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="table-row-actions">
                          {(isBelowRop || p.status === 'Low' || p.status === 'Critical' || p.status === 'Out') && (
                            <button
                              type="button"
                              className="row-action-btn row-action-reorder"
                              title={`Quick Reorder PO Draft (${Math.max(arch.rop - arch.availableStock, 20)} units)`}
                              onClick={() => handleQuickReorder(p)}
                            >
                              <ShoppingCart size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="row-action-btn row-action-barcode"
                            title="View / Print Barcode Shelf Tag"
                            onClick={() => setLabelProduct(p)}
                          >
                            <Barcode size={13} />
                          </button>
                          <button
                            type="button"
                            className="row-action-btn row-action-edit"
                            title="Edit Product"
                            onClick={() => setEditingProduct({ ...p, weight: formatWeightInGrams(p.weight) })}
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            className="row-action-btn row-action-delete"
                            title="Delete Product"
                            onClick={() => setDeletingProduct(p)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <TablePagination {...inventoryPagination} />
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '820px', width: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Package size={20} color="var(--brand-accent)" />
                  <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>Add Product to Company Common Catalog</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Building2 size={13} color="var(--brand-accent)" />
                  <span>Company: <strong style={{ color: 'var(--text-primary)' }}>{activeBranch.companyName || (activeBranch.companyId === 'comp_mashtech' || activeBranch.code.startsWith('AND') || activeBranch.code.startsWith('SRU') ? 'Mash Tech' : 'Mann Engineers Fire Safety')}</strong></span>
                  <span style={{ padding: '0.1rem 0.45rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 700, fontSize: '0.7rem' }}>
                    Company Common Inventory
                  </span>
                </div>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit}>
              <div className="modal-dialog-body" style={{ maxHeight: '72vh', overflowY: 'auto', gap: '0.9rem' }}>
                <div className="formula-info-banner">
                  <Sparkles size={16} color="#a78bfa" style={{ flexShrink: 0 }} />
                  <span><strong>Auto-Formula Active:</strong> Sale Price, Total Stock Value (Without Tax), Total Stock Value (With Tax), and Exp Time (In Days) are automatically calculated and saved.</span>
                </div>

                <div style={{ 
                  background: 'rgba(2, 132, 199, 0.08)', 
                  border: '1px solid rgba(2, 132, 199, 0.25)', 
                  borderRadius: '8px', 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.78rem', 
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Layers size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Company Common Catalog:</strong> This product will be registered in the company product master and visible across all sister branches of this company. Initial stock applies to <strong>{activeBranch.name} ({activeBranch.code})</strong>; sister branches will automatically initialize with 0 stock ready for inter-branch replenishment.
                  </span>
                </div>

                {/* Identification & Barcode */}
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">PID (Product ID / SKU) *</label>
                    <input
                      type="text"
                      name="pid"
                      required
                      placeholder="e.g. FE-ABC-6"
                      value={formData.pid}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Barcode size={14} color="var(--brand-accent)" />
                      <span>Barcode Number (EAN-13 / Code-128 / Custom)</span>
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      placeholder="e.g. 8904012345678 or leave blank to use PID"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. ABC Dry Powder Fire Ext. 6kg"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      placeholder="e.g. FireTech Safety India Pvt Ltd"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {allAvailableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Sub - Category</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSubAdd(prev => !prev);
                          if (isCustomSubAdd) {
                            const subs = getSubCategoriesForCategory(formData.category, products, dbCategories);
                            setFormData(prev => ({ ...prev, subCategory: subs[0] || 'General' }));
                          } else {
                            setFormData(prev => ({ ...prev, subCategory: '' }));
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-accent)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isCustomSubAdd ? '← Select Dropdown' : '+ Add Custom'}
                      </button>
                    </div>
                    {!isCustomSubAdd ? (
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={(e) => {
                          if (e.target.value === '__CUSTOM__') {
                            setIsCustomSubAdd(true);
                            setFormData(prev => ({ ...prev, subCategory: '' }));
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        className="form-input"
                      >
                        {currentSubOptionsAdd.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                        <option value="__CUSTOM__">+ Type Custom Sub-Category...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="subCategory"
                        placeholder="e.g. Powder Extinguisher"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="form-input"
                        autoFocus
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (in Grams)</label>
                    <input
                      type="number"
                      step="any"
                      name="weight"
                      placeholder="e.g. 500 (in grams = 0.5 kg)"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Product Description</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="e.g. Stored pressure dry chemical powder fire extinguisher"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">HSN/SAC *</label>
                    <input
                      type="text"
                      name="hsn"
                      required
                      placeholder="e.g. 8424 / 6506"
                      value={formData.hsn}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Stock at {activeBranch.code} *</label>
                    <input
                      type="number"
                      name="currentStock"
                      min="0"
                      required
                      value={formData.currentStock}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                      Sister branches initialize at 0 stock
                    </span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Stock Level *</label>
                    <input
                      type="number"
                      name="minStock"
                      min="1"
                      required
                      value={formData.minStock}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Exp (Months) *</label>
                    <input
                      type="number"
                      name="expMonths"
                      min="0"
                      step="any"
                      required
                      placeholder="e.g. 60"
                      value={formData.expMonths}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* PRICING, GST & CUSTOM SALE PRICE OVERRIDE */}
                <div style={{ background: 'rgba(56, 189, 248, 0.04)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', padding: '0.9rem', marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-accent)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <DollarSign size={14} />
                    <span>Pricing, GST & Commercial Valuation</span>
                  </div>

                  <div className="modal-form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="form-group">
                      <label className="form-label">Purchase Price (₹) *</label>
                      <input
                        type="number"
                        name="purchasePrice"
                        min="0"
                        step="any"
                        required
                        placeholder="e.g. 1000.00"
                        value={formData.purchasePrice}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GST Rate (%) *</label>
                      <select name="gst" value={formData.gst} onChange={handleInputChange} className="form-input">
                        <option value="18">18% (Standard Goods)</option>
                        <option value="12">12% (Medical / Apparel)</option>
                        <option value="5">5% (Essential)</option>
                        <option value="28">28% (Luxury / High Tier)</option>
                        <option value="0">0% (Nil / Exempt)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>Custom Sale Price (₹) (Optional Override)</label>
                      </div>
                      <input
                        type="number"
                        name="salePrice"
                        min="0"
                        step="any"
                        placeholder={`Auto: ₹${liveSalePrice.toFixed(2)}`}
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        Leave blank to auto-calc: Purchase × (1 + GST%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Auto-Calculated Formula Values Preview Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7dd3fc', fontWeight: '700' }}>
                      Sale Price <span className="formula-badge">fx</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      ₹{liveSalePrice.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Purchase Price × (1 + GST%)</div>
                  </div>
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7dd3fc', fontWeight: '700' }}>
                      Stock Value (Without Tax) <span className="formula-badge">fx</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      ₹{liveTotalWithoutTax.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Qty × Purchase Price</div>
                  </div>
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7dd3fc', fontWeight: '700' }}>
                      Stock Value (With Tax) <span className="formula-badge">fx</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#34d399', marginTop: '0.2rem' }}>
                      ₹{liveTotalWithTax.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Qty × Sale Price</div>
                  </div>
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7dd3fc', fontWeight: '700' }}>
                      Exp Time (In Days) <span className="formula-badge">fx</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--brand-accent)', marginTop: '0.2rem' }}>
                      {liveExpDays} days
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Months × 30</div>
                  </div>
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Plus size={16} /><span>Save to Company Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STOCK COUNT AUDIT MODAL */}
      {showCountModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowCountModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <RefreshCw size={20} color="var(--brand-accent)" />
                <span>Physical Stock Count Audit (PostgreSQL)</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowCountModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleApplyCount}>
              <div className="modal-dialog-body">
                <div className="form-group">
                  <label className="form-label">Select Product / PID to Count</label>
                  <select
                    className="form-input"
                    value={auditSku}
                    onChange={e => setAuditSku(e.target.value)}
                  >
                    {products.map(p => (
                      <option key={p.pid} value={p.pid}>{p.pid} — {p.name} (Current: {p.currentStock})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Physical Count Verified (Units)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="Enter physical units counted on shelf..."
                    className="form-input"
                    value={countedStock}
                    onChange={e => setCountedStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowCountModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Check size={16} /><span>Post Stock Adjustment to DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD INVENTORY VIA EXCEL MODAL (MATCHING 18-COLUMN FORMAT) */}
      {showUploadModal && (
        <div className="modal-backdrop-overlay" onClick={() => { setShowUploadModal(false); setParsedPreview([]); setUploadedFileName(''); setUploadError(''); }}>
          <div className="modal-dialog-box" style={{ maxWidth: '980px', width: '95vw' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <FileSpreadsheet size={20} color="var(--brand-accent)" />
                <span>Upload Inventory via Excel • {activeBranch.code} (PostgreSQL Sync)</span>
              </div>
              <button
                className="modal-dialog-close"
                onClick={() => { setShowUploadModal(false); setParsedPreview([]); setUploadedFileName(''); setUploadError(''); }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-dialog-body" style={{ gap: '1.1rem' }}>
              {/* Instructions & Template Download */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>Standard Product Excel Format (.xlsx)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Columns: Supplier, Name, Product Description, Weight, Category, Sub - Category, PID, HSN/SAC, Current Stock, Minimum Stock, Exp Time (In Month), Purchase Price, GST, Sale Price, Total Stock Value (Without Tax), Total Stock Value (With Tax), Exp Time (In Days).
                  </div>
                </div>
                <button
                  type="button"
                  className="secondary-action-btn"
                  onClick={handleDownloadSampleTemplate}
                  style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--brand-accent)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                >
                  <Download size={14} /><span>Download Template (.xlsx)</span>
                </button>
              </div>

              {/* Formula Information Banner */}
              <div className="formula-info-banner">
                <Sparkles size={16} color="#a78bfa" style={{ flexShrink: 0 }} />
                <span><strong>4 Columns Auto Calculated by Formula:</strong> Sale Price [fx: Purchase Price × (1 + GST%)], Total Stock Value (Without Tax) [fx: Current Stock × Purchase Price], Total Stock Value (With Tax) [fx: Current Stock × Sale Price], and Exp Time (In Days) [fx: Exp Months × 30]. If left blank in Excel, they will be automatically computed and saved into PostgreSQL!</span>
              </div>

              {/* Drag and Drop Zone */}
              <div
                className={`excel-dropzone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer?.files?.[0];
                  if (file) handleProcessExcelFile(file);
                }}
                onClick={() => document.getElementById('inventory-excel-file-input')?.click()}
              >
                <input
                  id="inventory-excel-file-input"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProcessExcelFile(file);
                  }}
                />
                <div className="excel-dropzone-icon">
                  <Upload size={24} />
                </div>
                <div>
                  <div className="excel-dropzone-title">
                    {uploadedFileName ? 'Choose another Excel file' : 'Click to upload or drag & drop Excel file'}
                  </div>
                  <div className="excel-dropzone-sub">
                    Supports Microsoft Excel (.xlsx, .xls) and CSV spreadsheets
                  </div>
                </div>
                {uploadedFileName && (
                  <div className="excel-file-pill">
                    <FileSpreadsheet size={15} />
                    <span>{uploadedFileName}</span>
                    <CheckCircle2 size={15} />
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="alert-banner alert-danger">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Parsed Preview Section */}
              {parsedPreview.length > 0 && (
                <div className="excel-preview-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Preview: {parsedPreview.length} Products Detected
                      </span>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Review parsed rows below. The 4 formula columns have been verified and computed for PostgreSQL commit.
                      </p>
                    </div>
                    {/* Import Mode Options */}
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.8rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: importMode === 'merge' ? 'var(--brand-accent)' : 'var(--text-muted)' }}>
                        <input
                          type="radio"
                          name="importMode"
                          value="merge"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                        />
                        <span>Merge & Update by PID</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: importMode === 'replace' ? '#ef4444' : 'var(--text-muted)' }}>
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                        />
                        <span>Replace Entire Inventory</span>
                      </label>
                    </div>
                  </div>

                  <div className="data-table-wrap" style={{ maxHeight: '240px', overflowY: 'auto', overflowX: 'auto' }}>
                    <table className="data-table inventory-wide-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Weight (kg)</th>
                          <th>Category</th>
                          <th>Sub - Category</th>
                          <th>PID</th>
                          <th>HSN/SAC</th>
                          <th>Current Stock</th>
                          <th>Min Stock</th>
                          <th>Exp (Mo)</th>
                          <th>Purchase Price</th>
                          <th>GST</th>
                          <th className="formula-col-th">Sale Price <span className="formula-badge">fx</span></th>
                          <th className="formula-col-th">Stock Value (Without Tax) <span className="formula-badge">fx</span></th>
                          <th className="formula-col-th">Stock Value (With Tax) <span className="formula-badge">fx</span></th>
                          <th className="formula-col-th">Exp (Days) <span className="formula-badge">fx</span></th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedPreview.slice(0, 15).map((row, idx) => (
                          <tr key={idx}>
                            <td className="td-bold">{row.name}</td>
                            <td className="td-sub">{formatWeightInKg(row.weight)}</td>
                            <td><span className="type-tag">{row.category}</span></td>
                            <td className="td-sub">{row.subCategory}</td>
                            <td><span className="mono-badge" style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>{row.pid}</span></td>
                            <td className="td-sub">{row.hsn}</td>
                            <td className="td-bold">{row.currentStock}</td>
                            <td className="td-sub">{row.minStock}</td>
                            <td className="td-sub">{row.expMonths}</td>
                            <td className="td-money">₹{(row.purchasePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="td-sub">{row.gst}%</td>
                            <td className="formula-col-td td-money">₹{(row.salePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="formula-col-td td-money">₹{(row.totalWithoutTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="formula-col-td td-money">₹{(row.totalWithTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="formula-col-td">{row.expDays} d</td>
                            <td><span className={`status-badge ${row.status === 'OK' ? 'active' : row.status === 'Low' ? 'warning' : 'danger'}`}>{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedPreview.length > 15 && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Showing first 15 of {parsedPreview.length} items from Excel.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-dialog-footer">
              <button
                type="button"
                className="secondary-action-btn"
                onClick={() => { setShowUploadModal(false); setParsedPreview([]); setUploadedFileName(''); setUploadError(''); }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-action-btn"
                disabled={parsedPreview.length === 0}
                onClick={handleConfirmImport}
              >
                <Upload size={16} />
                <span>Confirm & Save {parsedPreview.length ? `(${parsedPreview.length} Products to DB)` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="modal-backdrop-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '820px', width: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Edit3 size={20} color="var(--brand-accent)" />
                <span>Edit Product — {editingProduct.pid}</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setEditingProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit}>
              <div className="modal-dialog-body" style={{ maxHeight: '72vh', overflowY: 'auto', gap: '0.9rem' }}>
                <div className="formula-info-banner">
                  <Sparkles size={16} color="#a78bfa" style={{ flexShrink: 0 }} />
                  <span><strong>Live Formula Calculation:</strong> Sale Price, Total Stock Value Without Tax, Total Stock Value With Tax, and Exp Time are recalculated in real time and saved into PostgreSQL.</span>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">PID (Product ID / SKU)</label>
                    <input
                      type="text"
                      disabled
                      value={editingProduct.pid}
                      className="form-input"
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Barcode size={14} color="var(--brand-accent)" />
                      <span>Barcode Number</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8904012345678"
                      value={editingProduct.barcode || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier</label>
                    <input
                      type="text"
                      placeholder="e.g. FireTech Safety India Pvt Ltd"
                      value={editingProduct.supplier || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, supplier: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-input"
                      value={editingProduct.category || allAvailableCategories[0] || 'Fire Extinguishers'}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const subs = getSubCategoriesForCategory(newCat, products, dbCategories);
                        setEditingProduct({
                          ...editingProduct,
                          category: newCat,
                          subCategory: subs[0] || 'General'
                        });
                        setIsCustomSubEdit(false);
                      }}
                    >
                      {allAvailableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Sub - Category</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSubEdit(prev => !prev);
                          if (isCustomSubEdit) {
                            const subs = getSubCategoriesForCategory(editingProduct.category, products, dbCategories);
                            setEditingProduct({ ...editingProduct, subCategory: subs[0] || 'General' });
                          } else {
                            setEditingProduct({ ...editingProduct, subCategory: '' });
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-accent)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isCustomSubEdit ? '← Select Dropdown' : '+ Add Custom'}
                      </button>
                    </div>
                    {!isCustomSubEdit ? (
                      <select
                        className="form-input"
                        value={editingProduct.subCategory || (currentSubOptionsEdit[0] || 'General')}
                        onChange={(e) => {
                          if (e.target.value === '__CUSTOM__') {
                            setIsCustomSubEdit(true);
                            setEditingProduct({ ...editingProduct, subCategory: '' });
                          } else {
                            setEditingProduct({ ...editingProduct, subCategory: e.target.value });
                          }
                        }}
                      >
                        {currentSubOptionsEdit.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                        <option value="__CUSTOM__">+ Type Custom Sub-Category...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Powder Extinguisher"
                        value={editingProduct.subCategory || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })}
                        className="form-input"
                        autoFocus
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (in Grams)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 500 (in grams = 0.5 kg)"
                      value={editingProduct.weight || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="modal-form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">HSN/SAC Code</label>
                    <input
                      type="text"
                      value={editingProduct.hsn || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, hsn: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Stock (Qty) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingProduct.currentStock ?? 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, currentStock: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Stock Level *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editingProduct.minStock ?? 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, minStock: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label className="form-label">Purchase Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={editingProduct.purchasePrice ?? 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, purchasePrice: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GST Rate (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={editingProduct.gst ?? 18}
                      onChange={(e) => setEditingProduct({ ...editingProduct, gst: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Exp Time (In Months) *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editingProduct.expMonths ?? 12}
                      onChange={(e) => setEditingProduct({ ...editingProduct, expMonths: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Custom Sale Price (₹) (Optional Override)</label>
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder={`Auto: ₹${(Math.round((parseFloat(editingProduct.purchasePrice || 0) * (1 + (parseFloat(editingProduct.gst || 0) / 100))) * 100) / 100).toFixed(2)}`}
                    value={editingProduct.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value })}
                    className="form-input"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                    Leave blank to auto-calc: Purchase × (1 + GST%)
                  </span>
                </div>

                {/* 4 LIVE FORMULA PREVIEWS */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-accent)', fontWeight: '700', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={13} />
                    <span>Live Auto-Calculated Formula Previews</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
                    <div className="formula-preview-box">
                      <div className="formula-preview-label">Sale Price <span className="formula-badge">fx</span></div>
                      <div className="formula-preview-val">₹{(editingProduct.salePrice && parseFloat(editingProduct.salePrice) > 0 ? parseFloat(editingProduct.salePrice) : (Math.round((parseFloat(editingProduct.purchasePrice || 0) * (1 + (parseFloat(editingProduct.gst || 0) / 100))) * 100) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="formula-preview-box">
                      <div className="formula-preview-label">Stock Value (Without Tax) <span className="formula-badge">fx</span></div>
                      <div className="formula-preview-val">₹{(Math.round((parseFloat(editingProduct.currentStock || 0) * parseFloat(editingProduct.purchasePrice || 0)) * 100) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="formula-preview-box">
                      <div className="formula-preview-label">Stock Value (With Tax) <span className="formula-badge">fx</span></div>
                      <div className="formula-preview-val">₹{(Math.round((parseFloat(editingProduct.currentStock || 0) * (parseFloat(editingProduct.purchasePrice || 0) * (1 + (parseFloat(editingProduct.gst || 0) / 100)))) * 100) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="formula-preview-box">
                      <div className="formula-preview-label">Exp (Days) <span className="formula-badge">fx</span></div>
                      <div className="formula-preview-val">{Math.round(parseFloat(editingProduct.expMonths || 0) * 30)} days</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-action-btn">
                  <Check size={16} /><span>Update Product in DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="modal-backdrop-overlay" onClick={() => setDeletingProduct(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title" style={{ color: '#ef4444' }}>
                <AlertTriangle size={20} color="#ef4444" />
                <span>Delete Product</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setDeletingProduct(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-dialog-body" style={{ padding: '1rem', gap: '0.75rem' }}>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                Are you sure you want to delete <strong>{deletingProduct.name}</strong> (<span style={{ color: 'var(--brand-accent)' }}>{deletingProduct.pid}</span>)?
              </p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                This product will be permanently removed from the PostgreSQL <code>product</code> table for branch {activeBranch.code}.
              </p>
            </div>
            <div className="modal-dialog-footer">
              <button type="button" className="secondary-action-btn" onClick={() => setDeletingProduct(null)}>
                Cancel
              </button>
              <button type="button" className="primary-action-btn" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={handleDeleteProductConfirm}>
                <Trash2 size={15} /><span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARCODE / SHELF LABEL MODAL */}
      {labelProduct && (
        <div className="modal-backdrop-overlay" onClick={() => setLabelProduct(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Barcode size={20} color="var(--brand-accent)" />
                <span>Shelf Label / Barcode Tag</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setLabelProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-dialog-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Printable Shelf Label Card */}
              <div className="shelf-label-card" id="printable-shelf-label">
                <div className="shelf-label-header">
                  <span className="shelf-hub-name">{activeBranch.name.toUpperCase()}</span>
                  <span className="shelf-cat-badge">{labelProduct.category}</span>
                </div>
                <div className="shelf-product-title">{labelProduct.name}</div>
                <div className="shelf-meta-row">
                  <span>HSN: <strong>{labelProduct.hsn || '8424'}</strong></span>
                  <span>Wt: <strong>{formatWeightInKg(labelProduct.weight)}</strong></span>
                </div>
                {/* Visual Barcode Graphic */}
                <div className="shelf-barcode-container">
                  <div className="shelf-barcode-lines">
                    {[2, 1, 3, 1, 2, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3].map((w, i) => (
                      <span key={i} style={{ width: `${w * 2}px`, height: '42px', background: '#000', display: 'inline-block' }} />
                    ))}
                  </div>
                  <div className="shelf-barcode-pid">*{labelProduct.pid}*</div>
                </div>
                <div className="shelf-price-row">
                  <div>
                    <span className="shelf-price-label">MRP (Incl. All Taxes)</span>
                    <span className="shelf-price-val">₹{(labelProduct.salePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="shelf-price-label">GST Rate</span>
                    <span className="shelf-gst-val">{labelProduct.gst || 18}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-dialog-footer">
              <button type="button" className="secondary-action-btn" onClick={() => setLabelProduct(null)}>
                Close
              </button>
              <button type="button" className="primary-action-btn" onClick={() => window.print()}>
                <Printer size={15} /><span>Print Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// ─── STOCK TRANSFERS (POSTGRESQL SYNCED & REAL-TIME) ─────────────────
export function BranchTransfers({ activeBranch }) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewingTransfer, setViewingTransfer] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Products and branches for dropdowns
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);

  // Form states
  const [destBranch, setDestBranch] = useState(activeBranch?.code === 'SUR-02' ? 'AMD-01' : 'SUR-02');
  const [selectedSku, setSelectedSku] = useState('FE-ABC-4');
  const [transferQty, setTransferQty] = useState(5);
  const [vehicleNo, setVehicleNo] = useState('GJ-01-TR-4501');
  const [driverName, setDriverName] = useState('Ramesh Patel');
  const [driverPhone, setDriverPhone] = useState('+91 98250 12345');
  const [dispatchNotes, setDispatchNotes] = useState('Inter-branch stock transfer');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch transfers from PostgreSQL
  const fetchTransfers = async () => {
    try {
      setSyncing(true);
      const code = activeBranch?.code || 'AMD-01';
      const res = await fetch(`/api/transfers?branchCode=${encodeURIComponent(code)}`);
      const json = await res.json();
      if (json.success) {
        setTransfers(json.data || []);
      }
    } catch (err) {
      console.warn('Could not fetch stock transfers:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  // Fetch available products and branches
  const fetchMetadata = async () => {
    try {
      const [prodRes, brRes] = await Promise.all([
        fetch('/api/inventory?branch=*'),
        fetch('/api/branches')
      ]);
      const [prodJson, brJson] = await Promise.all([prodRes.json(), brRes.json()]);
      if (prodJson.success && Array.isArray(prodJson.data)) {
        setAvailableProducts(prodJson.data);
      }
      if (brJson.success && Array.isArray(brJson.data)) {
        setAvailableBranches(brJson.data);
      }
    } catch (err) {
      console.warn('Could not load transfer metadata:', err);
    }
  };

  useEffect(() => {
    fetchTransfers();
    fetchMetadata();
  }, [activeBranch?.code]);

  // Selected product object
  const currentProduct = availableProducts.find(p => p.pid === selectedSku) || {
    pid: 'FE-ABC-4',
    name: 'ABC Dry Powder Extinguisher 4kg',
    sale_price: 1321.60
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        from_branch: activeBranch?.code || 'AMD-01',
        to_branch: destBranch,
        item_code: currentProduct.pid,
        item_name: currentProduct.name,
        qty: parseInt(transferQty, 10) || 1,
        unit_price: parseFloat(currentProduct.sale_price) || 1321.60,
        total_value: (parseInt(transferQty, 10) || 1) * (parseFloat(currentProduct.sale_price) || 1321.60),
        vehicle_no: vehicleNo.trim(),
        driver_name: driverName.trim(),
        driver_phone: driverPhone.trim(),
        dispatch_notes: dispatchNotes.trim()
      };

      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Transfer order ${json.data.transfer_no} dispatched to ${destBranch}!`);
        setShowNewModal(false);
        fetchTransfers();
      } else {
        alert(json.message || 'Failed to dispatch transfer');
      }
    } catch (err) {
      alert(`Error dispatching transfer: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcknowledge = async (transfer) => {
    try {
      const res = await fetch(`/api/transfers/${transfer.id}/receive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverUser: 'Staff',
          notes: `Received and verified at ${activeBranch?.code || 'branch'}`
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Stock transfer ${transfer.transfer_no} marked as Received & stock added to database!`);
        if (viewingTransfer && viewingTransfer.id === transfer.id) {
          setViewingTransfer(json.data);
        }
        fetchTransfers();
      } else {
        alert(json.message || 'Could not receive transfer');
      }
    } catch (err) {
      alert(`Error receiving transfer: ${err.message}`);
    }
  };

  const handleExportTransfers = () => {
    const headers = ['Transfer #', 'From Branch', 'To Branch', 'Item Code', 'Item Name', 'Qty', 'Total Value', 'Status', 'Date', 'Vehicle #', 'Driver'];
    const rows = [
      headers,
      ...filteredTransfers.map(t => [
        t.transfer_no, t.from_branch, t.to_branch, t.item_code, t.item_name,
        t.qty, `₹${Math.round(t.total_value || 0).toLocaleString('en-IN')}`,
        t.status, t.transfer_date ? new Date(t.transfer_date).toLocaleDateString('en-IN') : '',
        t.vehicle_no, t.driver_name
      ])
    ];
    downloadCSV(`Stock_Transfers_${activeBranch?.code || 'ALL'}.csv`, rows);
    showToast('Transfer orders exported to CSV successfully!');
  };

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch =
      (t.transfer_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.from_branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.to_branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.item_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vehicle_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.status || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'IN_TRANSIT') return matchesSearch && t.status === 'In Transit';
    if (statusFilter === 'RECEIVED') return matchesSearch && t.status === 'Received';
    return matchesSearch;
  });

  const { paginatedItems: pagedTransfers, paginationProps: transfersPagination } = useTablePagination(filteredTransfers, 10);

  // Calculate live stats
  const inTransitCount = transfers.filter(t => t.status === 'In Transit').length;
  const receivedCount = transfers.filter(t => t.status === 'Received').length;
  const totalValue = transfers.reduce((sum, t) => sum + (parseFloat(t.total_value) || 0), 0);

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Stock Transfers • {activeBranch?.name || activeBranch?.code}</h2>
          <p className="page-desc">Inter-branch material movements backed directly by PostgreSQL database with real-time stock allocation.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={fetchTransfers} title="Sync with DB" disabled={syncing}>
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
          <button className="primary-action-btn" onClick={() => setShowNewModal(true)}>
            <Plus size={16} /><span>New Transfer</span>
          </button>
        </div>
      </div>

      {/* 3 Live KPI Summary Cards */}
      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.25rem' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">In Transit Movements</span>
            <div className="stat-icon-circle" style={{ background: '#f59e0b20', color: '#f59e0b' }}><Truck size={18} /></div>
          </div>
          <div className="stat-value">{inTransitCount} Orders</div>
          <div className="stat-change warning"><span>Active en-route tracking</span></div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Completed Transfers</span>
            <div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-value">{receivedCount} Received</div>
          <div className="stat-change positive"><span>Added to destination shelf</span></div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Transferred Value</span>
            <div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">₹{Math.round(totalValue).toLocaleString('en-IN')}</div>
          <div className="stat-change neutral"><span>{transfers.length} Total records in DB</span></div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="dash-panel-title">Transfer Orders ({filteredTransfers.length})</h3>
            <div className="filter-pill-group" style={{ display: 'flex', gap: '0.35rem' }}>
              <button className={`analytics-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`} onClick={() => setStatusFilter('ALL')}>All</button>
              <button className={`analytics-pill-btn ${statusFilter === 'IN_TRANSIT' ? 'active' : ''}`} onClick={() => setStatusFilter('IN_TRANSIT')}>In Transit ({inTransitCount})</button>
              <button className={`analytics-pill-btn ${statusFilter === 'RECEIVED' ? 'active' : ''}`} onClick={() => setStatusFilter('RECEIVED')}>Received ({receivedCount})</button>
            </div>
          </div>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '200px' }}>
              <Search size={14} />
              <input
                placeholder="Search transfer #, SKU, branch..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="secondary-action-btn" onClick={handleExportTransfers}>
              <Download size={14} /><span>Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
            <div>Loading transfer records from PostgreSQL...</div>
          </div>
        ) : filteredTransfers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No stock transfers matching the criteria. Click "New Transfer" to dispatch stock.
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transfer #</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Item / SKU</th>
                  <th>Quantity</th>
                  <th>Value (₹)</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedTransfers.map((t) => {
                  const isDestination = t.to_branch === activeBranch?.code || activeBranch?.code === '*';
                  const isInTransit = t.status === 'In Transit';

                  return (
                    <tr key={t.id || t.transfer_no}>
                      <td><span className="mono-badge">{t.transfer_no}</span></td>
                      <td className="td-bold">{t.from_branch}</td>
                      <td className="td-bold">{t.to_branch}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{t.item_name}</div>
                        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.item_code}</span>
                      </td>
                      <td className="td-bold" style={{ color: 'var(--brand-accent)' }}>{t.qty} Units</td>
                      <td className="td-money">₹{Math.round(parseFloat(t.total_value) || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>{t.vehicle_no || 'GJ-01-TR-4501'}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.driver_name || 'Transporter'}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${t.status === 'In Transit' ? 'warning' : 'active'}`}>
                          {t.status === 'In Transit' ? '🚚 In Transit' : '✅ Received'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button className="table-action-btn" onClick={() => setViewingTransfer(t)} title="View Manifest">
                            <Eye size={14} /><span>View</span>
                          </button>
                          {isInTransit && isDestination && (
                            <button
                              onClick={() => handleAcknowledge(t)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '4px',
                                border: 'none',
                                background: '#10b981',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                              title="Mark Received & Add to Inventory"
                            >
                              <Check size={12} /><span>Receive</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <TablePagination {...transfersPagination} />
          </div>
        )}
      </div>

      {/* NEW TRANSFER MODAL */}
      {showNewModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Truck size={20} color="var(--brand-accent)" />
                <span>Dispatch Inter-Branch Stock Transfer</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowNewModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateTransfer}>
              <div className="modal-dialog-body">
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Source Branch (From)</label>
                    <input
                      type="text"
                      readOnly
                      value={`${activeBranch?.code || 'AMD-01'} (${activeBranch?.name || 'Current Branch'})`}
                      className="form-input"
                      style={{ opacity: 0.85 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination Branch (To) *</label>
                    <select
                      className="form-input"
                      value={destBranch}
                      onChange={e => setDestBranch(e.target.value)}
                    >
                      {availableBranches
                        .filter(b => b.code !== activeBranch?.code)
                        .map(b => (
                          <option key={b.code} value={b.code}>
                            {b.code} — {b.name} ({b.city})
                          </option>
                        ))}
                      {availableBranches.length === 0 && (
                        <>
                          <option value="AMD-01">AMD-01 — Ahmedabad Hub</option>
                          <option value="BRD-02">BRD-02 — Baroda Regional Hub</option>
                          <option value="AND-01">AND-01 — Anand Store</option>
                          <option value="SRU-02">SRU-02 — Surat Outlet</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Item to Transfer (From Database) *</label>
                    <select
                      className="form-input"
                      value={selectedSku}
                      onChange={e => setSelectedSku(e.target.value)}
                    >
                      {availableProducts.map(p => (
                        <option key={p.pid} value={p.pid}>
                          {p.pid}: {p.name} (Stock: {p.current_stock || 0} | ₹{p.sale_price})
                        </option>
                      ))}
                      {availableProducts.length === 0 && (
                        <>
                          <option value="FE-ABC-4">FE-ABC-4: ABC Dry Powder Extinguisher 4kg</option>
                          <option value="FE-CO2-2">FE-CO2-2: CO2 Fire Extinguisher 2kg</option>
                          <option value="SH-M201">SH-M201: Safety Helmet M-201 ISI</option>
                          <option value="SG-CL01">SG-CL01: Anti-Fog Safety Goggles Clear</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Units to Transfer *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-input"
                      value={transferQty}
                      onChange={e => setTransferQty(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Vehicle / E-way Bill No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GJ-01-TR-4501"
                      className="form-input"
                      value={vehicleNo}
                      onChange={e => setVehicleNo(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Driver Name & Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel (+91 98250 12345)"
                      className="form-input"
                      value={`${driverName} (${driverPhone})`}
                      onChange={e => setDriverName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Transfer Purpose / Dispatch Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Urgent customer order rebalancing"
                    className="form-input"
                    value={dispatchNotes}
                    onChange={e => setDispatchNotes(e.target.value)}
                  />
                </div>

                <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Transfer Valuation:</span>
                    <span style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>
                      ₹{Math.round((parseInt(transferQty, 10) || 1) * (parseFloat(currentProduct.sale_price) || 1321.60)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Note: Dispatching will immediately record in PostgreSQL and reduce source shelf count.
                  </div>
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={submitting}>
                  <Truck size={16} /><span>{submitting ? 'Dispatching...' : 'Confirm & Dispatch Material'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TRANSFER DETAILS MODAL */}
      {viewingTransfer && (
        <div className="modal-backdrop-overlay" onClick={() => setViewingTransfer(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Truck size={20} color="var(--brand-accent)" />
                <span>Stock Transfer Manifest • {viewingTransfer.transfer_no}</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setViewingTransfer(null)}><X size={18} /></button>
            </div>
            <div className="modal-dialog-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '0.75rem' }}>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Origin Branch:</span> <div style={{ fontWeight: '700' }}>{viewingTransfer.from_branch}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Destination Branch:</span> <div style={{ fontWeight: '700' }}>{viewingTransfer.to_branch}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Product:</span> <div style={{ fontWeight: '600' }}>{viewingTransfer.item_name}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU / Code:</span> <div className="mono">{viewingTransfer.item_code}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Units Dispatched:</span> <div style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>{viewingTransfer.qty} Units</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consignment Valuation:</span> <div style={{ fontWeight: '700', color: '#10b981' }}>₹{Math.round(parseFloat(viewingTransfer.total_value) || 0).toLocaleString('en-IN')}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transport Vehicle:</span> <div>{viewingTransfer.vehicle_no || 'GJ-01-TR-4501'}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Driver Details:</span> <div>{viewingTransfer.driver_name} ({viewingTransfer.driver_phone || 'N/A'})</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transfer Date:</span> <div>{viewingTransfer.transfer_date ? new Date(viewingTransfer.transfer_date).toLocaleDateString('en-IN') : 'Today'}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span> <div><span className={`status-badge ${viewingTransfer.status === 'In Transit' ? 'warning' : 'active'}`}>{viewingTransfer.status}</span></div></div>
              </div>

              {viewingTransfer.dispatch_notes && (
                <div style={{ fontSize: '0.82rem', padding: '0.6rem 0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                  <strong>Dispatch Notes:</strong> {viewingTransfer.dispatch_notes}
                </div>
              )}
              {viewingTransfer.received_notes && (
                <div style={{ fontSize: '0.82rem', marginTop: '0.5rem', padding: '0.6rem 0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                  <strong>Received Verification:</strong> {viewingTransfer.received_notes}
                </div>
              )}
            </div>
            <div className="modal-dialog-footer">
              <button type="button" className="secondary-action-btn" onClick={() => window.print()}>
                <Printer size={15} /><span>Print Delivery Challan</span>
              </button>
              {viewingTransfer.status === 'In Transit' && (
                <button
                  type="button"
                  className="primary-action-btn"
                  onClick={() => handleAcknowledge(viewingTransfer)}
                >
                  <Check size={16} /><span>Acknowledge & Receive Stock</span>
                </button>
              )}
              <button type="button" className="secondary-action-btn" onClick={() => setViewingTransfer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── DAILY CASH BOOK ──────────────────────────────────────────────────
// ─── DAILY CASH BOOK (POSTGRESQL SYNCED & BRANCH ISOLATED) ──────────
export function BranchCashBook({ activeBranch, currentUser, currentTenant }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // New entry form state
  const [entryType, setEntryType] = useState('Receipt');
  const [partyName, setPartyName] = useState('');
  const [category, setCategory] = useState('Counter Sales');
  const [refNo, setRefNo] = useState('');
  const [narration, setNarration] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch live Cash Book entries for this active branch
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const branchParam = encodeURIComponent(activeBranch.code);
      const res = await fetch(`/api/cashbook?branch=${branchParam}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEntries(json.data);
      }
    } catch (err) {
      console.warn('Failed to load cash book from PostgreSQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [activeBranch.code]);

  // Compute live KPI balances
  const totalReceipts = entries
    .filter(e => e.type === 'Receipt' || parseFloat(e.drAmount) > 0)
    .reduce((sum, e) => sum + (parseFloat(e.drAmount) || 0), 0);

  const totalPayments = entries
    .filter(e => e.type === 'Payment' || e.type === 'Contra' || parseFloat(e.crAmount) > 0)
    .reduce((sum, e) => sum + (parseFloat(e.crAmount) || 0), 0);

  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const closingBalance = lastEntry ? (parseFloat(lastEntry.balance) || 0) : 54200;
  const openingBalance = Math.max(0, closingBalance - totalReceipts + totalPayments);
  const reconciledCount = entries.filter(e => e.reconciled).length;
  const isAllReconciled = entries.length > 0 && reconciledCount === entries.length;

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    const amtNum = parseFloat(amount) || 0;
    if (amtNum <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    try {
      const payload = {
        branchCode: activeBranch.code,
        entryDate: new Date().toISOString().split('T')[0],
        type: entryType,
        party: partyName.trim(),
        category: category.trim() || 'General',
        refNo: refNo.trim() || `${entryType === 'Receipt' ? 'REC' : 'PAY'}-${Math.floor(100 + Math.random() * 900)}`,
        narration: narration.trim() || `${entryType} transaction`,
        amount: amtNum,
        drAmount: entryType === 'Receipt' ? amtNum : 0,
        crAmount: entryType !== 'Receipt' ? amtNum : 0,
        paymentMode,
        createdBy: currentUser?.name || 'Branch Manager'
      };

      const res = await fetch(`/api/cashbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEntries(prev => [...prev, json.data]);
        setShowNewModal(false);
        showToast(`Cash Book Entry #${json.data.entryNo} posted successfully!`);
        setPartyName('');
        setCategory('Counter Sales');
        setRefNo('');
        setNarration('');
        setAmount('');
      } else {
        alert(json.message || 'Failed to save entry');
      }
    } catch (err) {
      alert('Error creating cash book entry: ' + err.message);
    }
  };

  const handleToggleReconcile = async (entry) => {
    try {
      const idOrNo = entry.id || entry.entryNo;
      const res = await fetch(`/api/cashbook/${encodeURIComponent(idOrNo)}/reconcile?branch=${encodeURIComponent(activeBranch.code)}`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEntries(prev => prev.map(e => (e.id === entry.id ? { ...e, reconciled: json.data.reconciled } : e)));
        showToast(`Entry #${entry.entryNo} marked as ${json.data.reconciled ? 'Reconciled' : 'Unreconciled'}`);
      }
    } catch (err) {
      alert('Failed to update reconciliation: ' + err.message);
    }
  };

  const handleDeleteEntry = async (entry) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Cash Book entry #${entry.entryNo} for ${entry.party}?`);
    if (!confirmDelete) return;

    try {
      const idOrNo = entry.id || entry.entryNo;
      const res = await fetch(`/api/cashbook/${encodeURIComponent(idOrNo)}?branch=${encodeURIComponent(activeBranch.code)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setEntries(prev => prev.filter(e => e.id !== entry.id && e.entryNo !== entry.entryNo));
        showToast(`Entry #${entry.entryNo} deleted successfully.`);
      } else {
        alert(json.message || 'Failed to delete entry');
      }
    } catch (err) {
      alert('Error deleting cash book entry: ' + err.message);
    }
  };

  const handleExportCashBook = () => {
    const headers = ['Entry #', 'Date', 'Type', 'Party', 'Category', 'Ref #', 'Narration', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)', 'Payment Mode', 'Reconciled'];
    const rows = [
      headers,
      ...entries.map(e => [
        e.entryNo || e.no,
        e.date || '',
        e.type,
        e.party,
        e.category || '',
        e.refNo || '',
        e.narration || '',
        e.drAmount > 0 ? e.drAmount : '',
        e.crAmount > 0 ? e.crAmount : '',
        e.balance,
        e.paymentMode || 'Cash',
        e.reconciled ? 'YES' : 'NO'
      ])
    ];
    downloadCSV(`Daily_CashBook_${activeBranch.code}.csv`, rows);
    showToast('Daily Cash Book exported to CSV successfully!');
  };

  const filteredEntries = entries.filter(e => {
    if (filterType !== 'ALL' && e.type !== filterType) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (e.entryNo || '').toLowerCase().includes(q) ||
      (e.party || '').toLowerCase().includes(q) ||
      (e.narration || '').toLowerCase().includes(q) ||
      (e.refNo || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q) ||
      (e.type || '').toLowerCase().includes(q)
    );
  });

  const { paginatedItems: pagedEntries, paginationProps: cashbookPagination } = useTablePagination(filteredEntries, 10);

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h2 className="page-title">Daily Cash Book</h2>
            <span style={{ fontSize: '0.72rem', background: '#38bdf815', color: '#0284c7', border: '1px solid #38bdf840', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
              Branch: {activeBranch.code} ({activeBranch.name})
            </span>
            <span style={{ fontSize: '0.72rem', background: '#10b98115', color: '#059669', border: '1px solid #10b98140', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
              🔒 Isolated Branch Ledger
            </span>
          </div>
          <p className="page-desc">Strict branch-isolated daily cash register with running balance, receipts, payments, bank contras, and day-end reconciliation.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={fetchEntries} title="Reload Cash Book">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /><span>Refresh</span>
          </button>
          <button className="secondary-action-btn" onClick={handleExportCashBook}>
            <Download size={14} /><span>Export CSV</span>
          </button>
          <button className="primary-action-btn" onClick={() => setShowNewModal(true)}>
            <Plus size={16} /><span>New Entry</span>
          </button>
        </div>
      </div>

      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Opening Balance</span>
            <div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Wallet size={18} /></div>
          </div>
          <div className="stat-value">₹{openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-change positive"><span>Day Start Balance</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Cash In (Receipts)</span>
            <div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><ArrowDownRight size={18} /></div>
          </div>
          <div className="stat-value" style={{ color: '#059669' }}>₹{totalReceipts.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-change positive"><span>+ Debit Inflow</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Cash Out (Payments)</span>
            <div className="stat-icon-circle" style={{ background: '#ef444420', color: '#ef4444' }}><ArrowUpRight size={18} /></div>
          </div>
          <div className="stat-value" style={{ color: '#dc2626' }}>₹{totalPayments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-change neutral"><span>- Credit Outflow</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Closing Cash Balance</span>
            <div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value" style={{ color: 'var(--brand-accent)' }}>₹{closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-change positive">
            <CheckCircle2 size={13} color={isAllReconciled ? '#10b981' : '#f59e0b'} />
            <span>{reconciledCount}/{entries.length} Reconciled</span>
          </div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="dash-panel-title">Cash Book Register</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({filteredEntries.length} Records)</span>
          </div>
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-input)', padding: '2px', borderRadius: '6px' }}>
              {['ALL', 'Receipt', 'Payment', 'Contra'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: filterType === t ? '700' : '500',
                    background: filterType === t ? 'var(--brand-accent)' : 'transparent',
                    color: filterType === t ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="dash-search-box" style={{ minWidth: '220px' }}>
              <Search size={14} />
              <input
                placeholder="Search party, ref, narration..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Entry #</th>
                <th>Date</th>
                <th>Type</th>
                <th>Party / Account</th>
                <th>Category</th>
                <th>Narration</th>
                <th style={{ textAlign: 'right' }}>Debit (In ₹)</th>
                <th style={{ textAlign: 'right' }}>Credit (Out ₹)</th>
                <th style={{ textAlign: 'right' }}>Balance (₹)</th>
                <th>Reconciled</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No cash book transactions found for this branch. Click <b>"New Entry"</b> to record a cash receipt or payment.
                  </td>
                </tr>
              ) : (
                pagedEntries.map((e) => (
                  <tr key={e.id || e.entryNo}>
                    <td><span className="mono-badge">#{e.entryNo || e.no}</span></td>
                    <td className="td-sub">{e.date || 'Today'}</td>
                    <td>
                      <span className={`type-tag ${e.type === 'Receipt' ? 'green' : e.type === 'Payment' ? 'red' : 'blue'}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="td-bold">{e.party}</td>
                    <td className="td-sub">{e.category || 'General'}</td>
                    <td className="td-sub" style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.narration}>
                      {e.narration}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: e.drAmount > 0 ? '#059669' : 'var(--text-muted)' }}>
                      {e.drAmount > 0 ? `₹${parseFloat(e.drAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: e.crAmount > 0 ? '#dc2626' : 'var(--text-muted)' }}>
                      {e.crAmount > 0 ? `₹${parseFloat(e.crAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--brand-accent)' }}>
                      ₹{parseFloat(e.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleReconcile(e)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: e.reconciled ? '1px solid #10b98150' : '1px solid #f59e0b50',
                          background: e.reconciled ? '#10b98115' : '#f59e0b15',
                          color: e.reconciled ? '#059669' : '#d97706',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        title="Click to toggle reconciliation"
                      >
                        <CheckCircle2 size={12} />
                        <span>{e.reconciled ? 'Verified' : 'Pending'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="table-action-btn danger"
                        onClick={() => handleDeleteEntry(e)}
                        title="Delete entry"
                        style={{ color: '#ef4444', padding: '0.3rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination {...cashbookPagination} />
        </div>
      </div>

      {/* NEW ENTRY MODAL */}
      {showNewModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Wallet size={20} color="var(--brand-accent)" />
                <span>Post Entry to Daily Cash Book ({activeBranch.code})</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowNewModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateEntry}>
              <div className="modal-dialog-body">
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Transaction Type *</label>
                    <select className="form-input" value={entryType} onChange={e => setEntryType(e.target.value)}>
                      <option value="Receipt">Receipt (Cash Inflow / Sale)</option>
                      <option value="Payment">Payment (Cash Outflow / Expense)</option>
                      <option value="Contra">Contra (Bank Cash Transfer)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select className="form-input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                      <option value="Cash">Cash Drawer</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="UPI">UPI / QR</option>
                    </select>
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Party / Payee / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Reliance Jamnagar, Courier Express"
                      className="form-input"
                      value={partyName}
                      onChange={e => setPartyName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Counter Sales, Office Supplies"
                      className="form-input"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Amount (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      placeholder="e.g. 5000"
                      className="form-input"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Voucher / Ref # (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. REC-1029, INV-40"
                      className="form-input"
                      value={refNo}
                      onChange={e => setRefNo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Narration / Detailed Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Counter cash received for fire extinguisher refill"
                    className="form-input"
                    value={narration}
                    onChange={e => setNarration(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Check size={16} /><span>Post Entry to Branch Cash Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── CREATE PURCHASE ORDER FULL PAGE (POSTGRESQL SYNCED) ───────────────
export function CreatePurchasePage({ activeBranch: rawBranch, initialPurchase = null, onBack, onCreated }) {
  const activeBranch = rawBranch || { code: 'AMD-01', name: 'Ahmedabad Hub', city: 'Ahmedabad', state: 'Gujarat', address: 'Plot 42, GIDC Phase II, Ahmedabad' };
  const isEditing = Boolean(initialPurchase);
  const [dbProducts, setDbProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([
    { uid: 'SUP-001', name: 'National Fire Equip Pvt Ltd', phone: '9825123456', email: 'sales@nationalfire.in', address: 'Plot 12, GIDC Halol Industrial Area, Panchmahal, Gujarat', gstin: '24AABCN1234E1Z1' },
    { uid: 'SUP-002', name: 'SafeGuard Industries', phone: '9879123456', email: 'orders@safeguard.com', address: 'Sector 4, Gandhinagar Industrial Zone, Gujarat', gstin: '24AAECS9876G1Z3' },
    { uid: 'SUP-003', name: 'Hindustan Safety Works', phone: '9824987654', email: 'info@hindustansafety.com', address: 'Phase 1, Naroda GIDC, Ahmedabad, Gujarat', gstin: '24AAACH5432K1Z9' },
    { uid: 'SUP-004', name: 'Gujarat Gas & Safety Supplies', phone: '9909012345', email: 'procure@gujgas.com', address: 'Near GIDC Industrial Gate, Halol, Gujarat', gstin: '24AABCG5544B1Z8' }
  ]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form Fields
  const [poNo, setPoNo] = useState(() => initialPurchase?.poNo || initialPurchase?.no || '');
  const [revisionNo, setRevisionNo] = useState(() => initialPurchase?.revisionNo || '1');
  const [supplierSearch, setSupplierSearch] = useState(() => initialPurchase?.supplierName || initialPurchase?.supplier || '');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplierUid, setSelectedSupplierUid] = useState(() => initialPurchase?.supplierUid || '');
  const [supplierName, setSupplierName] = useState(() => initialPurchase?.supplierName || initialPurchase?.supplier || '');
  const [contactPerson, setContactPerson] = useState(() => initialPurchase?.contactPerson || '');
  const [supplierPhone, setSupplierPhone] = useState(() => initialPurchase?.supplierPhone || initialPurchase?.phone || '');
  const [supplierEmail, setSupplierEmail] = useState(() => initialPurchase?.supplierEmail || initialPurchase?.email || '');
  const [supplierAddress, setSupplierAddress] = useState(() => initialPurchase?.supplierAddress || initialPurchase?.address || '');
  const [supplierGstin, setSupplierGstin] = useState(() => initialPurchase?.supplierGstin || initialPurchase?.gstin || '');

  const [poDate, setPoDate] = useState(() => {
    if (initialPurchase?.rawDate) return String(initialPurchase.rawDate).split('T')[0];
    if (initialPurchase?.date && /^\d{4}-\d{2}-\d{2}$/.test(initialPurchase.date)) return initialPurchase.date;
    return new Date().toISOString().split('T')[0];
  });
  const [dueDate, setDueDate] = useState(() => {
    if (initialPurchase?.dueDate) return String(initialPurchase.dueDate).split('T')[0];
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [deliveryDate, setDeliveryDate] = useState(() => {
    if (initialPurchase?.deliveryDate) return String(initialPurchase.deliveryDate).split('T')[0];
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [referenceNo, setReferenceNo] = useState(() => initialPurchase?.referenceNo || '');
  const [paymentTerms, setPaymentTerms] = useState(() => initialPurchase?.paymentTerms || 'Credit 30 Days');
  const [status, setStatus] = useState(() => initialPurchase?.status || 'Ordered');
  const [grnNo, setGrnNo] = useState(() => initialPurchase?.grnNo || '');
  const [poRemark, setPoRemark] = useState(() => initialPurchase?.poRemark || initialPurchase?.remark || '');
  const [termsConditions, setTermsConditions] = useState(() => initialPurchase?.termsConditions || (
    "• Delivery: Within agreed timeline directly to specified branch warehouse.\n" +
    "• Packing & Freight: Included in price unless specifically agreed otherwise.\n" +
    "• Inspection: Subject to quality verification upon delivery; defective items to be replaced within 48h.\n" +
    "• Payment: As per agreed credit terms against original tax invoice & verified GRN."
  ));

  // Line items state
  const [items, setItems] = useState(() => {
    if (initialPurchase?.lineItems && Array.isArray(initialPurchase.lineItems) && initialPurchase.lineItems.length > 0) {
      return initialPurchase.lineItems.map((it, idx) => ({
        id: it.id || idx + 1,
        itemCode: it.itemCode || '',
        name: it.name || it.itemName || '',
        unit: it.unit || 'NOS',
        hsn: it.hsn || it.hsnCode || '',
        price: it.price !== undefined ? it.price : (it.unitPrice || ''),
        discount: it.discount || 0,
        qty: it.qty || 1,
        taxRate: it.taxRate || 18,
        remark: it.remark || '',
        searchQuery: it.name || it.itemName || '',
        showDropdown: false
      }));
    }
    return [
      {
        id: 1,
        itemCode: '',
        name: '',
        unit: 'NOS',
        hsn: '',
        price: '',
        discount: 0,
        qty: 1,
        taxRate: 18,
        remark: '',
        searchQuery: '',
        showDropdown: false
      }
    ];
  });

  const [discountAmount, setDiscountAmount] = useState(() => initialPurchase?.discountAmount || 0);
  const [roundOff, setRoundOff] = useState(() => initialPurchase?.roundOff || 0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch PostgreSQL Products for inventory line items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = activeBranch?.companyId || (activeBranch?.code?.startsWith('AND') || activeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');
        const prodRes = await fetch(`/api/inventory?branch=${encodeURIComponent(activeBranch.code)}&companyId=${encodeURIComponent(companyId)}`);
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data)) {
          setDbProducts(prodJson.data);
        }
      } catch (err) {
        console.warn('Failed to load DB products for purchase:', err);
      }
    };
    fetchData();
  }, [activeBranch.code]);

  // Auto-calculate sequential PO number starting at 1, 2, 3... per branch
  useEffect(() => {
    if (!isEditing && !poNo) {
      const fetchNextPoNo = async () => {
        try {
          const res = await fetch(`/api/purchases?branch=${encodeURIComponent(activeBranch.code)}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const nums = json.data.map(po => {
              const m = (po.no || po.poNo || '').match(/^(\d+)$/);
              return m ? parseInt(m[1], 10) : 0;
            }).filter(n => !isNaN(n) && n > 0);
            const nextSeq = (nums.length > 0 ? Math.max(...nums) : 0) + 1;
            setPoNo(String(nextSeq));
          } else {
            setPoNo('1');
          }
        } catch (err) {
          setPoNo('1');
        }
      };
      fetchNextPoNo();
    }
  }, [activeBranch.code, isEditing]);

  const selectSupplier = (sup) => {
    setSelectedSupplierUid(sup.uid || '');
    setSupplierName(sup.name || sup.company);
    setSupplierSearch(sup.name || sup.company);
    setContactPerson(sup.contactPerson || sup.name || '');
    setSupplierPhone(sup.phone || '');
    setSupplierEmail(sup.email || '');
    setSupplierAddress(sup.address || '');
    setSupplierGstin(sup.gstin || '');
    setShowSupplierDropdown(false);
  };

  // Line Item Handlers
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        itemCode: '',
        name: '',
        unit: 'NOS',
        hsn: '',
        price: '',
        discount: 0,
        qty: 1,
        taxRate: 18,
        remark: '',
        searchQuery: '',
        showDropdown: false
      }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      alert('Purchase Order must have at least one line item.');
      return;
    }
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const selectDbProduct = (rowId, p) => {
    const rawPp = parseFloat(p.purchasePrice || p.cost || 0);
    const pp = rawPp > 0 ? rawPp : (parseFloat(p.salePrice) || 0);
    setItems(prev => prev.map(it => {
      if (it.id !== rowId) return it;
      return {
        ...it,
        itemCode: p.pid || p.sku || '',
        name: p.name || '',
        unit: p.unit || 'NOS',
        hsn: p.hsn || '',
        price: pp || 0,
        discount: 0,
        taxRate: parseFloat(p.gst) || 18,
        searchQuery: p.name,
        showDropdown: false
      };
    }));
  };

  // Precise Line Item Calculations
  const calculatedItems = items.map(it => {
    const q = parseFloat(it.qty) || 1;
    const p = parseFloat(it.price) || 0;
    const d = parseFloat(it.discount) || 0;
    const eff = Math.max(0, p - d);
    const lineSub = Math.round(eff * q * 100) / 100;
    const rate = parseFloat(it.taxRate) || 18;
    const lineTax = Math.round((lineSub * rate / 100) * 100) / 100;
    return {
      ...it,
      effectivePrice: eff,
      subtotal: lineSub,
      taxAmount: lineTax
    };
  });

  const computedSubtotal = Math.round(calculatedItems.reduce((acc, it) => acc + it.subtotal, 0) * 100) / 100;
  const computedTax = Math.round(calculatedItems.reduce((acc, it) => acc + it.taxAmount, 0) * 100) / 100;
  const totalWithTax = Math.round((computedSubtotal + computedTax) * 100) / 100;
  const parsedDiscount = parseFloat(discountAmount) || 0;
  const parsedRoundOff = parseFloat(roundOff) || 0;
  const grandTotal = Math.max(0, Math.round((totalWithTax - parsedDiscount + parsedRoundOff) * 100) / 100);

  const [showCapacityDetails, setShowCapacityDetails] = useState(false);

  // Warehouse Capacity Guard & Space Allocation (Option C Godown: 100 x 50 x 20 ft)
  const capacityCheck = useMemo(() => {
    try {
      const inboundItems = (calculatedItems || [])
        .filter(it => it && (it.name?.trim() || it.itemCode) && parseFloat(it.qty) > 0)
        .map(it => ({
          id: it.itemCode || it.name,
          name: it.name || it.itemCode,
          sku: it.itemCode || 'SKU',
          qty: parseFloat(it.qty) || 1,
          quantity: parseFloat(it.qty) || 1,
          unitCost: it.effectivePrice || 1000
        }));
      if (!inboundItems || inboundItems.length === 0) return null;
      if (typeof checkPurchaseWarehouseCapacity !== 'function') return null;
      return checkPurchaseWarehouseCapacity(DEFAULT_GODOWN, inboundItems, 0);
    } catch (err) {
      console.warn('Warehouse capacity calculation warning:', err);
      return null;
    }
  }, [calculatedItems]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!supplierName.trim()) {
      alert('Please specify a vendor/supplier name.');
      return;
    }
    if (items.length === 0 || !items.some(it => it.name.trim() || it.itemCode)) {
      alert('Please add at least one line item with a name or code.');
      return;
    }

    setLoading(true);
    try {
      const companyId = activeBranch?.companyId || (activeBranch?.code?.startsWith('AND') || activeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');
      const payload = {
        poNo: poNo.trim(),
        branchCode: activeBranch.code,
        companyId,
        supplierUid: selectedSupplierUid,
        supplierName: supplierName.trim(),
        contactPerson: contactPerson.trim(),
        supplierPhone: supplierPhone.trim(),
        supplierEmail: supplierEmail.trim(),
        supplierAddress: supplierAddress.trim(),
        supplierGstin: supplierGstin.trim(),
        poDate,
        dueDate,
        deliveryDate,
        referenceNo: referenceNo.trim(),
        revisionNo: revisionNo.trim(),
        items: items.map(it => ({
          itemCode: it.itemCode || 'CUSTOM',
          name: it.name || it.searchQuery || 'Custom Material',
          unit: it.unit || 'NOS',
          hsn: it.hsn || '',
          price: parseFloat(it.price) || 0,
          discount: parseFloat(it.discount) || 0,
          qty: parseFloat(it.qty) || 1,
          taxRate: parseFloat(it.taxRate) || 18,
          remark: it.remark || ''
        })),
        subtotal: computedSubtotal,
        totalTax: computedTax,
        discountAmount: parsedDiscount,
        roundOff: parsedRoundOff,
        grandTotal: grandTotal,
        paymentTerms,
        status,
        grnNo,
        poRemark: poRemark.trim(),
        termsConditions,
        createdBy: 'Admin'
      };

      const url = isEditing
        ? `/api/purchases/${encodeURIComponent(initialPurchase.id || initialPurchase.poNo)}`
        : `/api/purchases`;

      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success && json.data) {
        showToast(isEditing ? `Purchase Order PO #${json.data.poNo} updated!` : `Purchase Order PO #${json.data.poNo} generated & saved!`);
        setTimeout(() => {
          if (onCreated) {
            onCreated(json.data);
          } else {
            onBack();
          }
        }, 500);
      } else {
        alert(json.message || 'Failed to save purchase order');
      }
    } catch (err) {
      alert('Error saving purchase order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = (suppliers || []).filter(s => {
    if (!s) return false;
    const q = (supplierSearch || '').toLowerCase();
    const sPhone = String(s.phone || '');
    return (
      (s.name || '').toLowerCase().includes(q) ||
      sPhone.includes(supplierSearch || '') ||
      (s.gstin || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="invoice-page-container">
      {/* ── TOP HEADER BAR ── */}
      <div className="invoice-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="button" className="invoice-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /><span>Back to Purchases</span>
          </button>
          <div>
            <h2 className="page-title" style={{ margin: 0, fontSize: '1.45rem' }}>
              {isEditing ? `Edit Purchase Order (PO #${poNo})` : 'Create Purchase Order'}
            </h2>
            <p className="page-desc" style={{ margin: '0.2rem 0 0 0' }}>
              {isEditing
                ? `Update vendor details, procurement items, and delivery terms for PO #${poNo}.`
                : `GST-compliant procurement & vendor order linked directly with PostgreSQL inventory & sequential series (${activeBranch.name}).`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="mono-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.35rem 0.75rem' }}>
            <Database size={13} style={{ marginRight: '5px' }} /> PostgreSQL: bizzpilot
          </span>
          <span className="mono-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.35rem 0.75rem' }}>
            Branch: {activeBranch.code}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── CARD 1: PURCHASE ORDER & VENDOR DETAILS ── */}
        <div className="invoice-form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <Building2 size={18} color="var(--brand-accent)" />
              Purchase Order & Vendor Details
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Sequential Series 1, 2, 3... per Branch
            </span>
          </div>

          {/* ── UNIFIED 4-COLUMN PO DETAILS GRID ── */}
          <div className="invoice-form-grid">
            {/* ROW 1: PO # (1), Vendor Legal Name (span 2), Vendor GSTIN (1) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">
                <span>PO # *</span>
                <span style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 600 }}>Series ({activeBranch.code})</span>
              </label>
              <input
                type="text"
                required
                className="invoice-input"
                style={{ fontWeight: 700, letterSpacing: '0.5px' }}
                value={poNo}
                onChange={e => setPoNo(e.target.value)}
                placeholder="1, 2, 3..."
                title={`Sequential PO series for ${activeBranch.name}`}
              />
            </div>

            <div className="invoice-field-group invoice-col-span-2" style={{ position: 'relative' }}>
              <label className="invoice-field-label">
                <span>Vendor / Supplier Legal Name *</span>
                {selectedSupplierUid && <span style={{ color: '#10b981', fontSize: '0.72rem' }}>✓ Linked ({selectedSupplierUid})</span>}
              </label>
              <input
                type="text"
                required
                className="invoice-input"
                placeholder="Type to search vendor or enter custom company..."
                value={supplierSearch}
                onChange={e => {
                  setSupplierSearch(e.target.value);
                  setSupplierName(e.target.value);
                  setShowSupplierDropdown(true);
                }}
                onFocus={() => setShowSupplierDropdown(true)}
              />

              {/* Vendor Autocomplete Dropdown */}
              {showSupplierDropdown && supplierSearch.trim() && (
                <div className="invoice-autocomplete-dropdown">
                  {filteredSuppliers.length === 0 ? (
                    <div style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No registered vendor found. Entering as new custom supplier.
                    </div>
                  ) : (
                    filteredSuppliers.map(s => (
                      <div
                        key={s.uid}
                        className="invoice-autocomplete-item"
                        onClick={() => selectSupplier(s)}
                      >
                        <div>
                          <strong>{s.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Phone: {s.phone} • GSTIN: {s.gstin || 'URP'}
                          </div>
                        </div>
                        <span className="mono-badge" style={{ fontSize: '0.7rem' }}>{s.uid}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Vendor GSTIN</label>
              <input
                type="text"
                className="invoice-input"
                value={supplierGstin}
                onChange={e => setSupplierGstin(e.target.value.toUpperCase())}
                placeholder="24AABCN1234E1Z1"
              />
            </div>

            {/* ROW 2: Contact Person (1), Phone (1), Email (1), Address (1) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Contact Person</label>
              <input
                type="text"
                className="invoice-input"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="Contact person name..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Supplier Phone</label>
              <input
                type="text"
                className="invoice-input"
                value={supplierPhone}
                onChange={e => setSupplierPhone(e.target.value)}
                placeholder="Phone number..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Supplier Email</label>
              <input
                type="email"
                className="invoice-input"
                value={supplierEmail}
                onChange={e => setSupplierEmail(e.target.value)}
                placeholder="Email address..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Dispatch / Billing Address</label>
              <input
                type="text"
                className="invoice-input"
                value={supplierAddress}
                onChange={e => setSupplierAddress(e.target.value)}
                placeholder="Supplier factory / warehouse address..."
              />
            </div>

            {/* ROW 3: PO Date (1), Delivery Due Date (1), Payment Terms (1), Quote & Rev (1) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">PO Date *</label>
              <input
                type="date"
                required
                className="invoice-input"
                value={poDate}
                onChange={e => setPoDate(e.target.value)}
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Expected Delivery Date</label>
              <input
                type="date"
                className="invoice-input"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Payment Terms</label>
              <select
                className="invoice-select"
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
              >
                <option value="Credit 30 Days">Credit 30 Days (Standard)</option>
                <option value="Credit 15 Days">Credit 15 Days</option>
                <option value="Immediate / Cash">Immediate / Cash Drawer</option>
                <option value="50% Advance, 50% Delivery">50% Advance, 50% Delivery</option>
                <option value="100% Advance">100% Advance Payment</option>
                <option value="Against LR / Delivery">Against LR / Delivery Challan</option>
              </select>
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">
                <span>Quote / Ref No.</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>Rev</span>
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  className="invoice-input"
                  style={{ flex: 1 }}
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  placeholder="QUO-9912 / Inquiry"
                />
                <input
                  type="text"
                  className="invoice-input"
                  style={{ width: '56px', textAlign: 'center', padding: '0.65rem 0.25rem' }}
                  value={revisionNo}
                  onChange={e => setRevisionNo(e.target.value)}
                  placeholder="Rev"
                  title="Revision count"
                />
              </div>
            </div>

            {/* ROW 4: Order Status (1), GRN Reference (1), Receiving Branch Warehouse (2) */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Order Status</label>
              <select
                className="invoice-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Ordered">Ordered (Pending GRN)</option>
                <option value="GRN Done">GRN Done (Stock Received)</option>
                <option value="Invoiced">Invoiced by Vendor</option>
                <option value="Paid">Payment Settled</option>
              </select>
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">GRN Reference # (Optional)</label>
              <input
                type="text"
                className="invoice-input"
                value={grnNo}
                onChange={e => setGrnNo(e.target.value)}
                placeholder="e.g. GRN-0419"
              />
            </div>

            <div className="invoice-field-group invoice-col-span-2">
              <label className="invoice-field-label">Ship To / Destination Warehouse</label>
              <input
                type="text"
                className="invoice-input"
                readOnly
                value={`${activeBranch.name} Warehouse (${activeBranch.code}) • ${activeBranch.address || 'c/o BizzPilot Branch Logistics'}`}
                style={{ opacity: 0.85, background: 'rgba(255, 255, 255, 0.03)' }}
              />
            </div>
          </div>

          {/* Notes & Terms Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-medium)' }}>
            <div className="invoice-field-group">
              <label className="invoice-field-label">Internal Purchase Notes / Remarks</label>
              <textarea
                className="invoice-textarea"
                rows={3}
                value={poRemark}
                onChange={e => setPoRemark(e.target.value)}
                placeholder="Procurement approval notes, department justification, or urgency..."
              />
            </div>

            <div className="invoice-field-group">
              <label className="invoice-field-label">Purchase Order Terms & Conditions</label>
              <textarea
                className="invoice-textarea"
                rows={3}
                value={termsConditions}
                onChange={e => setTermsConditions(e.target.value)}
                placeholder="Delivery, inspection, transit insurance, and credit terms..."
              />
            </div>
          </div>
        </div>

        {/* ── CARD 2: LINE ITEMS TABLE ── */}
        <div className="invoice-form-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <Boxes size={18} color="var(--brand-accent)" />
              Line Items • Live PostgreSQL Inventory & Direct Materials
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {items.length} {items.length === 1 ? 'row' : 'rows'} configured
            </span>
          </div>

          <div className="invoice-items-table-wrap">
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th style={{ width: '27%' }}>Item Description / Product Code</th>
                  <th style={{ width: '7%' }}>Unit</th>
                  <th style={{ width: '9%' }}>HSN Code</th>
                  <th style={{ width: '11%' }}>Purchase Rate (₹)</th>
                  <th style={{ width: '9%' }}>Discount (₹)</th>
                  <th style={{ width: '8%' }}>Qty</th>
                  <th style={{ width: '8%' }}>Tax %</th>
                  <th style={{ width: '15%' }}>Subtotal (₹)</th>
                  <th style={{ width: '6%', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(calculatedItems || []).map((item, idx) => {
                  if (!item) return null;
                  const filteredRowProducts = (dbProducts || []).filter(p => {
                    if (!p) return false;
                    const q = (item.searchQuery || '').toLowerCase().trim();
                    if (!q) return true;
                    return (
                      (p.pid || '').toLowerCase().includes(q) ||
                      (p.name || '').toLowerCase().includes(q) ||
                      (p.category || '').toLowerCase().includes(q)
                    );
                  });

                  return (
                    <tr key={item.id} style={{ position: 'relative', zIndex: item.showDropdown ? 50 : 1 }}>
                      {/* Product search input + autocomplete */}
                      <td style={{ position: 'relative', overflow: 'visible' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            className="invoice-input"
                            style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', marginBottom: '4px' }}
                            placeholder="Type product PID or name..."
                            value={item.searchQuery}
                            onChange={e => {
                              handleItemChange(item.id, 'searchQuery', e.target.value);
                              handleItemChange(item.id, 'name', e.target.value);
                              handleItemChange(item.id, 'showDropdown', true);
                            }}
                            onFocus={() => handleItemChange(item.id, 'showDropdown', true)}
                          />

                          {/* Live Autocomplete Dropdown from PostgreSQL directly below product input */}
                          {item.showDropdown && item.searchQuery && (
                            <div
                              className="invoice-autocomplete-dropdown"
                              style={{
                                top: 'calc(100% - 2px)',
                                minWidth: '340px',
                                zIndex: 1200,
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid var(--border-medium)'
                              }}
                            >
                              {filteredRowProducts.length === 0 ? (
                                <div style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  No database item matched. Entering as custom material.
                                </div>
                              ) : (
                                filteredRowProducts.map(prod => (
                                  <div
                                    key={prod.id || prod.pid}
                                    className="invoice-autocomplete-item"
                                    onClick={() => selectDbProduct(item.id, prod)}
                                  >
                                    <div>
                                      <span className="mono-badge" style={{ color: 'var(--brand-accent)', marginRight: '6px' }}>{prod.pid}</span>
                                      <strong>{prod.name}</strong>
                                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                        {prod.category} • HSN: {prod.hsn || '8424'} • Stock: <span style={{ color: prod.currentStock <= prod.minStock ? '#f59e0b' : '#10b981', fontWeight: '700' }}>{prod.currentStock || 0}</span>
                                      </div>
                                    </div>
                                    <span style={{ fontWeight: '700', color: 'var(--brand-accent)', fontSize: '0.8rem' }}>
                                      ₹{parseFloat(prod.purchasePrice || prod.cost || prod.salePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>

                        {/* Line note input below product search */}
                        <input
                          type="text"
                          className="invoice-input"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                          placeholder="Material grade / specifications / note..."
                          value={item.remark}
                          onChange={e => handleItemChange(item.id, 'remark', e.target.value)}
                        />
                      </td>

                      {/* Unit */}
                      <td>
                        <input
                          type="text"
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.5rem', fontSize: '0.82rem', textAlign: 'center' }}
                          value={item.unit}
                          onChange={e => handleItemChange(item.id, 'unit', e.target.value.toUpperCase())}
                        />
                      </td>

                      {/* HSN */}
                      <td>
                        <input
                          type="text"
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.5rem', fontSize: '0.82rem' }}
                          value={item.hsn}
                          onChange={e => handleItemChange(item.id, 'hsn', e.target.value)}
                          placeholder="HSN"
                        />
                      </td>

                      {/* Purchase Price */}
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          required
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                          value={item.price}
                          onChange={e => handleItemChange(item.id, 'price', e.target.value)}
                        />
                      </td>

                      {/* Discount */}
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                          value={item.discount}
                          onChange={e => handleItemChange(item.id, 'discount', e.target.value)}
                        />
                      </td>

                      {/* Qty */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          required
                          className="invoice-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', textAlign: 'center' }}
                          value={item.qty}
                          onChange={e => handleItemChange(item.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                        />
                      </td>

                      {/* Tax % */}
                      <td>
                        <select
                          className="invoice-select"
                          style={{ padding: '0.45rem 0.5rem', fontSize: '0.82rem' }}
                          value={item.taxRate}
                          onChange={e => handleItemChange(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </td>

                      {/* Subtotal & Tax */}
                      <td>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          ₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>
                          tax: ₹{item.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Remove Row Action */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                          title="Remove material row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="secondary-action-btn"
            onClick={handleAddItem}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem', marginTop: '0.5rem' }}
          >
            <Plus size={15} /><span>Add Item Row</span>
          </button>

          {/* ── WAREHOUSE CAPACITY GUARD & SPACE ALLOCATION (Option C Standard Godown) ── */}
          {capacityCheck && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: '1.25rem',
                marginBottom: '1rem',
                background: 'var(--bg-card, #ffffff)',
                border: capacityCheck.status === 'RED'
                  ? '2px solid #ef4444'
                  : capacityCheck.status === 'AMBER'
                  ? '2px solid #f59e0b'
                  : '1px solid var(--border-medium, #cbd5e1)',
                borderLeft: capacityCheck.status === 'RED'
                  ? '6px solid #ef4444'
                  : capacityCheck.status === 'AMBER'
                  ? '6px solid #f59e0b'
                  : '6px solid #10b981',
                borderRadius: '12px',
                padding: '1.15rem 1.35rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: capacityCheck.status === 'RED'
                        ? 'rgba(239, 68, 68, 0.12)'
                        : capacityCheck.status === 'AMBER'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(16, 185, 129, 0.12)',
                      color: capacityCheck.status === 'RED'
                        ? '#ef4444'
                        : capacityCheck.status === 'AMBER'
                        ? '#d97706'
                        : '#10b981'
                    }}
                  >
                    <Boxes size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                        Warehouse Capacity Guard (Option C Godown: {capacityCheck?.godown?.lengthFt ?? 100}×{capacityCheck?.godown?.widthFt ?? 50} ft)
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          background: capacityCheck.status === 'RED'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : capacityCheck.status === 'AMBER'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(16, 185, 129, 0.15)',
                          color: capacityCheck.status === 'RED'
                            ? '#ef4444'
                            : capacityCheck.status === 'AMBER'
                            ? '#d97706'
                            : '#059669',
                          border: capacityCheck.status === 'RED'
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : capacityCheck.status === 'AMBER'
                            ? '1px solid rgba(245, 158, 11, 0.3)'
                            : '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        {capacityCheck.status === 'RED' ? 'Capacity Exceeded' : capacityCheck.status === 'AMBER' ? 'High Utilization' : 'Verified Fit'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #475569)', marginTop: '0.15rem' }}>
                      {capacityCheck.recommendation} • Destination: {activeBranch?.name || activeBranch?.code}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowCapacityDetails(prev => !prev)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      background: 'var(--bg-secondary, #f1f5f9)',
                      border: '1px solid var(--border-medium, #cbd5e1)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--text-primary, #0f172a)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{showCapacityDetails ? 'Hide Stack Breakdown' : 'View Stack Breakdown'}</span>
                    <ChevronDown size={14} style={{ transform: showCapacityDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
              </div>

              {/* 4 Mini KPI Chips */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  marginTop: '0.9rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle, #e2e8f0)'
                }}
              >
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>Total Inbound Stacks</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                    {capacityCheck.totalStacks} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>stacks ({capacityCheck.totalQuantity} units)</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>Floor Area Required</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                    {capacityCheck.requiredAreaSqFt} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>sq ft / {capacityCheck?.godown?.netStorageAreaSqFt ?? 3496} net</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>Post-Delivery Occupancy</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: capacityCheck.occupancyPctAfterInbound > 90 ? '#ef4444' : '#0f172a' }}>
                    {capacityCheck.occupancyPctAfterInbound}% <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>({capacityCheck.remainingAreaSqFt} sq ft free)</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>Est. Storage Cost (SAC 996729)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7' }}>
                    ₹{(capacityCheck?.storageBilling?.total ?? 0).toLocaleString('en-IN')}<span style={{ fontSize: '0.72rem', fontWeight: 600 }}>/mo (incl 18% GST)</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Stacking Breakdown */}
              {showCapacityDetails && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle, #e2e8f0)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary, #f1f5f9)', color: 'var(--text-secondary, #475569)', textAlign: 'left' }}>
                        <th style={{ padding: '0.4rem 0.6rem' }}>Line Item</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>PO Qty</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Units / Stack (n)</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Stacks (S)</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Stack Area</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Total Area (Aocc)</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Storage Burden</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(capacityCheck.items || []).map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
                          <td style={{ padding: '0.45rem 0.6rem', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                            {it.name} <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.72rem' }}>({it.sku})</span>
                          </td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right' }}>{it.quantity}</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right', fontWeight: 700 }}>{it?.stacking?.unitsPerStack ?? 1}</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right', fontWeight: 700 }}>{it?.stacking?.stacksNeeded ?? 1}</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right' }}>{it?.stacking?.areaPerStackSqFt ?? 2} sq ft</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right', fontWeight: 700 }}>{it?.stacking?.totalAreaSqFt ?? 2} sq ft</td>
                          <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                            ₹{(((it?.stacking?.totalAreaSqFt ?? 2) * (DEFAULT_GODOWN.storageRate || 20) * 1.18)).toFixed(0)}/mo
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TOTAL BOX ── */}
          <div className="invoice-total-box">
            <div className="invoice-total-row">
              <span>Subtotal (before tax):</span>
              <span style={{ fontWeight: '600' }}>₹{computedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="invoice-total-row" style={{ color: '#059669' }}>
              <span>Total Tax (GST):</span>
              <span style={{ fontWeight: '600' }}>₹{computedTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="invoice-total-row">
              <span>Total (with tax):</span>
              <span style={{ fontWeight: '700' }}>₹{totalWithTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="invoice-total-row" style={{ alignItems: 'center' }}>
              <span>Discount Amount (₹):</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="invoice-input"
                style={{ width: '130px', padding: '0.35rem 0.6rem', fontSize: '0.82rem', textAlign: 'right' }}
                value={discountAmount}
                onChange={e => setDiscountAmount(e.target.value)}
              />
            </div>

            <div className="invoice-total-row" style={{ alignItems: 'center' }}>
              <span>Round Off (₹):</span>
              <input
                type="number"
                step="0.01"
                className="invoice-input"
                style={{ width: '130px', padding: '0.35rem 0.6rem', fontSize: '0.82rem', textAlign: 'right' }}
                value={roundOff}
                onChange={e => setRoundOff(e.target.value)}
              />
            </div>

            <div className="invoice-total-row grand">
              <span>Payable PO Total:</span>
              <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ACTION: GENERATE & SAVE PURCHASE ORDER ── */}
        <div style={{ marginTop: '1.75rem', marginBottom: '2.5rem' }}>
          <button
            type="submit"
            id="btn-generate-save-po"
            className="invoice-submit-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            <FileText size={20} />
            <span>{loading ? (isEditing ? 'Updating in PostgreSQL...' : 'Posting to PostgreSQL...') : (isEditing ? 'UPDATE & SAVE PURCHASE ORDER' : 'GENERATE & CONFIRM PURCHASE ORDER')}</span>
          </button>
        </div>
      </form>

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// ─── PURCHASE ORDER PRINT PAGE (PERFECT A4 SINGLE-PAGE FORMAT) ──────────
export function PurchaseOrderPrintPage({ purchase: rawPurchase, activeBranch: rawBranch, currentUser, currentTenant, onBack, onEdit }) {
  const activeBranch = rawBranch || { code: 'AMD-01', name: 'Ahmedabad Hub', city: 'Ahmedabad', state: 'Gujarat', address: 'Plot 42, GIDC Phase II, Ahmedabad' };
  const purchase = rawPurchase || {
    id: 1,
    poNo: 'PO-2026-001',
    supplierName: 'National Fire Safety Equipments Ltd',
    supplierGstin: '24AAACN1234F1Z5',
    date: new Date().toISOString().split('T')[0],
    status: 'Ordered',
    totalNum: 11200,
    subtotal: 9491.53,
    totalTax: 1708.47,
    items: 10,
    paymentTerms: 'Credit 30 Days'
  };

  const COMPANY_PROFILES = {
    comp_mann: {
      name: 'MANN ENGINEERS',
      legalName: 'Mann Engineers Fire Safety Pvt Ltd',
      subline: 'Precision Engineering & Industrial Fire Protection Systems',
      address: 'Plot No. 42/B, Phase-II, GIDC Industrial Estate, Halol - 389350, Gujarat, India',
      city: 'Halol / Vadodara',
      phone: '+91 98250 12345 / 02676 220199',
      email: 'purchase@mannengineers.com',
      website: 'www.mannengineers.com',
      gstin: '24AABCM8920C1ZP',
      state: 'Gujarat',
      stateCode: '24'
    },
    comp_mashtech: {
      name: 'MASH TECH',
      legalName: 'Mash Tech Solutions Pvt Ltd',
      subline: 'Enterprise Technology & Industrial Automation Solutions',
      address: 'Tower B, 4th Floor, Infotech Park, Anand - 388001, Gujarat, India',
      city: 'Anand',
      phone: '+91 98790 54321 / 02692 230455',
      email: 'purchase@mashtech.in',
      website: 'www.mashtech.in',
      gstin: '24AABCM9988T1Z9',
      state: 'Gujarat',
      stateCode: '24'
    }
  };

  const branchCode = purchase.branchCode || activeBranch?.code || '';
  const isMash =
    purchase.companyId === 'comp_mashtech' ||
    activeBranch?.companyId === 'comp_mashtech' ||
    currentUser?.companyId === 'comp_mashtech' ||
    currentUser?.company_id === 'comp_mashtech' ||
    (currentUser?.companyName && currentUser.companyName.toLowerCase().includes('mash')) ||
    (currentTenant?.id === 'comp_mashtech') ||
    (currentTenant?.name && currentTenant.name.toLowerCase().includes('mash')) ||
    Boolean(branchCode.startsWith('AND') || branchCode.startsWith('SRU'));

  const baseProfile = isMash ? COMPANY_PROFILES.comp_mashtech : COMPANY_PROFILES.comp_mann;

  const headerCompanyName = isMash ? 'MASH TECH' : 'MANN ENGINEERS';
  const headerSubline = baseProfile.subline;
  const headerAddress = baseProfile.address;
  const headerPhone = baseProfile.phone;
  const headerEmail = baseProfile.email;
  const headerWebsite = baseProfile.website;
  const headerGstin = baseProfile.gstin;
  const headerState = baseProfile.state;
  const headerStateCode = baseProfile.stateCode;
  const headerCity = baseProfile.city;

  const poNo = purchase.poNo || purchase.no || '1';
  const supplierName = purchase.supplierName || purchase.supplier || 'National Fire Equip Pvt Ltd';
  const supplierPhone = purchase.supplierPhone || purchase.phone || '';
  const supplierEmail = purchase.supplierEmail || purchase.email || '';
  const supplierAddress = purchase.supplierAddress || purchase.address || 'GIDC Industrial Area, Gujarat';
  const supplierGstin = purchase.supplierGstin || purchase.gstin || '24AABCN1234E1Z1';
  const contactPerson = purchase.contactPerson || '';

  const poDate = purchase.date || (purchase.rawDate ? new Date(purchase.rawDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '23 Oct 2026');
  const deliveryDate = purchase.deliveryDate ? new Date(purchase.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : poDate;
  const paymentTerms = purchase.paymentTerms || 'Credit 30 Days';
  const refNo = purchase.referenceNo || '-';
  const grnNo = purchase.grnNo || '';

  const lineItems = Array.isArray(purchase.lineItems) && purchase.lineItems.length > 0
    ? purchase.lineItems
    : [
      {
        id: 1,
        name: 'Industrial Valve & Extinguisher Assembly',
        hsn: '8424',
        qty: purchase.items || 10,
        unit: 'NOS',
        price: purchase.subtotal ? (purchase.subtotal / (purchase.items || 10)) : 1120.00,
        discount: 0,
        effectivePrice: purchase.subtotal ? (purchase.subtotal / (purchase.items || 10)) : 1120.00,
        taxRate: 18,
        taxAmount: purchase.totalTax || Math.round((purchase.subtotal || 11200) * 0.18),
        subtotal: purchase.subtotal || 11200.00
      }
    ];

  const subtotal = typeof purchase.subtotal === 'number' && purchase.subtotal > 0
    ? purchase.subtotal
    : lineItems.reduce((s, it) => s + (parseFloat(it.subtotal) || 0), 0);
  const totalTax = typeof purchase.totalTax === 'number' && purchase.totalTax > 0
    ? purchase.totalTax
    : lineItems.reduce((s, it) => s + (parseFloat(it.taxAmount) || 0), 0);
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;
  const discountAmount = parseFloat(purchase.discountAmount) || 0;
  const roundOff = parseFloat(purchase.roundOff) || 0;
  const grandTotal = typeof purchase.totalNum === 'number' && purchase.totalNum > 0
    ? purchase.totalNum
    : (subtotal + totalTax - discountAmount + roundOff);

  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const n = Math.floor(Math.abs(num));
    if (n === 0) return 'Rupees Zero Only';
    const makeWords = (val) => {
      if (val < 20) return a[val];
      if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : '');
      if (val < 1000) return a[Math.floor(val / 100)] + ' Hundred' + (val % 100 !== 0 ? ' and ' + makeWords(val % 100) : '');
      if (val < 100000) return makeWords(Math.floor(val / 1000)) + ' Thousand' + (val % 1000 !== 0 ? ' ' + makeWords(val % 1000) : '');
      if (val < 10000000) return makeWords(Math.floor(val / 100000)) + ' Lakh' + (val % 100000 !== 0 ? ' ' + makeWords(val % 100000) : '');
      return makeWords(Math.floor(val / 10000000)) + ' Crore' + (val % 10000000 !== 0 ? ' ' + makeWords(val % 10000000) : '');
    };
    return 'Rupees ' + makeWords(n) + ' Only';
  };

  return (
    <div className="invoice-print-wrapper animate-fade-in">
      {/* ── TOP ACTION BAR (Hidden in print) ── */}
      <div className="print-action-bar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button type="button" className="secondary-action-btn" onClick={onBack}>
            <ArrowLeft size={16} /><span>Back to Purchases</span>
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Viewing Printable Purchase Order: <strong style={{ color: 'var(--text-primary)' }}>PO #{poNo}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {onEdit && (
            <button type="button" className="secondary-action-btn" onClick={() => onEdit(purchase)}>
              <Edit3 size={15} /><span>Edit PO</span>
            </button>
          )}
          <button type="button" className="primary-action-btn" onClick={() => window.print()}>
            <Printer size={16} /><span>Print PO / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* ── PURCHASE ORDER A4 SHEET ── */}
      <div className="printable-tax-invoice">
        <div className="pti-body-wrap">
          {/* Header */}
          <div className="pti-header">
            <div className="pti-company-info">
              <h1 className="pti-company-name">{headerCompanyName}</h1>
              <div className="pti-subline">{headerSubline}</div>
              <div className="pti-address">
                {headerAddress}<br />
                <strong>Branch:</strong> {activeBranch.name} ({activeBranch.code}) | <strong>Phone:</strong> {headerPhone}<br />
                <strong>Email:</strong> {headerEmail} | <strong>Website:</strong> {headerWebsite}<br />
                <strong>GSTIN:</strong> {headerGstin} | <strong>State:</strong> {headerState} (Code: {headerStateCode})
              </div>
            </div>
            <div className="pti-badge-box">
              <div className="pti-tax-title">PURCHASE ORDER</div>
              <div className="pti-tax-subtitle">(Official Procurement Copy)</div>
              <div className="pti-inv-no-badge">PO #{poNo}</div>
            </div>
          </div>

          {/* PO & Supplier Meta Grid */}
          <div className="pti-meta-grid">
            <div className="pti-meta-col">
              <div className="pti-col-title">PURCHASE ORDER DETAILS</div>
              <table className="pti-meta-table">
                <tbody>
                  <tr><td>PO Number:</td><td><strong>PO #{poNo}</strong></td></tr>
                  <tr><td>PO Date:</td><td>{poDate}</td></tr>
                  <tr><td>Delivery Due:</td><td>{deliveryDate}</td></tr>
                  <tr><td>Payment Terms:</td><td><span className="pti-chip">{paymentTerms}</span></td></tr>
                  <tr><td>Quote / Ref #:</td><td>{refNo}</td></tr>
                  {grnNo && <tr><td>GRN Number:</td><td><strong>{grnNo}</strong></td></tr>}
                  <tr><td>Order Status:</td><td><strong style={{ color: '#0284c7' }}>{purchase.status || 'Ordered'}</strong></td></tr>
                </tbody>
              </table>
            </div>

            <div className="pti-meta-col">
              <div className="pti-col-title">VENDOR / SUPPLIER DETAILS</div>
              <table className="pti-meta-table">
                <tbody>
                  <tr><td>Vendor Name:</td><td><strong>{supplierName}</strong></td></tr>
                  {contactPerson && <tr><td>Contact Person:</td><td>{contactPerson}</td></tr>}
                  <tr><td>Billing Address:</td><td>{supplierAddress}</td></tr>
                  {supplierPhone && <tr><td>Phone:</td><td>{supplierPhone}</td></tr>}
                  {supplierEmail && <tr><td>Email:</td><td>{supplierEmail}</td></tr>}
                  <tr><td>Vendor GSTIN:</td><td><strong style={{ color: '#0f766e' }}>{supplierGstin}</strong></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="pti-items-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>#</th>
                <th style={{ width: '38%' }}>Description of Materials / Items</th>
                <th style={{ width: '10%' }}>HSN/SAC</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Qty</th>
                <th style={{ width: '7%', textAlign: 'center' }}>Unit</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Tax %</th>
                <th style={{ width: '13%', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((it, idx) => {
                const qty = parseFloat(it.qty) || 1;
                const rate = parseFloat(it.price || it.effectivePrice || it.unitPrice) || 0;
                const taxR = parseFloat(it.taxRate) || 18;
                const lineSub = parseFloat(it.subtotal) || (qty * rate);
                const lineTax = parseFloat(it.taxAmount) || (lineSub * taxR / 100);
                const lineTot = Math.round((lineSub + lineTax) * 100) / 100;
                return (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td>
                      <strong>{it.name || it.itemName || 'Industrial Product Component'}</strong>
                      {it.itemCode && it.itemCode !== 'CUSTOM' && <div className="pti-item-code">SKU: {it.itemCode}</div>}
                      {it.remark && <div className="pti-item-remark">{it.remark}</div>}
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>{it.hsn || it.hsnCode || '8424'}</td>
                    <td style={{ textAlign: 'right' }}>{qty}</td>
                    <td style={{ textAlign: 'center' }}>{it.unit || 'NOS'}</td>
                    <td style={{ textAlign: 'right' }}>₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'right' }}>{taxR}%</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{lineTot.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pti-footer-wrap">
          {/* Calculation & Summary Footer */}
          <div className="pti-summary-grid">
            <div className="pti-summary-left">
              <div className="pti-amount-words">
                <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Total PO Amount in Words:</span>
                <div style={{ fontWeight: 700, color: '#111827', marginTop: '2px' }}>{numberToWords(grandTotal)}</div>
              </div>

              <div className="pti-bank-details">
                <div className="pti-section-label">Ship To / Delivery Destination:</div>
                <table className="pti-bank-table">
                  <tbody>
                    <tr><td>Receiving Branch:</td><td><strong>{activeBranch.name} ({activeBranch.code})</strong></td></tr>
                    <tr><td>Delivery Address:</td><td>{activeBranch.address || headerAddress}</td></tr>
                    <tr><td>Receiving Dept:</td><td>Warehouse Receiving & Quality Verification Division</td></tr>
                    <tr><td>Delivery Challan:</td><td>Must quote PO #{poNo} on all packing slips & invoices</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pti-terms">
                <div className="pti-section-label">Purchasing Terms & Quality Standards:</div>
                <ol>
                  <li>Deliveries must strictly match specifications and quality standards agreed upon.</li>
                  <li>All consignments are subject to physical inspection and GRN sign-off before inventory intake.</li>
                  <li>Disbursement as per agreed terms ({paymentTerms}) against verified GRN and original GST tax invoice.</li>
                </ol>
              </div>
            </div>

            <div className="pti-summary-right">
              <table className="pti-calc-table">
                <tbody>
                  <tr>
                    <td>Taxable Value:</td>
                    <td style={{ textAlign: 'right' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>CGST (Central Tax):</td>
                    <td style={{ textAlign: 'right' }}>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>SGST (State Tax):</td>
                    <td style={{ textAlign: 'right' }}>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  {discountAmount > 0 && (
                    <tr>
                      <td>Special Discount:</td>
                      <td style={{ textAlign: 'right', color: '#16a34a' }}>- ₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  {roundOff !== 0 && (
                    <tr>
                      <td>Round Off:</td>
                      <td style={{ textAlign: 'right' }}>₹{roundOff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  <tr className="pti-grand-total-row">
                    <td><strong>TOTAL PO VALUE (₹):</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pti-sign-box">
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>For <strong>{headerCompanyName}</strong></div>
                <div className="pti-signature-line">
                  <div style={{ height: '50px' }}></div>
                  <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '4px', fontSize: '0.78rem', color: '#374151' }}>
                    Authorized Procurement Officer / Seal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="pti-footer-note">
            This is an electronically generated Purchase Order authorized under BizzPilot Multi-Branch ERP. E. & O.E.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PURCHASES (POSTGRESQL SYNCED & BRANCH ISOLATED) ───────────────────
export function BranchPurchases({ activeBranch: rawBranch, currentUser, currentTenant }) {
  const activeBranch = rawBranch || { code: 'AMD-01', name: 'Ahmedabad Hub', city: 'Ahmedabad', state: 'Gujarat' };
  const safeBranch = activeBranch;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    const h = typeof window !== 'undefined' ? (window.location.hash || '') : '';
    if (h.includes('/purchases/create')) return 'create';
    if (h.includes('/purchases/edit')) return 'edit';
    if (h.includes('/purchases/print')) return 'print';
    return 'list';
  });
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [printingPurchase, setPrintingPurchase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSetViewMode = (mode, item = null) => {
    setViewMode(mode);
    const branchCode = safeBranch.code || 'AMD-01';
    if (mode === 'create') {
      try {
        window.history.pushState({ subview: 'create_purchase' }, '', `#/branch/${branchCode}/purchases/create`);
      } catch (e) {}
    } else if (mode === 'edit') {
      setEditingPurchase(item);
      try {
        window.history.pushState({ subview: 'edit_purchase', poNo: item?.poNo }, '', `#/branch/${branchCode}/purchases/edit`);
      } catch (e) {}
    } else if (mode === 'print') {
      setPrintingPurchase(item);
      try {
        window.history.pushState({ subview: 'print_purchase', poNo: item?.poNo }, '', `#/branch/${branchCode}/purchases/print`);
      } catch (e) {}
    } else {
      setEditingPurchase(null);
      setPrintingPurchase(null);
      if (window.location.hash.includes('/purchases/')) {
        window.history.pushState({ subview: 'list' }, '', `#/branch/${branchCode}/purchases`);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const h = window.location.hash || '';
      if (h.includes('/purchases/create')) {
        setViewMode('create');
      } else if (h.includes('/purchases/edit')) {
        setViewMode('edit');
      } else if (h.includes('/purchases/print')) {
        setViewMode('print');
      } else {
        setViewMode('list');
        setEditingPurchase(null);
        setPrintingPurchase(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Fetch live purchases from PostgreSQL
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/purchases?branch=${encodeURIComponent(safeBranch.code || 'AMD-01')}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
        if (json.data && json.data.length > 0) {
          const h = typeof window !== 'undefined' ? (window.location.hash || '') : '';
          if (h.includes('/purchases/print')) {
            setPrintingPurchase(prev => prev || json.data[0]);
          } else if (h.includes('/purchases/edit')) {
            setEditingPurchase(prev => prev || json.data[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load purchases from PostgreSQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [safeBranch?.code]);

  const handleGenerateGRN = async (order) => {
    const grnNo = `GRN-${Math.floor(982 + (orders || []).length)}`;
    try {
      const res = await fetch(`/api/purchases/${encodeURIComponent(order.id || order.poNo)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'GRN Done', grnNo, branchCode: activeBranch.code })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setOrders(prev => prev.map(o => (o.id === order.id ? json.data : o)));
        if (viewingOrder && viewingOrder.id === order.id) {
          setViewingOrder(json.data);
        }
        showToast(`GRN ${grnNo} recorded for PO #${order.poNo}! Stock updated.`);
      }
    } catch (err) {
      alert('Failed to generate GRN: ' + err.message);
    }
  };

  const handleDeletePurchase = async (order) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete Purchase Order #${order.poNo} for ${order.supplierName}?`);
    if (!confirmDelete) return;

    try {
      const idOrNo = order.id || order.poNo;
      const res = await fetch(`/api/purchases/${encodeURIComponent(idOrNo)}?branch=${encodeURIComponent(activeBranch.code)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setOrders(prev => prev.filter(o => o.id !== order.id && o.poNo !== order.poNo));
        showToast(`Purchase order #${order.poNo} deleted successfully.`);
        if (viewingOrder && viewingOrder.id === order.id) {
          setViewingOrder(null);
        }
      } else {
        alert(json.message || 'Failed to delete purchase order');
      }
    } catch (err) {
      alert('Error deleting purchase order: ' + err.message);
    }
  };

  const handleExportPurchases = () => {
    const headers = ['PO #', 'Supplier', 'PO Date', 'Delivery Date', 'Items', 'Taxable Subtotal', 'GST', 'Grand Total', 'Status', 'GRN Ref', 'Payment Terms'];
    const rows = [
      headers,
      ...orders.map(o => [
        o.poNo || o.no,
        o.supplierName || o.supplier,
        o.date || '',
        o.deliveryDate || '',
        o.totalItems || o.items || 1,
        o.subtotal || 0,
        o.totalTax || 0,
        o.totalNum || o.grandTotal || 0,
        o.status || 'Ordered',
        o.grnNo || '',
        o.paymentTerms || ''
      ])
    ];
    downloadCSV(`Purchases_${activeBranch.code}.csv`, rows);
    showToast('Purchase orders exported to CSV successfully!');
  };

  const filteredOrders = (orders || []).filter(o => {
    if (!o) return false;
    const q = (searchQuery || '').toLowerCase();
    return (
      (o.poNo || o.no || '').toLowerCase().includes(q) ||
      (o.supplierName || o.supplier || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q) ||
      (o.grnNo || '').toLowerCase().includes(q)
    );
  });

  const { paginatedItems: pagedOrders, paginationProps: purchasesPagination } = useTablePagination(filteredOrders, 10);

  // If in 'create' viewMode, render CreatePurchasePage
  if (viewMode === 'create') {
    return (
      <CreatePurchasePage
        activeBranch={safeBranch}
        onBack={() => handleSetViewMode('list')}
        onCreated={(newPo) => {
          setOrders(prev => [newPo, ...prev.filter(o => o.id !== newPo.id && o.poNo !== newPo.poNo)]);
          handleSetViewMode('list');
          showToast(`Purchase Order #${newPo.poNo} registered!`);
        }}
      />
    );
  }

  // If in 'edit' viewMode, render CreatePurchasePage with initialPurchase
  if (viewMode === 'edit') {
    const targetPurchase = editingPurchase || orders[0] || null;
    return (
      <CreatePurchasePage
        activeBranch={safeBranch}
        initialPurchase={targetPurchase}
        onBack={() => handleSetViewMode('list')}
        onCreated={(updatedPo) => {
          setOrders(prev => prev.map(o => (o.id === updatedPo.id || o.poNo === updatedPo.poNo ? updatedPo : o)));
          handleSetViewMode('list');
          showToast(`Purchase Order #${updatedPo.poNo} updated!`);
        }}
      />
    );
  }

  // If in 'print' viewMode, render PurchaseOrderPrintPage
  if (viewMode === 'print') {
    const targetPurchase = printingPurchase || orders[0] || {
      id: 1,
      poNo: 'PO-2026-001',
      supplierName: 'National Fire Safety Equipments Ltd',
      supplierGstin: '24AAACN1234F1Z5',
      date: new Date().toISOString().split('T')[0],
      status: 'Ordered',
      totalNum: 11200,
      subtotal: 9491.53,
      totalTax: 1708.47,
      items: 10,
      paymentTerms: 'Credit 30 Days'
    };
    return (
      <PurchaseOrderPrintPage
        purchase={targetPurchase}
        activeBranch={safeBranch}
        currentUser={currentUser}
        currentTenant={currentTenant}
        onBack={() => handleSetViewMode('list')}
        onEdit={(po) => {
          handleSetViewMode('edit', po);
        }}
      />
    );
  }

  const openPoCount = (orders || []).filter(o => o && o.status === 'Ordered').length;
  const grnDoneCount = (orders || []).filter(o => o && o.status === 'GRN Done').length;
  const totalPurchasesVal = (orders || []).reduce((s, o) => s + (parseFloat(o?.totalNum) || 0), 0);

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h2 className="page-title">Purchases & Purchase Orders</h2>
            <span style={{ fontSize: '0.72rem', background: '#38bdf815', color: '#0284c7', border: '1px solid #38bdf840', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
              Branch: {activeBranch.code} ({activeBranch.name})
            </span>
            <span style={{ fontSize: '0.72rem', background: '#10b98115', color: '#059669', border: '1px solid #10b98140', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
              🔒 Isolated Branch Database
            </span>
          </div>
          <p className="page-desc">Generate purchase orders with series 1, 2, 3..., vendor verification, inventory materials, GRN goods receipt, and printable A4 purchase vouchers.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={fetchPurchases} title="Reload Purchases">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /><span>Refresh</span>
          </button>
          <button className="secondary-action-btn" onClick={handleExportPurchases}>
            <Download size={14} /><span>Export CSV</span>
          </button>
          <button className="primary-action-btn" onClick={() => handleSetViewMode('create')}>
            <Plus size={16} /><span>New Purchase Order</span>
          </button>
        </div>
      </div>

      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Open Purchase Orders</span>
            <div className="stat-icon-circle" style={{ background: '#f59e0b20', color: '#f59e0b' }}><ShoppingCart size={18} /></div>
          </div>
          <div className="stat-value">{openPoCount}</div>
          <div className="stat-change neutral"><span>Awaiting GRN / Delivery</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Purchases (MTD)</span>
            <div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">₹{(totalPurchasesVal / 100000).toFixed(2)}L</div>
          <div className="stat-change positive"><span>Across {(orders || []).length} Branch POs</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">GRN Completed</span>
            <div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><Package size={18} /></div>
          </div>
          <div className="stat-value">{grnDoneCount}</div>
          <div className="stat-change positive"><span>Stock received in warehouse</span></div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Ordered Value</span>
            <div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><CreditCard size={18} /></div>
          </div>
          <div className="stat-value">₹{totalPurchasesVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-change positive"><span>PostgreSQL Verified</span></div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="dash-panel-title">Purchase Orders List</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({(filteredOrders || []).length} Records)</span>
          </div>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '220px' }}>
              <Search size={14} />
              <input
                placeholder="Search PO #, supplier, status..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO #</th>
                <th>Supplier / Vendor</th>
                <th>PO Date</th>
                <th>Delivery Due</th>
                <th>Items</th>
                <th style={{ textAlign: 'right' }}>Taxable (₹)</th>
                <th style={{ textAlign: 'right' }}>GST (₹)</th>
                <th style={{ textAlign: 'right' }}>Total Value</th>
                <th>GRN</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filteredOrders || []).length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No purchase orders found for this branch. Click <b>"New Purchase Order"</b> to generate PO #1.
                  </td>
                </tr>
              ) : (
                pagedOrders.map((o) => (
                  <tr key={o.id || o.poNo}>
                    <td><span className="mono-badge">#{o.poNo || o.no}</span></td>
                    <td className="td-bold">{o.supplierName || o.supplier}</td>
                    <td className="td-sub">{o.date || '—'}</td>
                    <td className="td-sub">
                      {o.deliveryDate ? (new Date(o.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })) : '—'}
                    </td>
                    <td>{o.totalItems || o.items || 1}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      ₹{parseFloat(o.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                      ₹{parseFloat(o.totalTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--brand-accent)' }}>
                      {o.total || `₹${parseFloat(o.totalNum || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </td>
                    <td>
                      {o.grnNo ? (
                        <span className="mono-badge" style={{ background: '#10b98115', color: '#059669', borderColor: '#10b98140' }}>
                          {o.grnNo}
                        </span>
                      ) : (
                        <span className="td-sub">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${o.status === 'Ordered' ? 'warning' : 'active'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => handleSetViewMode('print', o)}
                          title="Print Purchase Order"
                        >
                          <Printer size={14} /><span>Print</span>
                        </button>
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => setViewingOrder(o)}
                          title="View Details"
                        >
                          <Eye size={14} /><span>View</span>
                        </button>
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => handleSetViewMode('edit', o)}
                          title="Edit PO"
                        >
                          <Edit3 size={14} /><span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="table-action-btn danger"
                          onClick={() => handleDeletePurchase(o)}
                          title="Delete PO"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination {...purchasesPagination} />
        </div>
      </div>

      {/* VIEW PO MODAL */}
      {viewingOrder && (
        <div className="modal-backdrop-overlay" onClick={() => setViewingOrder(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <ShoppingCart size={20} color="var(--brand-accent)" />
                <span>Purchase Order #{viewingOrder.poNo || viewingOrder.no} Details</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setViewingOrder(null)}><X size={18} /></button>
            </div>
            <div className="modal-dialog-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '1rem' }}>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supplier:</span> <div style={{ fontWeight: '700' }}>{viewingOrder.supplierName || viewingOrder.supplier}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span> <div><span className={`status-badge ${viewingOrder.status === 'Ordered' ? 'warning' : 'active'}`}>{viewingOrder.status}</span></div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PO Date:</span> <div>{viewingOrder.date || '—'}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Terms:</span> <div>{viewingOrder.paymentTerms || 'Credit 30 Days'}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTIN:</span> <div className="mono-badge">{viewingOrder.supplierGstin || 'URP'}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Value:</span> <div style={{ fontWeight: '800', color: 'var(--brand-accent)' }}>{viewingOrder.total || `₹${viewingOrder.totalNum}`}</div></div>
              </div>

              {viewingOrder.lineItems && viewingOrder.lineItems.length > 0 && (
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Line Items Breakdown:</div>
                  <div style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'var(--bg-input)' }}>
                        <tr>
                          <th style={{ padding: '4px 8px', textAlign: 'left' }}>Item</th>
                          <th style={{ padding: '4px 8px', textAlign: 'center' }}>Qty</th>
                          <th style={{ padding: '4px 8px', textAlign: 'right' }}>Rate (₹)</th>
                          <th style={{ padding: '4px 8px', textAlign: 'right' }}>Subtotal (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingOrder.lineItems.map((it, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-medium)' }}>
                            <td style={{ padding: '4px 8px' }}>{it.name}</td>
                            <td style={{ padding: '4px 8px', textAlign: 'center' }}>{it.qty} {it.unit}</td>
                            <td style={{ padding: '4px 8px', textAlign: 'right' }}>₹{parseFloat(it.price || 0).toFixed(2)}</td>
                            <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: '700' }}>₹{parseFloat(it.subtotal || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-dialog-footer">
              <button
                type="button"
                className="secondary-action-btn"
                onClick={() => {
                  const po = viewingOrder;
                  setViewingOrder(null);
                  handleSetViewMode('print', po);
                }}
              >
                <Printer size={15} /><span>Print A4 PO</span>
              </button>
              {viewingOrder.status === 'Ordered' && (
                <button
                  type="button"
                  className="primary-action-btn"
                  onClick={() => handleGenerateGRN(viewingOrder)}
                >
                  <Package size={16} /><span>Generate GRN (Receive Goods)</span>
                </button>
              )}
              <button type="button" className="secondary-action-btn" onClick={() => setViewingOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── SALES & INVOICES ─────────────────────────────────────────────────
export function BranchSales({ activeBranch: rawBranch, currentUser, currentTenant }) {
  const activeBranch = rawBranch || { code: 'AMD-01', name: 'Ahmedabad Hub', city: 'Ahmedabad', state: 'Gujarat' };
  const [invoices, setInvoices] = useState([]);

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'create' | 'edit' | 'print'
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [printingInvoice, setPrintingInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for modal
  const [customer, setCustomer] = useState('Shreeji Engineering');
  const [taxableAmount, setTaxableAmount] = useState('15000');
  const [itemCount, setItemCount] = useState(4);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSetViewMode = (mode, item = null) => {
    setViewMode(mode);
    if (mode === 'create') {
      try {
        window.history.pushState({ subview: 'create_invoice' }, '', `#/branch/${activeBranch.code}/sales/create`);
      } catch (e) {}
    } else if (mode === 'edit') {
      setEditingInvoice(item);
      try {
        window.history.pushState({ subview: 'edit_invoice', id: item?.id }, '', `#/branch/${activeBranch.code}/sales/edit`);
      } catch (e) {}
    } else if (mode === 'print') {
      setPrintingInvoice(item);
      try {
        window.history.pushState({ subview: 'print_invoice', id: item?.id }, '', `#/branch/${activeBranch.code}/sales/print`);
      } catch (e) {}
    } else {
      setEditingInvoice(null);
      setPrintingInvoice(null);
      if (window.location.hash.includes('/sales/')) {
        window.history.back();
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const h = window.location.hash || '';
      if (!h.includes('/sales/create') && !h.includes('/sales/edit') && !h.includes('/sales/print')) {
        setViewMode('list');
        setEditingInvoice(null);
        setPrintingInvoice(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch live invoices from PostgreSQL
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`/api/invoices?branch=${encodeURIComponent(activeBranch.code)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const formatted = json.data.map(inv => ({
            ...inv,
            no: inv.invoiceNo || inv.no,
            customer: inv.customerName || inv.customer,
            taxable: `₹${(inv.subtotal || 0).toLocaleString('en-IN')}`,
            gst: `₹${(inv.totalTax || 0).toLocaleString('en-IN')}`,
            total: inv.total || `₹${(inv.totalNum || 0).toLocaleString('en-IN')}`
          }));
          setInvoices(formatted);
        }
      } catch (err) {
        console.warn('Failed to fetch sales invoices from PostgreSQL:', err);
      }
    };
    fetchInvoices();
  }, [activeBranch.code]);

  const handleCreateSalesInvoice = (e) => {
    e.preventDefault();
    const taxVal = parseFloat(taxableAmount) || 0;
    const gstVal = Math.round(taxVal * 0.18);
    const maxNum = invoices.reduce((max, inv) => {
      const m = (inv.no || inv.invoiceNo || '').match(/^(\d+)$/);
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);
    const newNo = String(maxNum + 1);

    const newInv = {
      no: newNo,
      customer: customer.trim(),
      items: parseInt(itemCount) || 1,
      taxable: `₹${taxVal.toLocaleString('en-IN')}`,
      gst: `₹${gstVal.toLocaleString('en-IN')}`,
      total: `₹${(taxVal + gstVal).toLocaleString('en-IN')}`,
      status: 'Posted',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setInvoices(prev => [newInv, ...prev]);
    setShowNewModal(false);
    showToast(`Tax Invoice ${newNo} posted for ${newInv.total}!`);
  };

  const handleDeleteInvoice = async (inv) => {
    const invNo = inv.no || inv.invoiceNo || 'this invoice';
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete invoice ${invNo}? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const idOrNo = inv.id || inv.no || inv.invoiceNo;
      const res = await fetch(`/api/invoices/${encodeURIComponent(idOrNo)}?branch=${encodeURIComponent(activeBranch.code)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setInvoices(prev => prev.filter(i => (i.id || i.no || i.invoiceNo) !== idOrNo && i.no !== invNo));
        showToast(`Invoice ${invNo} deleted successfully.`);
        if (viewingInvoice && (viewingInvoice.id || viewingInvoice.no) === idOrNo) {
          setViewingInvoice(null);
        }
      } else {
        alert('Failed to delete invoice: ' + (json.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error deleting invoice: ' + err.message);
    }
  };

  const handleExportSales = () => {
    const headers = ['Invoice #', 'Customer', 'Items', 'Taxable Value', 'GST Amount', 'Total Amount', 'Status', 'Date'];
    const rows = [
      headers,
      ...invoices.map(inv => [inv.no || inv.invoiceNo, inv.customer || inv.customerName, inv.items, inv.taxable, inv.gst, inv.total, inv.status, inv.date])
    ];
    downloadCSV(`Sales_Register_${activeBranch.code}.csv`, rows);
    showToast('Sales invoices exported to CSV successfully!');
  };

  const filteredInvoices = invoices.filter(inv =>
    (inv.no || inv.invoiceNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.customer || inv.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { paginatedItems: pagedInvoices, paginationProps: salesPagination } = useTablePagination(filteredInvoices, 10);

  // If in 'create' viewMode, redirect to full CreateInvoicePage
  if (viewMode === 'create') {
    return (
      <CreateInvoicePage
        activeBranch={activeBranch}
        onBack={() => handleSetViewMode('list')}
        onCreated={(newInv) => {
          const formatted = {
            ...newInv,
            no: newInv.invoiceNo || newInv.no,
            customer: newInv.customerName || newInv.customer,
            taxable: `₹${(newInv.subtotal || 0).toLocaleString('en-IN')}`,
            gst: `₹${(newInv.totalTax || 0).toLocaleString('en-IN')}`,
            total: newInv.total
          };
          setInvoices(prev => [formatted, ...prev.filter(i => (i.id || i.no) !== (newInv.id || newInv.no))]);
          handleSetViewMode('list');
          showToast(`Invoice ${newInv.invoiceNo} posted to sales ledger!`);
        }}
      />
    );
  }

  // If in 'edit' viewMode, redirect to full CreateInvoicePage with initialInvoice
  if (viewMode === 'edit' && editingInvoice) {
    return (
      <CreateInvoicePage
        activeBranch={activeBranch}
        initialInvoice={editingInvoice}
        onBack={() => handleSetViewMode('list')}
        onCreated={(updatedInv) => {
          const formatted = {
            ...updatedInv,
            no: updatedInv.invoiceNo || updatedInv.no,
            customer: updatedInv.customerName || updatedInv.customer,
            taxable: `₹${(updatedInv.subtotal || 0).toLocaleString('en-IN')}`,
            gst: `₹${(updatedInv.totalTax || 0).toLocaleString('en-IN')}`,
            total: updatedInv.total
          };
          setInvoices(prev => prev.map(inv => ((inv.id || inv.no) === (formatted.id || formatted.no) ? formatted : inv)));
          handleSetViewMode('list');
          showToast(`Invoice ${formatted.no} updated successfully!`);
        }}
      />
    );
  }

  // If in 'print' viewMode, redirect to dedicated InvoicePrintPage
  if (viewMode === 'print' && printingInvoice) {
    return (
      <InvoicePrintPage
        invoice={printingInvoice}
        activeBranch={activeBranch}
        currentUser={currentUser}
        currentTenant={currentTenant}
        onBack={() => handleSetViewMode('list')}
        onEdit={(inv) => {
          handleSetViewMode('edit', inv);
        }}
      />
    );
  }

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Sales & Tax Invoices</h2>
          <p className="page-desc">GST-compliant sales invoicing with CGST/SGST/IGST auto-calculation, HSN, credit notes, print slips, and bill-wise tracking.</p>
        </div>
        <button className="primary-action-btn" onClick={() => handleSetViewMode('create')}>
          <Plus size={16} /><span>New Invoice</span>
        </button>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <h3 className="dash-panel-title">Sales Invoices</h3>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '180px' }}>
              <Search size={14} />
              <input
                placeholder="Search invoices..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="secondary-action-btn" onClick={handleExportSales}>
              <Download size={14} /><span>Export</span>
            </button>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Taxable</th>
                <th>GST</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', minWidth: '240px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Receipt size={36} style={{ opacity: 0.35, color: '#38bdf8' }} />
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No invoices posted for {activeBranch.name} yet
                      </div>
                      <div style={{ fontSize: '0.82rem', maxWidth: '440px', lineHeight: 1.5 }}>
                        This branch series will start at <strong>Invoice #1</strong>. Click below to generate the first tax invoice.
                      </div>
                      <button
                        type="button"
                        className="primary-action-btn"
                        onClick={() => setViewMode('create')}
                        style={{ marginTop: '0.5rem', fontSize: '0.82rem', padding: '0.45rem 1rem' }}
                      >
                        <Plus size={14} /><span>Create Invoice #1</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedInvoices.map((inv, i) => (
                  <tr key={inv.id || inv.no || i}>
                    <td><span className="mono-badge">{inv.no || inv.invoiceNo}</span></td>
                    <td className="td-bold">{inv.customer || inv.customerName}</td>
                    <td>{inv.items}</td>
                    <td className="td-money">{inv.taxable}</td>
                    <td className="td-sub">{inv.gst}</td>
                    <td className="td-money">{inv.total}</td>
                    <td><span className={`status-badge ${inv.status === 'Posted' ? 'active' : inv.status === 'Outstanding' ? 'danger' : 'warning'}`}>{inv.status}</span></td>
                    <td className="td-sub">{inv.date}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="table-action-btn"
                          onClick={() => setViewingInvoice(inv)}
                          title="View Invoice Details"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem' }}
                        >
                          <Eye size={13} /><span>View</span>
                        </button>
                        <button
                          className="table-action-btn"
                          onClick={() => handleSetViewMode('edit', inv)}
                          title="Edit Invoice"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                        >
                          <Edit3 size={13} /><span>Edit</span>
                        </button>
                        <button
                          className="table-action-btn"
                          onClick={() => handleSetViewMode('print', inv)}
                          title="Print Tax Invoice"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                        >
                          <Printer size={13} /><span>Print</span>
                        </button>
                        <button
                          className="table-action-btn"
                          onClick={() => handleDeleteInvoice(inv)}
                          title="Delete Invoice"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                          <Trash2 size={13} /><span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination {...salesPagination} />
        </div>
      </div>

      {/* NEW SALES INVOICE MODAL */}
      {showNewModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Receipt size={20} color="var(--brand-accent)" />
                <span>New Sales Tax Invoice</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowNewModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateSalesInvoice}>
              <div className="modal-dialog-body">
                <div className="form-group">
                  <label className="form-label">Customer / Client Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={customer}
                    onChange={e => setCustomer(e.target.value)}
                    placeholder="e.g. Shreeji Engineering"
                  />
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Taxable Base Amount (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-input"
                      value={taxableAmount}
                      onChange={e => setTaxableAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Line Items</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-input"
                      value={itemCount}
                      onChange={e => setItemCount(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div>CGST (9%): <strong>₹{Math.round(parseFloat(taxableAmount || 0) * 0.09).toLocaleString('en-IN')}</strong></div>
                  <div>SGST (9%): <strong>₹{Math.round(parseFloat(taxableAmount || 0) * 0.09).toLocaleString('en-IN')}</strong></div>
                  <div style={{ fontWeight: '700', color: 'var(--brand-accent)', marginTop: '0.25rem' }}>
                    Total Payable: ₹{Math.round(parseFloat(taxableAmount || 0) * 1.18).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Check size={16} /><span>Post Tax Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW SALES INVOICE MODAL */}
      {viewingInvoice && (
        <div className="modal-backdrop-overlay" onClick={() => setViewingInvoice(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <FileText size={20} color="var(--brand-accent)" />
                <span>Tax Invoice {viewingInvoice.no || viewingInvoice.invoiceNo}</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setViewingInvoice(null)}><X size={18} /></button>
            </div>
            <div className="modal-dialog-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '1rem' }}>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer:</span> <div style={{ fontWeight: '600' }}>{viewingInvoice.customer || viewingInvoice.customerName}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date:</span> <div>{viewingInvoice.date}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taxable:</span> <div>{viewingInvoice.taxable}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GST 18%:</span> <div>{viewingInvoice.gst}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total:</span> <div style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>{viewingInvoice.total}</div></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span> <div><span className="status-badge active">{viewingInvoice.status}</span></div></div>
                {viewingInvoice.phone && <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone:</span> <div>{viewingInvoice.phone}</div></div>}
                {viewingInvoice.gstin && <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTIN:</span> <div>{viewingInvoice.gstin}</div></div>}
              </div>

              {/* Line items if present */}
              {viewingInvoice.lineItems && viewingInvoice.lineItems.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Line Items</div>
                  <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                        <th style={{ padding: '4px' }}>Item</th>
                        <th style={{ padding: '4px' }}>Qty</th>
                        <th style={{ padding: '4px' }}>Rate</th>
                        <th style={{ padding: '4px' }}>Tax</th>
                        <th style={{ padding: '4px', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingInvoice.lineItems.map((li, lidx) => (
                        <tr key={lidx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '4px' }}>{li.name}</td>
                          <td style={{ padding: '4px' }}>{li.qty} {li.unit}</td>
                          <td style={{ padding: '4px' }}>₹{li.price}</td>
                          <td style={{ padding: '4px' }}>{li.taxRate}%</td>
                          <td style={{ padding: '4px', textAlign: 'right' }}>₹{Math.round((li.subtotal + li.taxAmount) * 100) / 100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-dialog-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="table-action-btn"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => handleDeleteInvoice(viewingInvoice)}
                >
                  <Trash2 size={13} /><span>Delete</span>
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="secondary-action-btn"
                  onClick={() => {
                    const inv = viewingInvoice;
                    setViewingInvoice(null);
                    handleSetViewMode('edit', inv);
                  }}
                >
                  <Edit3 size={14} /><span>Edit</span>
                </button>
                <button
                  type="button"
                  className="primary-action-btn"
                  onClick={() => {
                    const inv = viewingInvoice;
                    setViewingInvoice(null);
                    handleSetViewMode('print', inv);
                  }}
                >
                  <Printer size={14} /><span>Print Invoice</span>
                </button>
                <button type="button" className="secondary-action-btn" onClick={() => setViewingInvoice(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── BRANCH REPORTS ───────────────────────────────────────────────────
export function BranchReports({ activeBranch }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const reports = [
    { id: 'stock_summary', name: 'Branch Stock Summary', desc: 'Stock by category, warehouse with value', icon: Boxes, color: '#38bdf8' },
    { id: 'sales_reg', name: 'Sales Register', desc: 'All invoices with tax breakup and customer-wise', icon: Receipt, color: '#10b981' },
    { id: 'purch_reg', name: 'Purchase Register', desc: 'All purchase invoices with landed cost', icon: ShoppingCart, color: '#a855f7' },
    { id: 'cash_book', name: 'Cash Book', desc: 'Daily opening, receipts, payments, closing balance', icon: Wallet, color: '#f59e0b' },
    { id: 'receivables', name: 'Receivables Ageing', desc: 'Customer outstanding by 30/60/90+ day buckets', icon: ArrowDownRight, color: '#ec4899' },
    { id: 'low_stock', name: 'Low Stock Report', desc: 'Items below reorder point with suggested PO qty', icon: AlertTriangle, color: '#ef4444' },
    { id: 'stock_ledger', name: 'Stock Ledger', desc: 'Full movement history per product', icon: BookOpen, color: '#06b6d4' },
    { id: 'daily_summary', name: 'Daily Sales Summary', desc: 'Product-wise and payment-mode-wise breakdown', icon: BarChart3, color: '#84cc16' },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDownloadReportCSV = (report) => {
    const headers = ['Report Metric', 'Category / Code', 'Quantity / Count', 'Amount (INR)', 'Branch Code'];
    const rows = [
      headers,
      [report.name, 'Operational Total', '142', '₹2,84,500', activeBranch.code],
      ['Primary Segment', 'Fire Extinguishers', '85', '₹1,57,250', activeBranch.code],
      ['Secondary Segment', 'PPE & Safety Hardware', '57', '₹1,27,250', activeBranch.code],
    ];
    downloadCSV(`${report.name.replace(/\s+/g, '_')}_${activeBranch.code}.csv`, rows);
    showToast(`Report "${report.name}" downloaded to CSV successfully!`);
  };

  const filteredReports = reports.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Branch Reports</h2>
          <p className="page-desc">Branch-scoped reports for {activeBranch.name}. All filtered by RLS policy and user permissions. Export to PDF & CSV.</p>
        </div>
      </div>

      {/* Interactive Visual Graphs */}
      <BranchReportsChartSection activeBranch={activeBranch} />

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <h3 className="dash-panel-title">Available Reports ({filteredReports.length})</h3>
          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '200px' }}>
              <Search size={14} />
              <input
                placeholder="Search reports..."
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="dash-panel-badge">{filteredReports.length} Reports</span>
          </div>
        </div>
        <div className="reports-grid">
          {filteredReports.map((r, i) => (
            <button
              className="report-card"
              key={i}
              onClick={() => setSelectedReport(r)}
              title={`Generate ${r.name}`}
            >
              <div className="module-icon-wrap" style={{ background: `${r.color}15`, color: r.color }}><r.icon size={20} /></div>
              <div className="module-info"><span className="module-name">{r.name}</span><span className="module-desc">{r.desc}</span></div>
              <ChevronRight size={16} className="module-arrow" />
            </button>
          ))}
        </div>
      </div>

      {/* REPORT PREVIEW MODAL */}
      {selectedReport && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <selectedReport.icon size={20} color={selectedReport.color} />
                <span>{selectedReport.name} Preview</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setSelectedReport(null)}><X size={18} /></button>
            </div>
            <div className="modal-dialog-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedReport.desc} for <strong>{activeBranch.name} ({activeBranch.code})</strong>.</p>
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Metric Item</th><th>Units</th><th>Total Value</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td className="td-bold">Primary Category</td><td>85</td><td className="td-money">₹1,57,250</td><td><span className="status-badge active">Verified</span></td></tr>
                    <tr><td className="td-bold">Secondary Category</td><td>57</td><td className="td-money">₹1,27,250</td><td><span className="status-badge active">Verified</span></td></tr>
                    <tr><td className="td-bold">Tax Breakdown (18%)</td><td>—</td><td className="td-money">₹43,380</td><td><span className="type-tag">GST</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-dialog-footer">
              <button type="button" className="secondary-action-btn" onClick={() => setSelectedReport(null)}>Close</button>
              <button
                type="button"
                className="primary-action-btn"
                onClick={() => handleDownloadReportCSV(selectedReport)}
              >
                <Download size={14} /><span>Download CSV Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── BRANCH PRODUCT 360 (UNIFIED ACROSS ADMIN & BRANCH) ───────────────
export { default as BranchProduct360 } from './Product360';

// ─── SEARCHABLE PRODUCT SELECT COMBOBOX (LIVE BRANCH DB) ──────────────
function SearchableProductSelect({
  products = [],
  selectedSku,
  onSelect,
  placeholder = "Search product by SKU or name...",
  disabled = false,
  showStock = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = React.useRef(null);

  const selectedProduct = products.find(p => p.sku === selectedSku);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = products.filter(p => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.sku || '').toLowerCase().includes(q) ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  const handleSelect = (prod) => {
    onSelect(prod.sku);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          width: '100%'
        }}
      >
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
        <input
          type="text"
          className="form-input"
          disabled={disabled}
          placeholder={selectedProduct ? `${selectedProduct.sku} - ${selectedProduct.name}` : placeholder}
          value={isOpen ? searchTerm : (selectedProduct ? `${selectedProduct.sku}: ${selectedProduct.name}` : '')}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          style={{
            paddingLeft: '36px',
            paddingRight: '64px',
            cursor: 'text',
            fontWeight: selectedProduct && !isOpen ? '600' : '400',
            borderColor: isOpen ? 'var(--primary-color, #6366f1)' : undefined
          }}
        />
        <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 2 }}>
          {selectedSku && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchTerm('');
                setIsOpen(true);
              }}
              title="Search again"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      {/* Filtered Dropdown Popover */}
      {isOpen && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            maxHeight: '260px',
            overflowY: 'auto',
            background: 'var(--bg-card, #1e293b)',
            border: '1px solid var(--border-color, #334155)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
            zIndex: 100,
            padding: '4px 0'
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No products found matching "{searchTerm}"
            </div>
          ) : (
            filtered.map(p => {
              const isSelected = p.sku === selectedSku;
              return (
                <div
                  key={p.sku}
                  onClick={() => handleSelect(p)}
                  style={{
                    padding: '0.6rem 0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #6366f1' : '3px solid transparent',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                        {p.sku}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? '700' : '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {p.category || 'General'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    {showStock && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: Number(p.currentStock) > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: Number(p.currentStock) > 0 ? '#10b981' : '#ef4444'
                      }}>
                        {Number(p.currentStock || 0)} in stock
                      </span>
                    )}
                    {isSelected && <Check size={14} color="#6366f1" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── BRANCH LOSS PREVENTION ───────────────────────────────────────────
export function BranchLossPrevention({ activeBranch, currentUser, currentTenant }) {
  const companyId = activeBranch?.companyId || activeBranch?.company_id || currentTenant?.id || currentUser?.companyId || currentUser?.company_id || (activeBranch?.code?.startsWith('AND') || activeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann');

  // Real-time PostgreSQL state
  const [inventory, setInventory] = useState([]);
  const [loadingInv, setLoadingInv] = useState(true);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [cycleCounts, setCycleCounts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTableTab, setActiveTableTab] = useState('approvals'); // 'approvals' | 'counts'

  // Left Div: Blind Cycle Count Form State
  const [selectedAuditSku, setSelectedAuditSku] = useState('');
  const [countedQty, setCountedQty] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);

  // Right Div: Damage & Transit Loss Reporting State
  const [damageSku, setDamageSku] = useState('');
  const [damageQty, setDamageQty] = useState(1);
  const [damageReason, setDamageReason] = useState('DAMAGED_IN_TRANSIT');
  const [damageNotes, setDamageNotes] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [isSubmittingDamage, setIsSubmittingDamage] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Fetch Real Branch Inventory Products from Database for THIS company & branch
  const fetchInventory = async () => {
    try {
      setLoadingInv(true);
      const bCode = activeBranch?.code || 'AMD-01';
      const res = await fetch(`/api/inventory?branch=${encodeURIComponent(bCode)}&companyId=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInventory(data.data);
        if (data.data.length > 0) {
          setSelectedAuditSku(prev => (prev && data.data.some(p => p.sku === prev) ? prev : data.data[0].sku));
          setDamageSku(prev => (prev && data.data.some(p => p.sku === prev) ? prev : data.data[0].sku));
        } else {
          setSelectedAuditSku('');
          setDamageSku('');
        }
      }
    } catch (err) {
      console.error('Error fetching inventory for loss prevention:', err);
    } finally {
      setLoadingInv(false);
    }
  };

  // 2. Fetch Pending Approvals / Adjustments from Database for THIS company & branch
  const fetchBranchApprovals = async () => {
    try {
      const bCode = activeBranch?.code || 'AMD-01';
      const res = await fetch(`/api/loss-prevention/approvals?branchCode=${encodeURIComponent(bCode)}&companyId=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.approvals)) {
        setPendingReviews(data.approvals);
      }
    } catch (err) {
      console.error('Error fetching branch loss reviews:', err);
    }
  };

  // 3. Fetch Cycle Counts History from Database for THIS company & branch
  const fetchBranchCounts = async () => {
    try {
      const bCode = activeBranch?.code || 'AMD-01';
      const res = await fetch(`/api/loss-prevention/counts?branchCode=${encodeURIComponent(bCode)}&companyId=${encodeURIComponent(companyId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.counts)) {
        setCycleCounts(data.counts);
      }
    } catch (err) {
      console.error('Error fetching cycle counts:', err);
    }
  };

  const reloadAll = async () => {
    setLoadingData(true);
    await Promise.all([fetchInventory(), fetchBranchApprovals(), fetchBranchCounts()]);
    setLoadingData(false);
  };

  useEffect(() => {
    reloadAll();
  }, [activeBranch?.code, companyId]);

  // Selected audit product info
  const selectedAuditProduct = inventory.find(p => p.sku === selectedAuditSku) || inventory[0] || null;
  const auditExpectedQty = selectedAuditProduct ? (selectedAuditProduct.currentStock !== undefined ? Number(selectedAuditProduct.currentStock) : 14) : 14;

  // Selected damage product info
  const selectedDamageProduct = inventory.find(p => p.sku === damageSku) || inventory[0] || null;
  const damageUnitPrice = selectedDamageProduct ? Number(selectedDamageProduct.purchasePrice || selectedDamageProduct.salePrice || 1200) : 1200;
  const currentDamageStock = selectedDamageProduct ? Number(selectedDamageProduct.currentStock || 0) : 0;
  const calculatedLossValue = Math.max(0, (parseInt(damageQty, 10) || 0) * damageUnitPrice);

  // Pagination for tables
  const filteredReviews = pendingReviews.filter(r =>
    (r.adjustment_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.reason_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const { paginatedItems: pagedReviews, paginationProps: reviewsPagination } = useTablePagination(filteredReviews, 10);

  const filteredCounts = cycleCounts.filter(c =>
    (c.session_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.section || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.auditor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const { paginatedItems: pagedCounts, paginationProps: countsPagination } = useTablePagination(filteredCounts, 10);

  // Handle Blind Cycle Count Submit (Writes to PostgreSQL cycle_counts)
  const handleBlindSubmit = async (e) => {
    e.preventDefault();
    if (!countedQty && countedQty !== 0) return;
    setIsSubmittingAudit(true);

    const physical = parseInt(countedQty, 10) || 0;
    const diff = physical - auditExpectedQty;
    const unitPrice = selectedAuditProduct ? Number(selectedAuditProduct.purchasePrice || selectedAuditProduct.salePrice || 1200) : 1200;
    const financialDiff = Math.abs(diff) * unitPrice;

    try {
      const res = await fetch('/api/loss-prevention/counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          branchCode: activeBranch?.code || 'AMD-01',
          countMode: 'Blind Count',
          section: selectedAuditProduct ? `${selectedAuditProduct.category || 'General'} - ${selectedAuditProduct.name}` : 'Store Inventory',
          auditorName: currentUser?.name || `${activeBranch?.name || 'Branch'} Staff`,
          systemQty: auditExpectedQty,
          physicalQty: physical,
          notes: `Blind physical count on ${selectedAuditProduct?.sku || selectedAuditSku}: ${physical} units counted vs ledger ${auditExpectedQty}. Variance: ${diff}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setAuditResult({
          expected: auditExpectedQty,
          counted: physical,
          variance: diff,
          lossVal: financialDiff,
          productName: selectedAuditProduct?.name || 'Item'
        });
        showToast(diff === 0 ? 'Cycle count matched ledger perfectly!' : `Discrepancy of ${diff} units saved to PostgreSQL audit log!`);
        fetchBranchCounts();
      } else {
        showToast(data.message || 'Error saving cycle count to database.');
      }
    } catch (err) {
      console.error('Failed to submit cycle count:', err);
      showToast('Network error saving cycle count.');
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  // Handle Log Damage & Shortage (Writes to PostgreSQL stock_adjustments)
  const handleLogDamage = async (e) => {
    e.preventDefault();
    if (!selectedDamageProduct) {
      showToast('Please select a valid product.');
      return;
    }
    const qtyVal = parseInt(damageQty, 10) || 1;
    setIsSubmittingDamage(true);

    try {
      const res = await fetch('/api/loss-prevention/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          branchCode: activeBranch?.code || 'AMD-01',
          itemName: selectedDamageProduct.name,
          sku: selectedDamageProduct.sku || selectedDamageProduct.pid,
          quantity: qtyVal,
          lossValue: calculatedLossValue,
          reasonCode: damageReason,
          requestedBy: currentUser?.name || `${activeBranch?.name || 'Branch'} Staff`,
          photoEvidence: photoAttached,
          photoUrl: photoAttached ? `DAMAGE_EVIDENCE_${activeBranch?.code || 'BR'}_${Date.now()}.jpg` : ''
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Write-off request ${data.adjustment?.adjustment_no || ''} submitted to Maker-Checker queue in DB!`);
        setDamageQty(1);
        setPhotoAttached(false);
        fetchBranchApprovals();
      } else {
        showToast(data.message || 'Failed to submit write-off request.');
      }
    } catch (err) {
      console.error('Failed to submit write-off:', err);
      showToast('Network error submitting write-off request.');
    } finally {
      setIsSubmittingDamage(false);
    }
  };

  // Handle Maker-Checker Decision (Approves or Rejects via PostgreSQL)
  const handleDecision = async (id, approve) => {
    try {
      const decision = approve ? 'APPROVE' : 'REJECT';
      const res = await fetch(`/api/loss-prevention/approvals/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reviewedBy: currentUser?.name || 'Branch Manager',
          notes: approve ? 'Verified and approved physical write-off' : 'Rejected after physical recount verification'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Write-off ${data.adjustment?.adjustment_no || id} marked ${decision}!`);
        fetchBranchApprovals();
        fetchInventory(); // If approved, stock was deducted in PostgreSQL!
      } else {
        showToast(data.message || 'Failed to record decision.');
      }
    } catch (err) {
      console.error('Error recording decision:', err);
      showToast('Network error recording decision.');
    }
  };

  // CSV Export for Audit Trail
  const handleExportCSV = () => {
    if (activeTableTab === 'approvals') {
      const headers = ['Adjustment #', 'SKU', 'Item Name', 'Qty', 'Loss Value', 'Reason', 'Status', 'Requested By', 'Date', 'Reviewed By'];
      const rows = [headers, ...filteredReviews.map(r => [
        r.adjustment_no,
        r.sku,
        r.item_name,
        r.quantity,
        r.loss_value,
        r.reason_code,
        r.status,
        r.requested_by,
        r.request_date,
        r.reviewed_by || 'Pending'
      ])];
      downloadCSV(`Maker_Checker_Stock_Adjustments_${activeBranch?.code || 'AMD-01'}.csv`, rows);
    } else {
      const headers = ['Session #', 'Section', 'Count Mode', 'Auditor', 'Ledger Qty', 'Physical Qty', 'Variance', 'Status', 'Date'];
      const rows = [headers, ...filteredCounts.map(c => [
        c.session_no,
        c.section,
        c.count_mode,
        c.auditor_name,
        c.system_qty,
        c.physical_qty,
        c.variance_qty,
        c.status,
        c.session_date
      ])];
      downloadCSV(`Cycle_Counts_Audit_Log_${activeBranch?.code || 'AMD-01'}.csv`, rows);
    }
    showToast('Audit records exported to CSV successfully!');
  };

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 className="page-title">Loss Prevention & Count Audit • {activeBranch?.name || 'Branch'}</h2>
            <span className="mono-badge" style={{ background: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}>
              <Database size={11} style={{ marginRight: '4px' }} /> PostgreSQL Connected
            </span>
          </div>
          <p className="page-desc">Blind cycle count entry, transit shortage reporting, and damaged item submission directly synced to PostgreSQL database.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="dash-btn" onClick={reloadAll} title="Refresh data from database">
            <RefreshCw size={14} className={loadingData ? 'spin' : ''} /><span>Sync DB</span>
          </button>
        </div>
      </div>

      <div className="dash-two-col animate-fade-in">
        {/* Left Div: Blind Cycle Count Form */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div>
              <h3 className="dash-panel-title">Blind Cycle Count Entry</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff enters physical count without seeing expected ledger quantity.</p>
            </div>
            <span className="mono-badge" style={{ background: '#38bdf820', color: '#38bdf8' }}>
              Session #{`CNT-${activeBranch?.code || 'AMD'}-${new Date().toLocaleDateString('en-GB').replace(/\//g, '')}`}
            </span>
          </div>

          <form onSubmit={handleBlindSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
            <div className="form-group">
              <label className="form-label">Item / SKU Under Audit (From Live Branch DB)</label>
              {loadingInv ? (
                <div style={{ padding: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading live products from database...</div>
              ) : (
                <SearchableProductSelect
                  products={inventory}
                  selectedSku={selectedAuditSku}
                  onSelect={(sku) => {
                    setSelectedAuditSku(sku);
                    setAuditResult(null);
                    setCountedQty('');
                  }}
                  placeholder="Type to search SKU or Item under audit..."
                  showStock={false}
                />
              )}
              {selectedAuditProduct && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Category: <strong>{selectedAuditProduct.category || 'General'}</strong></span>
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Ledger stock hidden for blind audit integrity</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Physical Count (Actual units physically on shelf)</label>
              <input
                type="number"
                min="0"
                required
                placeholder="Enter physical units counted..."
                value={countedQty}
                onChange={(e) => {
                  setCountedQty(e.target.value);
                  setAuditResult(null);
                }}
                className="form-input"
                style={{ fontSize: '1.15rem', fontWeight: '700' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAudit || loadingInv || inventory.length === 0}
              className="primary-action-btn"
              style={{ justifyContent: 'center' }}
            >
              {isSubmittingAudit ? <RefreshCw size={16} className="spin" /> : <Check size={16} />}
              <span>{isSubmittingAudit ? 'Saving to Database...' : 'Submit Blind Count'}</span>
            </button>
          </form>

          {auditResult && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              background: auditResult.variance === 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${auditResult.variance === 0 ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: auditResult.variance === 0 ? '#10b981' : '#ef4444', marginBottom: '0.25rem' }}>
                {auditResult.variance === 0 ? '✅ Perfect Tally!' : `⚠️ Discrepancy Detected: ${auditResult.variance > 0 ? '+' : ''}${auditResult.variance} Units`}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                System Ledger Expected: <strong>{auditResult.expected}</strong> • Physical Counted: <strong>{auditResult.counted}</strong>
              </div>
              {auditResult.variance !== 0 && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.4rem', fontWeight: '600' }}>
                  Financial variance of ₹{Number(auditResult.lossVal).toLocaleString('en-IN')} logged to PostgreSQL cycle count record!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Div: Damage & Transit Loss Reporting Form */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div>
              <h3 className="dash-panel-title">Report Damaged / Leaking Stock</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires reason code and photo evidence for Maker-Checker approval.</p>
            </div>
            <span className="type-tag" style={{ background: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>
              Maker-Checker Queue
            </span>
          </div>

          <form onSubmit={handleLogDamage} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.5rem 0' }}>
            <div className="form-group">
              <label className="form-label">Product (From Live Branch DB)</label>
              {loadingInv ? (
                <div style={{ padding: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading live products...</div>
              ) : (
                <SearchableProductSelect
                  products={inventory}
                  selectedSku={damageSku}
                  onSelect={(sku) => setDamageSku(sku)}
                  placeholder="Type to search SKU or Product for damage report..."
                  showStock={true}
                />
              )}
              {selectedDamageProduct && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Current Available Stock: <strong style={{ color: currentDamageStock > 0 ? '#10b981' : '#ef4444' }}>{currentDamageStock} units</strong>
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Unit Cost: <strong>₹{damageUnitPrice.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Damaged Qty</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, currentDamageStock)}
                  value={damageQty}
                  onChange={(e) => setDamageQty(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason Code</label>
                <select value={damageReason} onChange={(e) => setDamageReason(e.target.value)} className="form-input">
                  <option value="DAMAGED_IN_TRANSIT">Damaged in Transit</option>
                  <option value="HANDLING_DAMAGE">Handling / Drop Damage</option>
                  <option value="LEAK_DEFECT">Factory Valve Leak</option>
                  <option value="EXPIRED_TEST">Hydro-Test Expired</option>
                  <option value="PILFERAGE_SHORTAGE">Pilferage / Shortage</option>
                </select>
              </div>
            </div>

            {/* Estimated Loss Amount Badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.6rem 0.85rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Calculated Loss Amount:</span>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444' }}>
                ₹{calculatedLossValue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Photo Evidence (Mandatory for write-off)</label>
              <div
                style={{
                  border: `1px dashed ${photoAttached ? '#10b981' : 'var(--border-medium)'}`,
                  padding: '0.85rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: photoAttached ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-input)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setPhotoAttached(!photoAttached);
                  showToast(!photoAttached ? 'Evidence photo attached: DAMAGE_EVIDENCE_AMD01_041.jpg' : 'Photo evidence removed.');
                }}
              >
                {photoAttached ? (
                  <>
                    <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 0.2rem auto' }} />
                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#10b981' }}>Attached: DAMAGE_EVIDENCE_AMD01_041.jpg</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click again to remove or replace</div>
                  </>
                ) : (
                  <>
                    <Camera size={24} color="var(--brand-accent)" style={{ margin: '0 auto 0.2rem auto' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click to capture or attach photo evidence</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Simulates direct upload of JPG, PNG up to 5MB</div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingDamage || loadingInv || inventory.length === 0}
              className="primary-action-btn"
              style={{ justifyContent: 'center', background: '#d97706', color: '#ffffff' }}
            >
              {isSubmittingDamage ? <RefreshCw size={16} className="spin" /> : <AlertTriangle size={16} />}
              <span>{isSubmittingDamage ? 'Submitting to DB...' : 'Submit to Owner Approval'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Database Tables Section: Pending Maker-Checker Queue & Cycle Count Audit Logs */}
      <div className="dash-panel animate-fade-in" style={{ marginTop: '1.5rem' }}>
        <div className="dash-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className={`table-filter-tab ${activeTableTab === 'approvals' ? 'active' : ''}`}
              onClick={() => setActiveTableTab('approvals')}
              style={{
                background: activeTableTab === 'approvals' ? 'var(--brand-accent)' : 'transparent',
                color: activeTableTab === 'approvals' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Maker-Checker Queue ({pendingReviews.length})
            </button>
            <button
              className={`table-filter-tab ${activeTableTab === 'counts' ? 'active' : ''}`}
              onClick={() => setActiveTableTab('counts')}
              style={{
                background: activeTableTab === 'counts' ? 'var(--brand-accent)' : 'transparent',
                color: activeTableTab === 'counts' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Cycle Count History ({cycleCounts.length})
            </button>
          </div>

          <div className="table-toolbar">
            <div className="dash-search-box" style={{ minWidth: '200px' }}>
              <Search size={14} />
              <input
                placeholder={activeTableTab === 'approvals' ? 'Search adjustments...' : 'Search count logs...'}
                className="dash-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="dash-btn" onClick={handleExportCSV} title="Export audit trail to CSV">
              <Download size={14} /><span>Export CSV</span>
            </button>
          </div>
        </div>

        {activeTableTab === 'approvals' ? (
          <>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Adjustment #</th>
                    <th>Product / Item</th>
                    <th>Qty</th>
                    <th>Reason</th>
                    <th>Loss Value</th>
                    <th>Requested By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedReviews.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No stock adjustments in queue. Report a damaged or missing item above to record to PostgreSQL.
                      </td>
                    </tr>
                  ) : (
                    pagedReviews.map(r => (
                      <tr key={r.id}>
                        <td><span className="mono-badge">{r.adjustment_no}</span></td>
                        <td className="td-bold">
                          <div>{r.item_name}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SKU: {r.sku}</span>
                        </td>
                        <td><strong>{r.quantity}</strong></td>
                        <td><span className="type-tag">{r.reason_code}</span></td>
                        <td className="td-money td-red">₹{Number(r.loss_value || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>{r.requested_by || 'Staff'}</div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.request_date}</span>
                        </td>
                        <td>
                          <span className={`status-pill status-${(r.status || 'PENDING').toLowerCase()}`}>
                            {r.status === 'APPROVED' ? '✅ Approved' : r.status === 'REJECTED' ? '❌ Rejected' : '⏳ Pending Review'}
                          </span>
                        </td>
                        <td>
                          {r.status === 'PENDING' ? (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                className="table-action-btn"
                                style={{ color: '#10b981', borderColor: '#10b98140' }}
                                onClick={() => handleDecision(r.id, true)}
                                title="Approve write-off and deduct from branch stock"
                              >
                                <Check size={14} /><span>Approve</span>
                              </button>
                              <button
                                className="table-action-btn"
                                style={{ color: '#ef4444', borderColor: '#ef444440' }}
                                onClick={() => handleDecision(r.id, false)}
                                title="Reject write-off"
                              >
                                <X size={14} /><span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {r.reviewed_by ? `By ${r.reviewed_by}` : 'Processed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredReviews.length > 10 && <TablePagination {...reviewsPagination} />}
          </>
        ) : (
          <>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Session #</th>
                    <th>Section / Category</th>
                    <th>Count Mode</th>
                    <th>Auditor</th>
                    <th>Ledger Qty</th>
                    <th>Physical Qty</th>
                    <th>Variance</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCounts.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No cycle counts recorded for this branch yet. Submit a blind count above to record to PostgreSQL.
                      </td>
                    </tr>
                  ) : (
                    pagedCounts.map(c => (
                      <tr key={c.id}>
                        <td><span className="mono-badge">{c.session_no}</span></td>
                        <td className="td-bold">{c.section}</td>
                        <td><span className="type-tag">{c.count_mode}</span></td>
                        <td>{c.auditor_name}</td>
                        <td>{c.system_qty}</td>
                        <td><strong>{c.physical_qty}</strong></td>
                        <td style={{ color: c.variance_qty === 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                          {c.variance_qty > 0 ? `+${c.variance_qty}` : c.variance_qty}
                        </td>
                        <td>
                          <span className={`status-pill ${c.variance_qty === 0 ? 'status-active' : 'status-pending'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>{c.session_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredCounts.length > 10 && <TablePagination {...countsPagination} />}
          </>
        )}
      </div>

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ─── BRANCH RESERVATIONS (POSTGRESQL SYNCED & REAL-TIME) ─────────────
export function BranchReservations({ activeBranch }) {
  const [branchHolds, setBranchHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Products from inventory
  const [availableProducts, setAvailableProducts] = useState([]);

  // New reservation form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [itemSku, setItemSku] = useState('FE-ABC-4');
  const [qty, setQty] = useState(1);
  const [hoursValid, setHoursValid] = useState('4');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch customer holds from PostgreSQL
  const fetchHolds = async () => {
    try {
      setSyncing(true);
      const code = activeBranch?.code || 'AMD-01';
      const res = await fetch(`/api/holds?branchCode=${encodeURIComponent(code)}`);
      const json = await res.json();
      if (json.success) {
        setBranchHolds(json.data || []);
      }
    } catch (err) {
      console.warn('Could not fetch customer holds:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  // Fetch inventory products for selector
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/inventory?branch=*');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAvailableProducts(json.data);
      }
    } catch (err) {
      console.warn('Could not load products for holds:', err);
    }
  };

  useEffect(() => {
    fetchHolds();
    fetchProducts();
  }, [activeBranch?.code]);

  const selectedProduct = availableProducts.find(p => p.pid === itemSku) || {
    pid: 'FE-ABC-4',
    name: 'ABC Dry Powder Extinguisher 4kg',
    sale_price: 1321.60
  };

  const handleRelease = async (id, holdNo) => {
    try {
      const res = await fetch(`/api/holds/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Hold ${holdNo || id} cancelled. Stock restored to shelf!`);
        fetchHolds();
      } else {
        alert(json.message || 'Could not cancel hold');
      }
    } catch (err) {
      alert(`Error cancelling hold: ${err.message}`);
    }
  };

  const handleBillAtPos = async (hold) => {
    try {
      const res = await fetch(`/api/holds/${hold.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'BILLED' })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Hold ${hold.hold_no || hold.id} converted to POS Sale! Billed ${hold.qty}x ${hold.item_code || hold.sku}.`);
        fetchHolds();
      } else {
        alert(json.message || 'Could not bill hold');
      }
    } catch (err) {
      alert(`Error billing hold: ${err.message}`);
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        branch_code: activeBranch?.code || 'AMD-01',
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim(),
        item_code: selectedProduct.pid,
        item_name: selectedProduct.name,
        qty: parseInt(qty, 10) || 1,
        unit_price: parseFloat(selectedProduct.sale_price) || 1321.60,
        total_amount: (parseInt(qty, 10) || 1) * (parseFloat(selectedProduct.sale_price) || 1321.60),
        hours_valid: parseFloat(hoursValid) || 4,
        notes: notes.trim()
      };

      const res = await fetch('/api/holds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Customer hold ${json.data.hold_no} confirmed for ${json.data.customer_name}!`);
        setShowNewModal(false);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setNotes('');
        fetchHolds();
      } else {
        alert(json.message || 'Could not create reservation hold');
      }
    } catch (err) {
      alert(`Error creating hold: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Format seconds to HH:MM:SS
  const formatTimer = (seconds) => {
    if (seconds <= 0) return 'EXPIRED';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredHolds = branchHolds.filter(h => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      (h.hold_no || '').toLowerCase().includes(term) ||
      (h.customer_name || '').toLowerCase().includes(term) ||
      (h.customer_phone || '').toLowerCase().includes(term) ||
      (h.item_name || '').toLowerCase().includes(term) ||
      (h.item_code || '').toLowerCase().includes(term) ||
      (h.status || '').toLowerCase().includes(term);

    const effStatus = h.computed_status || h.status;
    if (statusFilter === 'ACTIVE') return matchesSearch && effStatus === 'ACTIVE';
    if (statusFilter === 'EXPIRING_SOON') return matchesSearch && effStatus === 'EXPIRING_SOON';
    if (statusFilter === 'BILLED') return matchesSearch && effStatus === 'BILLED';
    if (statusFilter === 'CANCELLED') return matchesSearch && effStatus === 'CANCELLED';
    return matchesSearch;
  });

  const { paginatedItems: pagedHolds, paginationProps: holdsPagination } = useTablePagination(filteredHolds, 10);

  const handleExportHolds = () => {
    const headers = ['Hold Ref', 'Customer', 'Phone', 'Product', 'SKU', 'Qty Held', 'Total Amount', 'Expires At', 'Status'];
    const rows = [
      headers,
      ...filteredHolds.map(h => [
        h.hold_no, h.customer_name, h.customer_phone, h.item_name, h.item_code,
        h.qty, `₹${Math.round(h.total_amount || 0).toLocaleString('en-IN')}`,
        h.expires_at ? new Date(h.expires_at).toLocaleString('en-IN') : '',
        h.computed_status || h.status
      ])
    ];
    downloadCSV(`Reservations_${activeBranch?.code || 'ALL'}.csv`, rows);
    showToast('Customer reservations exported to CSV successfully!');
  };

  // Live stats
  const activeCount = branchHolds.filter(h => (h.computed_status || h.status) === 'ACTIVE').length;
  const expiringCount = branchHolds.filter(h => (h.computed_status || h.status) === 'EXPIRING_SOON').length;
  const billedCount = branchHolds.filter(h => h.status === 'BILLED').length;
  const totalHeldVal = branchHolds
    .filter(h => (h.computed_status || h.status) === 'ACTIVE' || (h.computed_status || h.status) === 'EXPIRING_SOON')
    .reduce((sum, h) => sum + (parseFloat(h.total_amount) || 0), 0);

  return (
    <>
      <div className="page-header-row animate-fade-in">
        <div>
          <h2 className="page-title">Active Customer Holds • {activeBranch?.name || activeBranch?.code}</h2>
          <p className="page-desc">
            Reserved quantities held behind the counter for pickup, backed directly by PostgreSQL database. Convert to POS Invoice or cancel to restore inventory.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={fetchHolds} title="Sync with DB" disabled={syncing}>
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
          <div className="dash-search-box" style={{ minWidth: '180px' }}>
            <Search size={14} />
            <input
              placeholder="Search holds, customer, SKU..."
              className="dash-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="secondary-action-btn" onClick={handleExportHolds}>
            <Download size={14} /><span>Export</span>
          </button>
          <button className="primary-action-btn" onClick={() => setShowNewModal(true)}>
            <Plus size={16} /><span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* 4 Live KPI Cards */}
      <div className="dash-stats-grid animate-fade-in" style={{ marginBottom: '1.25rem' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Active Holds on Shelf</span>
            <div className="stat-icon-circle" style={{ background: '#38bdf820', color: '#38bdf8' }}><Store size={18} /></div>
          </div>
          <div className="stat-value">{activeCount} Orders</div>
          <div className="stat-change positive"><span>Awaiting customer pickup</span></div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Expiring Soon (&lt; 1hr)</span>
            <div className="stat-icon-circle" style={{ background: '#f59e0b20', color: '#f59e0b' }}><Clock size={18} /></div>
          </div>
          <div className="stat-value" style={{ color: expiringCount > 0 ? '#f59e0b' : 'inherit' }}>{expiringCount} Holds</div>
          <div className="stat-change warning"><span>Needs counter follow-up</span></div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Billed & Picked Up</span>
            <div className="stat-icon-circle" style={{ background: '#10b98120', color: '#10b981' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-value">{billedCount} Fulfilled</div>
          <div className="stat-change positive"><span>Converted to POS Sales</span></div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Held Inventory Value</span>
            <div className="stat-icon-circle" style={{ background: '#a855f720', color: '#a855f7' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">₹{Math.round(totalHeldVal).toLocaleString('en-IN')}</div>
          <div className="stat-change neutral"><span>{branchHolds.length} Total records in DB</span></div>
        </div>
      </div>

      <div className="dash-panel animate-fade-in">
        <div className="dash-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="dash-panel-title">Counter Hold Shelf ({filteredHolds.length} Orders)</h3>
            <div className="filter-pill-group" style={{ display: 'flex', gap: '0.35rem' }}>
              <button className={`analytics-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`} onClick={() => setStatusFilter('ALL')}>All</button>
              <button className={`analytics-pill-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`} onClick={() => setStatusFilter('ACTIVE')}>Active ({activeCount})</button>
              <button className={`analytics-pill-btn ${statusFilter === 'EXPIRING_SOON' ? 'active' : ''}`} onClick={() => setStatusFilter('EXPIRING_SOON')}>Expiring ({expiringCount})</button>
              <button className={`analytics-pill-btn ${statusFilter === 'BILLED' ? 'active' : ''}`} onClick={() => setStatusFilter('BILLED')}>Billed ({billedCount})</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
            <div>Loading customer reservations from PostgreSQL...</div>
          </div>
        ) : filteredHolds.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No customer reservations matching the selected filter. Click "New Reservation" to hold products behind the counter.
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hold Reference</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Total (₹)</th>
                  <th>Expires In</th>
                  <th>Status</th>
                  <th>Counter Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedHolds.map(h => {
                  const effStatus = h.computed_status || h.status;
                  const isPending = effStatus === 'ACTIVE' || effStatus === 'EXPIRING_SOON';

                  return (
                    <tr key={h.id || h.hold_no}>
                      <td><span className="mono-badge">{h.hold_no}</span></td>
                      <td className="td-bold">{h.customer_name}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>{h.customer_phone || 'N/A'}</div>
                        {h.customer_email && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.customer_email}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{h.item_name}</div>
                        {h.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.notes}</div>}
                      </td>
                      <td className="mono">{h.item_code}</td>
                      <td className="td-bold" style={{ color: 'var(--brand-accent)' }}>{h.qty}</td>
                      <td className="td-money">₹{Math.round(parseFloat(h.total_amount) || 0).toLocaleString('en-IN')}</td>
                      <td>
                        {isPending ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '12px',
                            background: effStatus === 'EXPIRING_SOON' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: effStatus === 'EXPIRING_SOON' ? '#ef4444' : '#10b981'
                          }}>
                            <Clock size={12} /> {formatTimer(h.seconds_left || 0)}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {effStatus === 'BILLED' ? 'Collected' : 'Cancelled'}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          effStatus === 'ACTIVE' ? 'active' :
                          effStatus === 'EXPIRING_SOON' ? 'warning' :
                          effStatus === 'BILLED' ? 'active' : 'danger'
                        }`}>
                          {effStatus === 'ACTIVE' ? '🟢 Active Hold' :
                           effStatus === 'EXPIRING_SOON' ? '⚠️ Expiring Soon' :
                           effStatus === 'BILLED' ? '✅ Billed & Out' : '❌ Cancelled'}
                        </span>
                      </td>
                      <td>
                        {isPending ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              className="table-action-btn"
                              onClick={() => handleBillAtPos(h)}
                              style={{ color: '#ffffff' }}
                              title="Convert to POS Invoice & Bill"
                            >
                              <span>Bill at POS</span>
                            </button>
                            <button
                              className="table-action-btn danger"
                              onClick={() => handleRelease(h.id, h.hold_no)}
                              style={{ color: '#ffffff' }}
                              title="Cancel hold and restore stock"
                            >
                              <span>Cancel Hold</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No action required</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <TablePagination {...holdsPagination} />
          </div>
        )}
      </div>

      {/* NEW RESERVATION MODAL */}
      {showNewModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                <Sparkles size={20} color="var(--brand-accent)" />
                <span>Create Customer Reservation Hold</span>
              </div>
              <button className="modal-dialog-close" onClick={() => setShowNewModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateReservation}>
              <div className="modal-dialog-body">
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patel Engineering Works"
                      className="form-input"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98250 12345"
                      className="form-input"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">Reserved Product (From Inventory) *</label>
                    <select className="form-input" value={itemSku} onChange={e => setItemSku(e.target.value)}>
                      {availableProducts.map(p => (
                        <option key={p.pid} value={p.pid}>
                          {p.pid}: {p.name} (Available: {p.current_stock || 0} | ₹{p.sale_price})
                        </option>
                      ))}
                      {availableProducts.length === 0 && (
                        <>
                          <option value="FE-ABC-4">FE-ABC-4: ABC Dry Powder 4kg</option>
                          <option value="FE-CO2-2">FE-CO2-2: CO2 Extinguisher 2kg</option>
                          <option value="SH-M201">SH-M201: Safety Helmet M-201</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Hold Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-input"
                      value={qty}
                      onChange={e => setQty(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Hold Validity Period</label>
                    <select className="form-input" value={hoursValid} onChange={e => setHoursValid(e.target.value)}>
                      <option value="1">1 Hour (Urgent phone booking)</option>
                      <option value="2">2 Hours</option>
                      <option value="4">4 Hours (Standard)</option>
                      <option value="8">8 Hours (Full Shift)</option>
                      <option value="24">24 Hours (Next Day Pickup)</option>
                      <option value="48">48 Hours (Weekend Reserve)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Email</label>
                    <input
                      type="email"
                      placeholder="e.g. client@company.com"
                      className="form-input"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hold Reason / Customer Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Client requested counter hold until PO payment release"
                    className="form-input"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Reserved Amount:</span>
                    <span style={{ fontWeight: '700', color: 'var(--brand-accent)' }}>
                      ₹{Math.round((parseInt(qty, 10) || 1) * (parseFloat(selectedProduct.sale_price) || 1321.60)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Note: Creating hold will record in PostgreSQL and hold the shelf item until pickup or cancellation.
                  </div>
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn" disabled={submitting}>
                  <Check size={16} /><span>{submitting ? 'Confirming...' : 'Confirm Counter Hold'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

// ========================================================================
// ─── MASTER CATEGORY (Manage Categories & Subcategories) ────────────────
// ========================================================================
export function BranchMasterCategory({ activeBranch }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form states
  const [formType, setFormType] = useState('category'); // 'category' | 'subcategory'
  const [formTitle, setFormTitle] = useState('');
  const [formPrefix, setFormPrefix] = useState('');
  const [formCategory, setFormCategory] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch all categories from actual cat_sub table in DB
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cat-sub');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add Category/Subcategory (stores in cat_sub table in DB)
  const handleSaveCatSub = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrefix.trim()) return;
    try {
      const res = await fetch('/api/cat-sub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tittle: formTitle.trim(),
          sp_cat: formPrefix.trim().toUpperCase(),
          type: formType
        })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => [...prev, data.data]);
        setShowAddModal(false);
        setFormTitle('');
        setFormPrefix('');
        showToast(`${formType === 'category' ? 'Category' : 'Subcategory'} added to database successfully!`);
      }
    } catch (err) {
      console.error('Failed to add category:', err);
      showToast('Error saving entry.');
    }
  };

  // Delete Category/Subcategory (removes from cat_sub table in DB)
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      const res = await fetch(`/api/cat-sub/${deletingItem.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== deletingItem.id));
        showToast(`${deletingItem.type === 'category' ? 'Category' : 'Subcategory'} deleted from database.`);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Error deleting item.');
    } finally {
      setDeletingItem(null);
    }
  };

  const categoryItems = categories.filter(c => c.type === 'category');
  const subCategoryItems = categories.filter(c => c.type === 'subcategory');

  return (
    <div className="animate-fade-in" style={{ padding: '0 0.5rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '26px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0'
          }}>
            Manage Categories & Subcategories
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Manage master product categories and subcategories for SKU generation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          <button
            type="button"
            onClick={() => {
              setFormType('category');
              setFormTitle('');
              setFormPrefix('');
              setShowAddModal(true);
            }}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Category / Subcategory</span>
          </button>
        </div>
      </div>

      {/* Two Side-by-Side Cards (Matching Image 2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Card: Categories */}
        <div className="master-cat-card">
          {/* Card Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
            <Folder size={20} color="#3b82f6" fill="#3b82f6" />
            <h3 className="master-cat-card-title">Categories</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              ({categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'})
            </span>
            <button
              type="button"
              onClick={() => {
                setFormType('category');
                setFormTitle('');
                setFormPrefix('');
                setShowAddModal(true);
              }}
              style={{
                marginLeft: 'auto',
                background: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={14} /> Add Category
            </button>
          </div>

          {/* Table Header */}
          <div className="master-cat-table-header">
            <span>NAME</span>
            <span>CODE (PREFIX)</span>
            <span style={{ textAlign: 'right' }}></span>
          </div>

          {/* Categories Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '160px', marginBottom: '28px' }}>
            {categoryItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Folder size={36} style={{ margin: '0 auto 8px auto', opacity: 0.3, display: 'block' }} />
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No categories added yet.</p>
              </div>
            ) : (
              categoryItems.map(item => (
                <div key={item.id} className="master-cat-row">
                  <span className="master-cat-row-name">
                    {item.tittle}
                  </span>
                  <div>
                    <span className="master-cat-code-badge">
                      {item.sp_cat}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="master-cat-delete-btn"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Card: Subcategories */}
        <div className="master-cat-card">
          {/* Card Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
            <Layers size={20} color="#3b82f6" />
            <h3 className="master-cat-card-title">Subcategories</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              ({subCategoryItems.length} {subCategoryItems.length === 1 ? 'item' : 'items'})
            </span>
            <button
              type="button"
              onClick={() => {
                setFormType('subcategory');
                setFormTitle('');
                setFormPrefix('');
                if (categoryItems.length > 0 && !formCategory) {
                  setFormCategory(categoryItems[0].tittle);
                }
                setShowAddModal(true);
              }}
              style={{
                marginLeft: 'auto',
                background: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={14} /> Add Subcategory
            </button>
          </div>

          {/* Table Header */}
          <div className="master-cat-table-header">
            <span>NAME</span>
            <span>CODE (PREFIX)</span>
            <span style={{ textAlign: 'right' }}></span>
          </div>

          {/* Subcategories Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '160px', marginBottom: '28px' }}>
            {subCategoryItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Layers size={36} style={{ margin: '0 auto 8px auto', opacity: 0.3, display: 'block' }} />
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No subcategories added yet.</p>
              </div>
            ) : (
              subCategoryItems.map(item => (
                <div key={item.id} className="master-cat-row">
                  <span className="master-cat-row-name">
                    {item.tittle}
                  </span>
                  <div>
                    <span className="master-subcat-code-badge">
                      {item.sp_cat}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="master-cat-delete-btn"
                      title="Delete Subcategory"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* ========================================================================
          MODAL: ADD CATEGORY / SUBCATEGORY
          ======================================================================== */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderPlus size={20} color="#3b82f6" />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Category / Subcategory</span>
              </div>
              <button type="button" className="modal-dialog-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCatSub}>
              <div className="modal-dialog-body">
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Type *</label>
                  <select
                    className="form-input"
                    value={formType}
                    onChange={e => {
                      const newType = e.target.value;
                      setFormType(newType);
                      if (newType === 'subcategory' && categoryItems.length > 0 && !formCategory) {
                        setFormCategory(categoryItems[0].tittle);
                      }
                    }}
                  >
                    <option value="category">Category</option>
                    <option value="subcategory">Subcategory</option>
                  </select>
                </div>

                {formType === 'subcategory' && categoryItems.length > 0 && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={formCategory || (categoryItems[0]?.tittle || '')}
                      onChange={e => setFormCategory(e.target.value)}
                    >
                      {categoryItems.map(c => (
                        <option key={c.id} value={c.tittle}>{c.tittle}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Name / Title *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    className="form-input"
                    placeholder={formType === 'category' ? 'e.g. Electrical Safety' : 'e.g. Insulated Gloves'}
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Code (Prefix for SKU) *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. ELS"
                    value={formPrefix}
                    onChange={e => setFormPrefix(e.target.value.toUpperCase())}
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '6px', display: 'block' }}>
                    This prefix will be used in auto-generating SKUs (e.g. ELS-001).
                  </small>
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button type="button" className="secondary-action-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-action-btn" style={{ background: '#2563eb' }}>
                  <Check size={16} />
                  <span>Save Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: CONFIRM DELETE
          ======================================================================== */}
      {deletingItem && (
        <div className="modal-backdrop-overlay" onClick={() => setDeletingItem(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '420px', textAlign: 'center', padding: '30px 24px' }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>{deletingItem.tittle}</strong> ({deletingItem.sp_cat})? Deletions are synced immediately.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" className="secondary-action-btn" onClick={() => setDeletingItem(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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

      {/* Toast Banner */}
      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// Backwards compatibility alias
export const BranchProductsCatalog = BranchMasterCategory;

/* ========================================================================
   BRANCH SETTINGS & MASTER DATA CORRECTION (BRANCH OWNER ONLY)
   Strictly accessible only to Branch Owner / Manager and Platform Owner
   ======================================================================== */
export function BranchDataCorrectionSettings({ activeBranch, currentUser, onBranchUpdated }) {
  const isBranchOwnerOrAdmin =
    currentUser?.role === 'BRANCH_MANAGER' ||
    currentUser?.role === 'TENANT_OWNER' ||
    currentUser?.role === 'PLATFORM_ADMIN';

  const [formData, setFormData] = useState({
    name: activeBranch?.name || '',
    city: activeBranch?.city || '',
    state: activeBranch?.state || 'Gujarat',
    type: activeBranch?.type || 'BRANCH_OFFICE',
    address: activeBranch?.address || '',
    phone: activeBranch?.phone || '',
    email: activeBranch?.email || '',
    gstin: activeBranch?.gstin || '',
    latitude: activeBranch?.latitude || 23.0225,
    longitude: activeBranch?.longitude || 72.5714,
    managerName: currentUser?.role === 'BRANCH_MANAGER' ? (currentUser?.name || '') : '',
    managerEmail: currentUser?.role === 'BRANCH_MANAGER' ? (currentUser?.email || '') : '',
    managerPassword: '',
    confirmPassword: ''
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [gpsDetecting, setGpsDetecting] = useState(false);

  useEffect(() => {
    if (activeBranch) {
      setFormData(prev => ({
        ...prev,
        name: activeBranch.name || prev.name,
        city: activeBranch.city || prev.city,
        state: activeBranch.state || prev.state,
        type: activeBranch.type || prev.type,
        address: activeBranch.address || prev.address,
        phone: activeBranch.phone || prev.phone,
        email: activeBranch.email || prev.email,
        gstin: activeBranch.gstin || prev.gstin,
        latitude: activeBranch.latitude || prev.latitude,
        longitude: activeBranch.longitude || prev.longitude
      }));
    }
  }, [activeBranch]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // If unauthorized user tries to access
  if (!isBranchOwnerOrAdmin) {
    return (
      <div className="dash-panel animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '650px', margin: '2rem auto' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Lock size={34} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Access Restricted: Branch Owner Only
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Branch master data correction, GPS replenishment coordinates, and manager password credentials can only be updated by the verified Branch Owner/Manager or Platform Admin.
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#38bdf8'
        }}>
          <span>Your current session: <strong>{currentUser?.name || 'Staff Member'}</strong> • Role: <strong>{currentUser?.role || 'STAFF'}</strong></span>
        </div>
      </div>
    );
  }

  const handleAutoDetectGPS = () => {
    setGpsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
          setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
          setGpsDetecting(false);
          showToast(`Live GPS detected: ${lat}, ${lng}`);
        },
        () => {
          // Fallback to city defaults if permission denied or offline
          let defaultLat = 23.0225;
          let defaultLng = 72.5714;
          if (formData.city.toLowerCase().includes('baroda') || formData.city.toLowerCase().includes('vadodara') || activeBranch?.code === 'BRD-02') {
            defaultLat = 22.307159;
            defaultLng = 73.181219;
          }
          setFormData(prev => ({ ...prev, latitude: defaultLat, longitude: defaultLng }));
          setGpsDetecting(false);
          showToast(`Standard city GPS coordinates assigned: ${defaultLat}, ${defaultLng}`);
        },
        { timeout: 7000 }
      );
    } else {
      setGpsDetecting(false);
      showToast('Geolocation not supported by browser. Coordinates retained.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.managerPassword && formData.managerPassword !== formData.confirmPassword) {
      showToast('Passwords do not match! Please check password confirmation.');
      return;
    }

    if (formData.managerPassword && formData.managerPassword.length < 6) {
      showToast('New password must be at least 6 characters.');
      return;
    }

    try {
      setSaving(true);
      const companyId = activeBranch?.companyId || activeBranch?.company_id || currentUser?.companyId || currentUser?.company_id || currentUser?.tenantId;
      const res = await fetch('/api/branch/correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: activeBranch?.id,
          branchCode: activeBranch?.code,
          companyId: companyId,
          name: formData.name,
          city: formData.city,
          state: formData.state,
          type: formData.type,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          gstin: formData.gstin,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          managerName: formData.managerName,
          managerEmail: formData.managerEmail,
          managerPassword: formData.managerPassword || undefined
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'Branch data and owner credentials updated successfully in PostgreSQL!');
        if (onBranchUpdated && json.data?.branch) {
          onBranchUpdated(json.data.branch);
        }
        setFormData(prev => ({ ...prev, managerPassword: '', confirmPassword: '' }));
      } else {
        showToast(`Correction failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error saving branch corrections: ${err.message}`);
    } finally {
      setSaving(false);
    }
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

      {/* Header */}
      <div className="page-header-row animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="page-title">Branch Settings & Master Data Correction</h2>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              🔒 Verified Branch Owner Access
            </span>
          </div>
          <p className="page-desc">
            Correct branch master information, postal address, contact phone, GSTIN, GPS coordinates for inter-branch replenishment, and branch manager account credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section 1: Branch Profile & Identity */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building2 size={18} color="var(--brand-accent)" />
              <h3 className="dash-panel-title">1. Branch Profile & Legal Master</h3>
            </div>
            <span className="mono-badge">{activeBranch.code} Scope</span>
          </div>

          <div className="modal-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="modal-form-field">
              <label className="modal-field-label">Branch Code (System Key)</label>
              <input
                value={activeBranch.code}
                readOnly
                disabled
                className="modal-field-input"
                style={{ background: 'rgba(255,255,255,0.04)', opacity: 0.8, cursor: 'not-allowed', fontWeight: 700 }}
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">Branch Official Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Amd-Branch (Ahmedabad)"
                className="modal-field-input"
                required
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">Branch Operating Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="modal-field-select"
              >
                <option value="FLAGSHIP_STORE">Flagship Store</option>
                <option value="REGIONAL_HUB">Regional Distribution Hub</option>
                <option value="FRANCHISE_OUTLET">Franchise Retail Outlet</option>
                <option value="BRANCH_OFFICE">Branch Office</option>
              </select>
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">City *</label>
              <input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Ahmedabad"
                className="modal-field-input"
                required
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">State *</label>
              <input
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Gujarat"
                className="modal-field-input"
                required
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">GSTIN Number</label>
              <input
                value={formData.gstin}
                onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                placeholder="24AAACM1234F1Z8"
                className="modal-field-input"
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="modal-form-field full-width" style={{ gridColumn: 'span 3' }}>
              <label className="modal-field-label">Complete Postal & Dispatch Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Shop number, building, street, industrial area, pincode..."
                className="modal-field-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="modal-form-field" style={{ gridColumn: 'span 1' }}>
              <label className="modal-field-label">Counter Contact Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 79 2630 1100"
                className="modal-field-input"
              />
            </div>

            <div className="modal-form-field" style={{ gridColumn: 'span 2' }}>
              <label className="modal-field-label">Branch Dispatch & Operations Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="ahmedabad@mannengineers.in"
                className="modal-field-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: GPS Coordinates for Nearest-Branch Stock Transfer Engine */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Compass size={18} color="#10b981" />
              <h3 className="dash-panel-title">2. GPS Coordinates (Stock Replenishment Engine)</h3>
            </div>
            <button
              type="button"
              onClick={handleAutoDetectGPS}
              className="secondary-action-btn"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              disabled={gpsDetecting}
            >
              <MapPin size={14} className={gpsDetecting ? 'spin-icon' : ''} />
              <span>{gpsDetecting ? 'Detecting GPS...' : 'Auto-Detect Current GPS'}</span>
            </button>
          </div>

          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            lineHeight: 1.5
          }}>
            <strong style={{ color: '#10b981' }}>How these coordinates work:</strong> When any branch clicks <em>"Request Stock Transfer"</em> in the Product 360 matrix, the system calculates the exact Euclidean/Haversine distance from these coordinates to all other branches to instantly identify the closest warehouse holding adequate stock.
          </div>

          <div className="modal-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="modal-form-field">
              <label className="modal-field-label">Latitude (e.g. 23.022500 for Ahmedabad)</label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="23.0225"
                className="modal-field-input"
                required
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">Longitude (e.g. 72.571400 for Ahmedabad)</label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="72.5714"
                className="modal-field-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Branch Owner / Manager Credentials & Password Correction */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Key size={18} color="#38bdf8" />
              <h3 className="dash-panel-title">3. Branch Owner / Manager Credentials & Password</h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct PostgreSQL update</span>
          </div>

          <div className="modal-form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="modal-form-field">
              <label className="modal-field-label">Branch Manager Full Name</label>
              <input
                value={formData.managerName}
                onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                placeholder="Amd-Branch Manager"
                className="modal-field-input"
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">Manager Login Email</label>
              <input
                type="email"
                value={formData.managerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, managerEmail: e.target.value }))}
                placeholder="branch@b.1.com"
                className="modal-field-input"
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">Update Password (Leave blank to keep existing)</label>
              <input
                type="password"
                value={formData.managerPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, managerPassword: e.target.value }))}
                placeholder="Enter new password (min. 6 characters)"
                className="modal-field-input"
              />
            </div>

            <div className="modal-form-field">
              <label className="modal-field-label">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Re-enter new password"
                className="modal-field-input"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="primary-action-btn"
            disabled={saving}
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}
          >
            <Check size={18} />
            <span>{saving ? 'Saving to Database...' : 'Save All Corrections'}</span>
          </button>
        </div>
      </form>
    </>
  );
}

/* ========================================================================
   BRANCH TEAM & STAFF DIRECTORY (OPEN FOR EVERYONE IN THE BRANCH)
   Clean single-page view for every employee to view their team
   ======================================================================== */
export function BranchTeamDirectory({ activeBranch, currentUser }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showSalaries, setShowSalaries] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [resettingMember, setResettingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Add Form state
  const [addForm, setAddForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: 'Pass@123',
    role: 'STAFF',
    department: 'Sales & Billing',
    designation: 'Counter Sales Officer',
    salary: '32000'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const isBranchManagerOrAdmin =
    currentUser?.role === 'BRANCH_MANAGER' ||
    currentUser?.role === 'TENANT_OWNER' ||
    currentUser?.role === 'PLATFORM_ADMIN';

  const fetchBranchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/employees?branch=${activeBranch.code}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTeam(json.data);
      }
    } catch (err) {
      console.error('Failed to load branch team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeBranch) {
      fetchBranchTeam();
    }
  }, [activeBranch]);

  // Handle Add Employee (Direct PostgreSQL Insert)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: addForm.name.trim(),
        username: addForm.username.trim().toLowerCase(),
        email: addForm.email.trim().toLowerCase(),
        phone: addForm.phone.trim(),
        password: addForm.password,
        role: addForm.role || 'STAFF',
        department: addForm.department,
        designation: addForm.designation.trim() || 'Staff',
        salary: parseFloat(addForm.salary) || 0,
        branchCode: activeBranch.code,
        branchName: activeBranch.name,
        companyId: activeBranch.companyId || 'comp_mann',
        companyName: activeBranch.companyName || 'Mann Engineers Fire Safety'
      };

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        showToast(`Staff member "${json.data.name}" registered in PostgreSQL database!`);
        setShowAddModal(false);
        setAddForm({
          name: '',
          username: '',
          email: '',
          phone: '',
          password: 'Pass@123',
          role: 'STAFF',
          department: 'Sales & Billing',
          designation: 'Counter Sales Officer',
          salary: '32000'
        });
        fetchBranchTeam();
      } else {
        showToast(`Failed to register staff: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error adding staff member: ${err.message}`);
    }
  };

  // Handle Edit Employee (Direct PostgreSQL Update)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const res = await fetch(`/api/employees/${editingMember.id || editingMember.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Employee "${editingMember.name}" updated successfully in database!`);
        setEditingMember(null);
        fetchBranchTeam();
      } else {
        showToast(`Update failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error updating employee: ${err.message}`);
    }
  };

  // Handle Toggle Active/Suspended Status
  const handleToggleStatus = async (member) => {
    if (!isBranchManagerOrAdmin) return;
    try {
      if (member.isLocked) {
        return handleUnlockMember(member);
      }
      const nextActive = !member.isActive;
      const res = await fetch(`/api/employees/${member.id || member.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActive, status: nextActive ? 'Active' : 'Suspended' })
      });
      const json = await res.json();
      if (json.success) {
        setTeam(prev => prev.map(m => (m.id === member.id ? { ...m, isActive: nextActive, status: nextActive ? 'Active' : 'Suspended' } : m)));
        showToast(`Staff member "${member.name}" is now ${nextActive ? 'Active' : 'Suspended'}!`);
      }
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`);
    }
  };

  // Handle Instant Unlock Account (Reset failed attempts to 0 & clear 1 hour lock)
  const handleUnlockMember = async (member) => {
    if (!isBranchManagerOrAdmin) return;
    try {
      const res = await fetch(`/api/employees/${member.id || member.userId}/unlock`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Staff member "${member.name}" unlocked! Failed attempts reset to 0.`);
        fetchBranchTeam();
      } else {
        showToast(`Unlock failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error unlocking account: ${err.message}`);
    }
  };

  // Handle Reset Password (Direct PostgreSQL Update & Auto-Unlock)
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordVal || newPasswordVal.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }
    try {
      const res = await fetch(`/api/employees/${resettingMember.id || resettingMember.userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordVal })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Password for "${resettingMember.name}" updated & account unlocked in PostgreSQL!`);
        setResettingMember(null);
        setNewPasswordVal('');
        fetchBranchTeam();
      } else {
        showToast(`Reset failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error resetting password: ${err.message}`);
    }
  };

  // Handle Delete Employee (Direct PostgreSQL Delete)
  const handleDeleteMember = async (member) => {
    try {
      const res = await fetch(`/api/employees/${member.id || member.userId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Staff member "${member.name}" deleted from PostgreSQL database.`);
        setDeletingMember(null);
        fetchBranchTeam();
      } else {
        showToast(`Delete failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`Error deleting staff member: ${err.message}`);
    }
  };

  const filteredTeam = team.filter(m => {
    const matchSearch =
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.designation || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.phone || '').includes(search);

    const matchDept = deptFilter === 'ALL' || m.department === deptFilter;
    return matchSearch && matchDept;
  });

  const totalPayroll = team.reduce((acc, curr) => acc + (parseFloat(curr.salary) || 0), 0);
  const activeCount = team.filter(m => m.isActive && !m.isLocked).length;
  const lockedCount = team.filter(m => m.isLocked || m.status === 'Locked' || (m.failedAttempts >= 3)).length;
  const managerCount = team.filter(m => m.role === 'BRANCH_MANAGER').length;

  return (
    <>
      {toastMessage && (
        <div className="toast-floating-banner animate-fade-in">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem' }}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="page-header-row animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="page-title">{activeBranch.name} Staff Directory & Management</h2>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              🐘 PostgreSQL Live: bizzpilot.users
            </span>
          </div>
          <p className="page-desc">
            Directly manage branch personnel, store staff, billing cashiers, and technicians stationed at {activeBranch.name} ({activeBranch.code}). Changes persist live in PostgreSQL.
          </p>
        </div>

        <div className="header-actions">
          {isBranchManagerOrAdmin && (
            <>
              <button className="secondary-action-btn" onClick={() => setShowSalaries(!showSalaries)}>
                <Eye size={15} />
                <span>{showSalaries ? 'Hide Payroll' : 'Show Payroll'}</span>
              </button>
              <button className="primary-action-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={16} />
                <span>Add Branch Staff</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Branch Staff Metric Cards */}
      <div className="dash-stats-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.25rem' }}>
        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Branch Staff</span>
            <div className="stat-icon-circle" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}><Users size={18} /></div>
          </div>
          <div className="stat-value">{team.length}</div>
          <div className="stat-change positive">Stationed at {activeBranch.code}</div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Active on Duty</span>
            <div className="stat-icon-circle" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-change positive">{Math.round((activeCount / (team.length || 1)) * 100)}% active rate</div>
        </div>

        <div className="dash-stat-card" style={lockedCount > 0 ? { border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.04)' } : undefined}>
          <div className="stat-card-header">
            <span className="stat-label">Locked Accounts (3 Fails)</span>
            <div className="stat-icon-circle" style={{ background: lockedCount > 0 ? 'rgba(239, 68, 68, 0.18)' : 'rgba(148, 163, 184, 0.15)', color: lockedCount > 0 ? '#ef4444' : '#94a3b8' }}>
              <Lock size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: lockedCount > 0 ? '#ef4444' : 'inherit' }}>{lockedCount}</div>
          <div className={`stat-change ${lockedCount > 0 ? 'negative' : 'neutral'}`}>
            {lockedCount > 0 ? `${lockedCount} staff blocked for 1 hr` : '0 security lockouts'}
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Branch Leads / Managers</span>
            <div className="stat-icon-circle" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}><Store size={18} /></div>
          </div>
          <div className="stat-value">{managerCount}</div>
          <div className="stat-change neutral">Authorized supervisors</div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Branch Monthly Payroll</span>
            <div className="stat-icon-circle" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}><DollarSign size={18} /></div>
          </div>
          <div className="stat-value">
            {showSalaries ? `₹${(totalPayroll / 1000).toFixed(1)}k` : '••••••'}
          </div>
          <div className="stat-change neutral">Direct Bank Transfer</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="dash-panel animate-fade-in" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="dash-search-box" style={{ minWidth: '240px' }}>
              <Search size={14} />
              <input
                placeholder="Search staff by name, phone, email, designation..."
                className="dash-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="modal-field-select"
              style={{ width: 'auto', minWidth: '150px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            >
              <option value="ALL">All Departments</option>
              <option value="Sales & Billing">Sales & Billing</option>
              <option value="Warehouse & Stores">Warehouse & Stores</option>
              <option value="Technical Services">Technical Services</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Branch Operations">Branch Operations</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing {filteredTeam.length} of {team.length} staff members
            </span>
            <button className="secondary-action-btn" onClick={fetchBranchTeam} title="Refresh Roster from Database">
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Team Roster Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }} className="animate-fade-in">
        {filteredTeam.length === 0 ? (
          <div className="dash-panel" style={{ gridColumn: '1 / -1', padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No staff records found for {activeBranch.name} matching the filters.
          </div>
        ) : (
          filteredTeam.map((member) => {
            const isManager = member.role === 'BRANCH_MANAGER';
            const isYou = currentUser?.email === member.email;
            const isMemberLocked = Boolean(member.isLocked || member.status === 'Locked' || (member.lockedUntil && new Date(member.lockedUntil) > new Date()));
            const initials = (member.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

            return (
              <div
                key={member.id || member.userId}
                className="dash-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative',
                  border: isMemberLocked
                    ? '1.5px solid #ef4444'
                    : (isYou ? '1px solid var(--brand-accent)' : undefined),
                  boxShadow: isMemberLocked ? '0 0 12px rgba(239, 68, 68, 0.12)' : undefined
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isMemberLocked ? 'rgba(239, 68, 68, 0.18)' : (isManager ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
                      color: isMemberLocked ? '#ef4444' : (isManager ? '#38bdf8' : '#10b981'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      border: `1px solid ${isMemberLocked ? 'rgba(239, 68, 68, 0.4)' : (isManager ? '#38bdf840' : '#10b98140')}`
                    }}>
                      {isMemberLocked ? <Lock size={18} /> : initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{member.name}</span>
                        {isYou && (
                          <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        @{member.username} • ID: {member.userId}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span
                      className="nature-tag"
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: isManager ? '#38bdf820' : '#10b98120',
                        color: isManager ? '#38bdf8' : '#10b981',
                        borderColor: isManager ? '#38bdf840' : '#10b98140'
                      }}
                    >
                      {isManager ? 'Branch Manager' : (member.role === 'CASHIER' ? 'Counter Cashier' : 'Operations Staff')}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(member)}
                      style={{
                        cursor: isBranchManagerOrAdmin ? 'pointer' : 'default',
                        border: isMemberLocked ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        background: isMemberLocked
                          ? 'rgba(239, 68, 68, 0.15)'
                          : member.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isMemberLocked ? '#ef4444' : member.isActive ? '#10b981' : '#f59e0b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title={isBranchManagerOrAdmin ? (isMemberLocked ? "Click to Unlock Account" : "Click to toggle Active/Suspended status in DB") : undefined}
                      disabled={!isBranchManagerOrAdmin}
                    >
                      {isMemberLocked ? <><Lock size={10} /> Locked (3/3)</> : (member.isActive ? 'Active' : 'Suspended')}
                    </button>
                  </div>
                </div>

                {/* Lockout / Failed Attempts Alert Banner */}
                {isMemberLocked ? (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.74rem',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}>
                    <Lock size={14} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Account Blocked:</strong> 3 incorrect password attempts. {member.remainingMinutes > 0 ? `(~${member.remainingMinutes}m left)` : 'Locked for 1 hour'}.
                    </span>
                  </div>
                ) : (member.failedAttempts > 0 && (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.55rem',
                    fontSize: '0.72rem',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <AlertCircle size={13} style={{ flexShrink: 0 }} />
                    <span>{member.failedAttempts}/3 failed password attempt{member.failedAttempts > 1 ? 's' : ''} recorded.</span>
                  </div>
                ))}

                {/* Designation & Department */}
                <div style={{ fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{member.designation}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.department}</div>
                </div>

                {/* Contact & Salary details */}
                <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Phone size={13} color="var(--text-muted)" />
                    <span>{member.phone || '+91 9825X XXXXX'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-accent)' }}>
                    <Mail size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.74rem' }}>{member.email}</span>
                  </div>

                  {isBranchManagerOrAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed var(--border-subtle)', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Salary:</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {showSalaries ? `₹${(parseFloat(member.salary) || 0).toLocaleString('en-IN')}/mo` : '••••••'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Branch Manager & Admin */}
                {isBranchManagerOrAdmin && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: 'auto'
                  }}>
                    {/* Instant Unlock Button if locked or has failed attempts */}
                    {(isMemberLocked || member.failedAttempts > 0) && (
                      <button
                        type="button"
                        className="table-action-btn"
                        style={{
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.12)',
                          borderColor: 'rgba(16, 185, 129, 0.35)',
                          fontWeight: 700,
                          flex: 1,
                          justifyContent: 'center'
                        }}
                        onClick={() => handleUnlockMember(member)}
                        title="Immediately unlock account and reset failed password attempts to 0"
                      >
                        <Unlock size={13} />
                        <span>Unlock</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={() => setEditingMember({ ...member, newPassword: '', unlockAccount: isMemberLocked || member.failedAttempts > 0 })}
                      style={{ flex: 1, justifyContent: 'center' }}
                      title="Edit Staff Information, Role, Status, and Password in Database"
                    >
                      <Sliders size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="table-action-btn"
                      style={{ color: '#38bdf8', flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        setResettingMember(member);
                        setNewPasswordVal('');
                      }}
                      title="Reset Staff Password in Database"
                    >
                      <Key size={13} />
                      <span>Pass</span>
                    </button>

                    {member.role !== 'TENANT_OWNER' && !isYou && (
                      <button
                        type="button"
                        className="table-action-btn"
                        style={{ color: '#ef4444' }}
                        onClick={() => setDeletingMember(member)}
                        title="Delete Staff Member from PostgreSQL Database"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================
          MODAL: ADD NEW BRANCH STAFF (DIRECT TO POSTGRESQL)
          ======================================================================== */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Users size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">Register Branch Staff Member</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Add a new staff member stationed at <strong>{activeBranch.name} ({activeBranch.code})</strong>. The record will be saved directly to the PostgreSQL <code>users</code> table.
            </p>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="modal-form-field">
                  <label className="modal-field-label">Full Name *</label>
                  <input
                    value={addForm.name}
                    onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ramesh Varma"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Username *</label>
                  <input
                    value={addForm.username}
                    onChange={(e) => setAddForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="e.g. ramesh_pos"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Work Email *</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. ramesh@mannengineers.in"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Contact Phone</label>
                  <input
                    value={addForm.phone}
                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98250 12345"
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Initial Password *</label>
                  <input
                    type="text"
                    value={addForm.password}
                    onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="e.g. Pass@123"
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Branch Assignment</label>
                  <input
                    value={`${activeBranch.name} (${activeBranch.code})`}
                    className="modal-field-input"
                    disabled
                    style={{ background: 'var(--bg-tertiary)', opacity: 0.8 }}
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Department *</label>
                  <select
                    value={addForm.department}
                    onChange={(e) => setAddForm(prev => ({ ...prev, department: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="Sales & Billing">Sales & Billing</option>
                    <option value="Warehouse & Stores">Warehouse & Stores</option>
                    <option value="Technical Services">Technical Services</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Branch Operations">Branch Operations</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Designation Title</label>
                  <input
                    value={addForm.designation}
                    onChange={(e) => setAddForm(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="e.g. Senior POS Counter Executive"
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Role Classification</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm(prev => ({ ...prev, role: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="STAFF">Operations Staff</option>
                    <option value="BRANCH_MANAGER">Assistant / Branch Manager</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Monthly Salary (INR)</label>
                  <input
                    type="number"
                    value={addForm.salary}
                    onChange={(e) => setAddForm(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="35000"
                    className="modal-field-input"
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Plus size={16} />
                  <span>Save to PostgreSQL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: EDIT BRANCH STAFF MEMBER
          ======================================================================== */}
      {editingMember && (
        <div className="modal-backdrop-overlay" onClick={() => setEditingMember(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sliders size={20} color="var(--brand-accent)" />
                <h3 className="modal-title-text">Edit Staff Member</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setEditingMember(null)}><X size={18} /></button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="modal-form-field">
                  <label className="modal-field-label">Full Name *</label>
                  <input
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, name: e.target.value }))}
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Username *</label>
                  <input
                    value={editingMember.username || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Work Email *</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, email: e.target.value }))}
                    className="modal-field-input"
                    required
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Contact Phone</label>
                  <input
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">User Role</label>
                  <select
                    value={editingMember.role || 'STAFF'}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, role: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="STAFF">Operations Staff</option>
                    <option value="BRANCH_MANAGER">Branch Manager</option>
                    <option value="CASHIER">Counter POS Cashier</option>
                    <option value="INVENTORY_CLERK">Store & Inventory Clerk</option>
                    <option value="SALES_EXEC">Sales Executive</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Department</label>
                  <select
                    value={editingMember.department || 'Sales & Billing'}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, department: e.target.value }))}
                    className="modal-field-select"
                  >
                    <option value="Sales & Billing">Sales & Billing</option>
                    <option value="Warehouse & Stores">Warehouse & Stores</option>
                    <option value="Technical Services">Technical Services</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Branch Operations">Branch Operations</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Designation</label>
                  <input
                    value={editingMember.designation || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, designation: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Monthly Salary (INR)</label>
                  <input
                    type="number"
                    value={editingMember.salary || 0}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, salary: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Account Status</label>
                  <select
                    value={editingMember.status === 'Locked' ? 'Locked' : (editingMember.isActive ? 'Active' : 'Suspended')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingMember(prev => ({
                        ...prev,
                        status: val,
                        isActive: val === 'Active',
                        unlock: val === 'Active',
                        lock: val === 'Locked'
                      }));
                    }}
                    className="modal-field-select"
                  >
                    <option value="Active">Active (Unlocked)</option>
                    <option value="Suspended">Suspended (Deactivated)</option>
                    <option value="Locked">Locked (Blocked for 1 Hour)</option>
                  </select>
                </div>

                <div className="modal-form-field">
                  <label className="modal-field-label">Branch Assignment</label>
                  <input
                    value={`${editingMember.branchName || activeBranch.name} (${editingMember.branchCode || activeBranch.code})`}
                    className="modal-field-input"
                    disabled
                    style={{ background: 'var(--bg-tertiary)', opacity: 0.8 }}
                  />
                </div>

                {/* Direct Password Update inside Edit Modal */}
                <div className="modal-form-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="modal-field-label">
                    <span>New Password</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>(leave blank to keep current)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter new password (e.g. Pass@123)"
                    value={editingMember.password || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, password: e.target.value }))}
                    className="modal-field-input"
                  />
                </div>

                {/* Unlock / Reset Attempts Checkbox */}
                {(editingMember.isLocked || (editingMember.failedAttempts || 0) > 0 || editingMember.status === 'Locked') && (
                  <div style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(editingMember.unlock)}
                        onChange={(e) => setEditingMember(prev => ({
                          ...prev,
                          unlock: e.target.checked,
                          resetAttempts: e.target.checked,
                          status: e.target.checked ? 'Active' : prev.status,
                          isActive: e.target.checked ? true : prev.isActive
                        }))}
                      />
                      <span>
                        🔓 Unlock account & reset failed login attempts (currently {editingMember.failedAttempts || 3}/3) to 0
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditingMember(null)}>Cancel</button>
                <button type="submit" className="primary-action-btn">
                  <Check size={16} />
                  <span>Update in PostgreSQL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: RESET STAFF PASSWORD
          ======================================================================== */}
      {resettingMember && (
        <div className="modal-backdrop-overlay" onClick={() => setResettingMember(null)}>
          <div className="modal-dialog-box" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Key size={20} color="#38bdf8" />
                <h3 className="modal-title-text">Reset Staff Password</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setResettingMember(null)}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Set a new secure password for <strong>{resettingMember.name}</strong> ({resettingMember.email}). Directly updates their database credentials.
            </p>

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="modal-form-field full-width" style={{ marginBottom: '1rem' }}>
                <label className="modal-field-label">New Password *</label>
                <input
                  type="text"
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Min. 6 characters (e.g. Pass@123)"
                  className="modal-field-input"
                  required
                />
              </div>

              <div className="modal-form-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setResettingMember(null)}>Cancel</button>
                <button type="submit" className="primary-action-btn" style={{ background: '#38bdf8' }}>
                  <Check size={16} />
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: CONFIRM DELETE STAFF MEMBER
          ======================================================================== */}
      {deletingMember && (
        <div className="modal-backdrop-overlay" onClick={() => setDeletingMember(null)}>
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
              Remove Staff Member
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
              Are you sure you want to permanently delete <strong>{deletingMember.name}</strong> ({deletingMember.userId}) from the PostgreSQL users table for {activeBranch.name}?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="secondary-action-btn" onClick={() => setDeletingMember(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMember(deletingMember)}
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
                Delete from DB
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

