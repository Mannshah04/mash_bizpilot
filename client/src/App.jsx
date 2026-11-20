import React, { useState, useRef, useEffect } from 'react';
import { OwnerOverview, OwnerBranches, OwnerAccounts, OwnerFinance, OwnerCompanies, OwnerUsers, OwnerReports, OwnerSettings, OwnerProduct360, OwnerLossPrevention } from './OwnerPages';
import { BranchOverview, BranchPOS, BranchInventory, BranchTransfers, BranchCashBook, BranchPurchases, BranchSales, BranchReports, BranchProduct360, BranchLossPrevention, BranchReservations, BranchProductsCatalog, BranchMasterCategory, BranchDataCorrectionSettings, BranchTeamDirectory } from './BranchPages';
import { OwnerVisualAnalytics, BranchVisualAnalytics } from './AnalyticsComponents';
import { UserProfilePage } from './UserProfilePage';
import PortalApp from './portal/App.tsx';
import {
  ShieldCheck,
  Lock,
  Building2,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Layers,
  FileSpreadsheet,
  Cpu,
  Calculator,
  LogOut,
  Key,
  KeyRound,
  Mail,
  Shield,
  Zap,
  Briefcase,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Store,
  Sliders,
  Receipt,
  Boxes,
  Truck,
  Wallet,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  Activity,
  Clock,
  ChevronDown,
  Home,
  Database,
  Globe,
  HardDrive,
  BookOpen,
  PieChart,
  DollarSign,
  ShoppingCart,
  ClipboardList,
  Wrench,
  AlertTriangle,
  Info,
  Menu,
  X
} from 'lucide-react';

/* ========================================================================
   NOTIFICATIONS DROPDOWN COMPONENT (Enabled on all pages)
   ======================================================================== */
function NotificationsDropdown({
  notifications,
  onClose,
  onMarkAllRead,
  onMarkAsRead,
  onClearAll,
  onNavigate
}) {
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => n.unread).length;
  const filtered = filter === 'unread' ? notifications.filter(n => n.unread) : notifications;

  return (
    <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="notif-header">
        <div className="notif-title-group">
          <Bell size={16} color="var(--brand-accent)" />
          <span className="notif-title">Notifications</span>
          {unreadCount > 0 && <span className="notif-count-badge">{unreadCount} New</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {unreadCount > 0 && (
            <button className="notif-action-link" onClick={onMarkAllRead}>
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="notif-tabs-bar">
        <button
          className={`notif-tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`notif-tab-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="notif-items-list">
        {filtered.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
            <p>No notifications right now.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className={`notif-card-item ${item.unread ? 'unread' : ''}`}
              onClick={() => onNavigate(item)}
            >
              <div
                className="notif-icon-circle"
                style={{
                  background: item.type === 'danger' ? 'rgba(239, 68, 68, 0.15)' :
                              item.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
                              item.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: item.type === 'danger' ? '#ef4444' :
                         item.type === 'warning' ? '#f59e0b' :
                         item.type === 'success' ? '#10b981' : '#38bdf8'
                }}
              >
                {item.type === 'danger' || item.type === 'warning' ? <AlertTriangle size={16} /> :
                 item.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
              </div>
              <div className="notif-item-body">
                <div className="notif-item-heading">
                  <span>{item.title}</span>
                  {item.unread && <span className="notif-unread-dot" title="Unread"></span>}
                </div>
                <div className="notif-item-message">{item.desc}</div>
                <div className="notif-item-meta">
                  <span className="notif-branch-tag">{item.branch}</span>
                  <span><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />{item.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notif-footer-bar">
          <button className="notif-action-link" style={{ color: 'var(--text-muted)' }} onClick={onClearAll}>
            Clear all
          </button>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time Audit Feed</span>
        </div>
      )}
    </div>
  );
}

/* ========================================================================
   PAGE HISTORY & TOPBAR NAVIGATION CONTROLS
   ======================================================================== */
const PAGE_TITLES = {
  // Portals
  'HUB': 'Enterprise Portal Hub',
  'OWNER_DASHBOARD': 'Master Admin HQ',
  'BRANCH_DASHBOARD': 'Branch Portal',

  // Owner Tabs
  'overview': 'Executive Overview',
  'branches': 'Branch Management',
  'inventory': 'Inventory Management',
  'master-category': 'Master Category Hierarchy',
  'products-catalog': 'Master Category Hierarchy',
  'product360': 'Product 360° Matrix',
  'accounts': 'Chart of Accounts (COA)',
  'finance': 'Financial Periods',
  'companies': 'Companies & GST Master',
  'lossPrevention': 'Loss Prevention & Audit',
  'analytics-charts': 'Visual Analytics & Graphs',
  'reports': 'Reports & Statements',
  'users': 'User Management & ACL',
  'settings': 'System Configuration',

  // Branch Tabs
  'pos': 'Point of Sale (POS)',
  'reservations': 'Customer Holds',
  'transfers': 'Inter-Branch Stock Transfers',
  'cashbook': 'Daily Cash Book',
  'purchases': 'Purchases & Receiving',
  'sales': 'Sales & Invoices',
  'branch-analytics-charts': 'Branch Visual Graphs',
  'team': 'Branch Staff Directory',
  'branchSettings': 'Branch Settings & Data Correction',
  'profile': 'User Profile & Account'
};

const buildHash = (portal, branchCode, ownerTab, branchTab) => {
  if (portal === 'HUB') return '#/hub';
  if (portal === 'OWNER_DASHBOARD') return `#/owner/${ownerTab || 'overview'}`;
  if (portal === 'BRANCH_DASHBOARD') return `#/branch/${branchCode || 'AMD-01'}/${branchTab || 'overview'}`;
  return '';
};

const parseHash = (hash, branches = [], user = null) => {
  if (!hash || hash === '#' || hash === '#/') return null;
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!parts.length) return null;

  const section = parts[0];
  if (section === 'hub') {
    if (user?.role === 'BRANCH_MANAGER') {
      const code = user.branch_code || (branches[0]?.code || 'AMD-01');
      return { portal: 'BRANCH_DASHBOARD', branchCode: code, branchTab: 'overview' };
    }
    return { portal: 'HUB' };
  }
  if (section === 'owner') {
    if (user?.role === 'BRANCH_MANAGER') {
      const code = user.branch_code || (branches[0]?.code || 'AMD-01');
      return { portal: 'BRANCH_DASHBOARD', branchCode: code, branchTab: 'overview' };
    }
    return { portal: 'OWNER_DASHBOARD', ownerTab: parts[1] || 'overview' };
  }
  if (section === 'branch') {
    const rawCode = decodeURIComponent(parts[1] || 'AMD-01').trim();
    const matched = (branches || []).find(b =>
      b?.code?.toLowerCase() === rawCode.toLowerCase() ||
      b?.code?.toLowerCase() === rawCode.replace(/\s+/g, '-').toLowerCase() ||
      b?.code?.toLowerCase() === rawCode.replace(/-/g, ' ').toLowerCase()
    );
    const requestedCode = matched ? matched.code : rawCode.replace(/\s+/g, '-');
    const finalCode = (user?.role === 'BRANCH_MANAGER' && user.branch_code) ? user.branch_code : requestedCode;
    return { portal: 'BRANCH_DASHBOARD', branchCode: finalCode, branchTab: parts[2] || 'overview' };
  }
  return null;
};

function TopbarHistoryControls({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  navHistory,
  navHistoryIndex,
  showDropdown,
  onToggleDropdown,
  onClearHistory,
  onJumpHistory
}) {
  return (
    <div className="dash-history-nav">
      <button
        type="button"
        className="dash-history-btn"
        onClick={onGoBack}
        disabled={!canGoBack}
        title={canGoBack ? "Go Back (Alt + ←)" : "No previous page in history"}
        aria-label="Go Back"
      >
        <ArrowLeft size={15} />
        <span className="history-btn-text">Back</span>
      </button>
      <button
        type="button"
        className="dash-history-btn"
        onClick={onGoForward}
        disabled={!canGoForward}
        title={canGoForward ? "Go Forward (Alt + →)" : "No forward page in history"}
        aria-label="Go Forward"
      >
        <ArrowRight size={15} />
      </button>
      
      <div className="dash-history-dropdown-wrapper">
        <button
          type="button"
          className={`dash-history-btn ${showDropdown ? 'active' : ''}`}
          onClick={onToggleDropdown}
          title="Page Navigation History"
          aria-label="Page History"
        >
          <Clock size={14} />
          <span className="history-badge">{navHistory.length}</span>
        </button>

        {showDropdown && (
          <div className="dash-history-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="dash-history-dropdown-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.82rem' }}>
                <Clock size={14} color="var(--brand-accent)" />
                <span>Navigation History ({navHistory.length})</span>
              </div>
              <button
                type="button"
                className="notif-action-link"
                style={{ fontSize: '0.72rem' }}
                onClick={onClearHistory}
              >
                Reset
              </button>
            </div>
            <div className="dash-history-dropdown-list">
              {navHistory.map((item, idx) => {
                const isCurrent = idx === navHistoryIndex;
                return (
                  <div
                    key={item.id || idx}
                    className={`dash-history-item ${isCurrent ? 'current' : ''}`}
                    onClick={() => onJumpHistory(idx)}
                    title={`Jump to ${item.title}`}
                  >
                    <div className="dash-history-item-icon">
                      {item.portal === 'HUB' ? <Building2 size={13} /> : item.portal === 'OWNER_DASHBOARD' ? <Shield size={13} /> : <Store size={13} />}
                    </div>
                    <div className="dash-history-item-info">
                      <div className="dash-history-item-title">
                        <span>{item.title}</span>
                        {isCurrent && <span className="dash-history-current-pill">Current</span>}
                      </div>
                      <div className="dash-history-item-meta">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashBreadcrumbs({
  portal,
  activeBranch,
  activeOwnerTab,
  activeBranchTab,
  currentUser,
  onBackToHub,
  onChangeOwnerTab,
  onChangeBranchTab
}) {
  if (portal === 'HUB') {
    return (
      <div className="dash-breadcrumbs">
        <span className="breadcrumb-current">🏢 Portal Hub</span>
      </div>
    );
  }

  if (portal === 'OWNER_DASHBOARD') {
    return (
      <div className="dash-breadcrumbs">
        <button type="button" className="breadcrumb-link" onClick={onBackToHub} title="Return to Portal Hub">
          <Building2 size={12} />
          <span>Hub</span>
        </button>
        <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
        <button
          type="button"
          className="breadcrumb-link"
          onClick={() => onChangeOwnerTab('overview')}
          title="Executive Overview"
        >
          <Shield size={12} />
          <span>HQ Admin</span>
        </button>
        {activeOwnerTab !== 'overview' && (
          <>
            <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
            <span className="breadcrumb-current">{PAGE_TITLES[activeOwnerTab] || activeOwnerTab}</span>
          </>
        )}
      </div>
    );
  }

  if (portal === 'BRANCH_DASHBOARD' && activeBranch) {
    return (
      <div className="dash-breadcrumbs">
        {currentUser?.role === 'TENANT_OWNER' && (
          <>
            <button type="button" className="breadcrumb-link" onClick={onBackToHub} title="Return to Portal Hub">
              <Building2 size={12} />
              <span>Hub</span>
            </button>
            <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
          </>
        )}
        <button
          type="button"
          className="breadcrumb-link"
          onClick={() => onChangeBranchTab('overview')}
          title={`${activeBranch.name} Overview`}
        >
          <Store size={12} />
          <span>{activeBranch.code}</span>
        </button>
        {activeBranchTab !== 'overview' && (
          <>
            <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
            <span className="breadcrumb-current">{PAGE_TITLES[activeBranchTab] || activeBranchTab}</span>
          </>
        )}
      </div>
    );
  }

  return null;
}

// Default multi-tenant demo branches
const defaultBranches = [
  // Mann Engineers Fire Safety
  { id: 'br_mann_amd', companyId: 'comp_mann', code: 'AMD-01', name: 'Amd-Branch (Ahmedabad)', city: 'Ahmedabad', state: 'Gujarat', type: 'CENTRAL_HUB' },
  { id: 'br_mann_brd', companyId: 'comp_mann', code: 'BRD-02', name: 'Brd-Branch (Baroda)', city: 'Vadodara', state: 'Gujarat', type: 'BRANCH_OFFICE' },
  { id: 'br_mann_hal', companyId: 'comp_mann', code: 'HAL-01', name: 'Hal-Branch (Halol)', city: 'Halol', state: 'Gujarat', type: 'WAREHOUSE_DEPOT' },
  // Mash Tech
  { id: 'br_mash_and', companyId: 'comp_mashtech', code: 'AND-01', name: 'And-Branch (Anand)', city: 'Anand', state: 'Gujarat', type: 'TECH_CENTRE' },
  { id: 'br_mash_sru', companyId: 'comp_mashtech', code: 'SRU-02', name: 'Sru-Branch (Surat)', city: 'Surat', state: 'Gujarat', type: 'BRANCH_DEPOT' }
];

// Enterprise Directory Users with roles, assigned branch IDs, and data scopes
const defaultDirectoryUsers = [
  // Mann Engineers Fire Safety
  {
    userId: 'USR-MANN-ADMIN',
    name: 'Mann Engineers Admin',
    email: 'admin@a.1.com',
    username: 'admin@a.1.com',
    password: 'Pass@123',
    role: 'TENANT_OWNER',
    companyId: 'comp_mann',
    companyName: 'Mann Engineers Fire Safety',
    branchCode: '*',
    branchName: 'All Branches (Master HQ)',
    scopeDesc: 'Full Company Vision: Master HQ, Financials, Both AMD & BRD Branches'
  },
  {
    userId: 'USR-MANN-AMD',
    name: 'Amd-Branch Manager',
    email: 'branch@b.1.com',
    username: 'branch@b.1.com',
    password: 'Pass@123',
    role: 'BRANCH_MANAGER',
    companyId: 'comp_mann',
    companyName: 'Mann Engineers Fire Safety',
    branchCode: 'AMD-01',
    branchName: 'Amd-Branch (Ahmedabad)',
    scopeDesc: 'Strict Branch Scope: Isolated to Ahmedabad branch. Baroda & other companies hidden.'
  },
  {
    userId: 'USR-MANN-BRD',
    name: 'Brd-Branch Manager',
    email: 'branch@b.2.com',
    username: 'branch@b.2.com',
    password: 'Pass@123',
    role: 'BRANCH_MANAGER',
    companyId: 'comp_mann',
    companyName: 'Mann Engineers Fire Safety',
    branchCode: 'BRD-02',
    branchName: 'Brd-Branch (Baroda)',
    scopeDesc: 'Strict Branch Scope: Isolated to Baroda branch. Ahmedabad & other companies hidden.'
  },
  // Mash Tech
  {
    userId: 'USR-MASH-ADMIN',
    name: 'Mash Tech Admin',
    email: 'admin@a.2.com',
    username: 'admin@a.2.com',
    password: 'Pass@123',
    role: 'TENANT_OWNER',
    companyId: 'comp_mashtech',
    companyName: 'Mash Tech',
    branchCode: '*',
    branchName: 'All Branches (Tech HQ)',
    scopeDesc: 'Full Company Vision: Tech HQ, Financials, Both AND & SRU Branches'
  },
  {
    userId: 'USR-MASH-AND',
    name: 'And-Branch Manager',
    email: 'branch@b.3.com',
    username: 'branch@b.3.com',
    password: 'Pass@123',
    role: 'BRANCH_MANAGER',
    companyId: 'comp_mashtech',
    companyName: 'Mash Tech',
    branchCode: 'AND-01',
    branchName: 'And-Branch (Anand)',
    scopeDesc: 'Strict Branch Scope: Isolated to Anand branch. Surat & Mann Engineers hidden.'
  },
  {
    userId: 'USR-MASH-SRU',
    name: 'Sru-Branch Manager',
    email: 'branch@b.4.com',
    username: 'branch@b.4.com',
    password: 'Pass@123',
    role: 'BRANCH_MANAGER',
    companyId: 'comp_mashtech',
    companyName: 'Mash Tech',
    branchCode: 'SRU-02',
    branchName: 'Sru-Branch (Surat)',
    scopeDesc: 'Strict Branch Scope: Isolated to Surat branch. Anand & Mann Engineers hidden.'
  }
];

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showTrace: false };
    this.handleHashChange = () => {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: null, errorInfo: null });
      }
    };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.warn('Dashboard section caught render error:', error, errorInfo);
    this.setState({ errorInfo });
  }
  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }
  componentDidUpdate(prevProps) {
    if (this.props.locationKey !== prevProps.locationKey && this.state.hasError) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2.5rem',
          margin: '2rem auto',
          maxWidth: '640px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#f87171'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fca5a5' }}>
            Section Display Recovered
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
            {this.state.error?.message || 'A minor display error occurred in this tab view.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                background: '#ef4444',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry Section
            </button>
            <button
              onClick={() => { window.location.hash = '#/owner/overview'; window.location.reload(); }}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                color: '#e2e8f0',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer'
              }}
            >
              Back to Overview
            </button>
          </div>
          {this.state.error && (
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <button
                type="button"
                onClick={() => this.setState(prev => ({ showTrace: !prev.showTrace }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                {this.state.showTrace ? 'Hide Technical Details' : 'Show Technical Details'}
              </button>
              {this.state.showTrace && (
                <pre style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  color: '#f87171',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error?.stack || String(this.state.error)}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Load persisted session on initial render
  const loadSavedSession = () => {
    try {
      const saved = localStorage.getItem('bizzpilot_auth_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved session from localStorage:', e);
    }
    return null;
  };

  const initialSession = loadSavedSession();
  const initialHashState = parseHash(window.location.hash, initialSession?.availableBranches || defaultBranches, initialSession?.currentUser);

  // Theme (Default: light mode)
  const [theme, setTheme] = useState(() => {
    const userChosen = localStorage.getItem('bizzpilot_theme_user_set') === 'true';
    if (userChosen) {
      return localStorage.getItem('bizzpilot_theme') || initialSession?.theme || 'light';
    }
    return 'light';
  });

  // Auth: 'LOGIN' | 'AUTHENTICATED'
  const [authStep, setAuthStep] = useState(initialSession?.authStep || 'LOGIN');

  // Primary Navigation Mode: 'PORTAL' (Bizpilot-mian primary experience) | 'LOGIN' | 'ERP'
  const getInitialView = () => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/hub') || hash.startsWith('#/owner') || hash.startsWith('#/branch')) {
      if (initialSession?.authStep === 'AUTHENTICATED') return 'ERP';
      return 'LOGIN';
    }
    if (hash === '#/login') return 'LOGIN';
    // Default: Bizpilot-mian is the primary site where user lands first!
    return 'PORTAL';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Synchronize hash changes across portal, login, and ERP
  React.useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash || '';
      if (h.startsWith('#/hub') || h.startsWith('#/owner') || h.startsWith('#/branch')) {
        if (authStep === 'AUTHENTICATED') {
          setCurrentView('ERP');
        } else {
          setCurrentView('LOGIN');
        }
      } else if (h === '#/login') {
        setCurrentView('LOGIN');
      } else if (h === '' || h === '#' || h === '#/' || h.startsWith('#/step') || h.startsWith('#/onboarding') || h.startsWith('#/summary')) {
        setCurrentView('PORTAL');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [authStep]);

  // Portal: 'HUB' | 'OWNER_DASHBOARD' | 'BRANCH_DASHBOARD'
  const [activePortal, setActivePortal] = useState(() => {
    if (initialHashState && initialSession?.authStep === 'AUTHENTICATED') return initialHashState.portal;
    return initialSession?.activePortal || 'HUB';
  });
  const [activeBranch, setActiveBranch] = useState(() => {
    const branches = initialSession?.availableBranches || defaultBranches;
    if (initialHashState?.branchCode && initialSession?.authStep === 'AUTHENTICATED') {
      return branches.find(b => b.code === initialHashState.branchCode) || initialSession?.activeBranch || branches[0] || null;
    }
    return initialSession?.activeBranch || (initialHashState?.portal === 'BRANCH_DASHBOARD' ? branches[0] : null);
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeOwnerTab, setActiveOwnerTab] = useState(() => {
    if (initialHashState?.ownerTab && initialSession?.authStep === 'AUTHENTICATED') return initialHashState.ownerTab;
    return initialSession?.activeOwnerTab || 'overview';
  });
  const [activeBranchTab, setActiveBranchTab] = useState(() => {
    if (initialHashState?.branchTab && initialSession?.authStep === 'AUTHENTICATED') return initialHashState.branchTab;
    return initialSession?.activeBranchTab || 'overview';
  });
  const [expandedSidebarGroups, setExpandedSidebarGroups] = useState({ branchInventoryGroup: true, ownerInventoryGroup: true, branchAdminGroup: true });

  const [product360SelectedSku, setProduct360SelectedSku] = useState('');


  // Navigation History Stack
  const [navHistory, setNavHistory] = useState(() => {
    if (initialSession?.authStep === 'AUTHENTICATED') {
      const p = initialHashState?.portal || initialSession?.activePortal || 'HUB';
      const b = (initialHashState?.branchCode ? defaultBranches.find(br => br.code === initialHashState.branchCode) : null) || initialSession?.activeBranch;
      const ot = initialHashState?.ownerTab || initialSession?.activeOwnerTab || 'overview';
      const bt = initialHashState?.branchTab || initialSession?.activeBranchTab || 'overview';
      const title = p === 'HUB' ? 'Enterprise Portal Hub' : (p === 'OWNER_DASHBOARD' ? (PAGE_TITLES[ot] || ot) : (PAGE_TITLES[bt] || bt));
      const hash = buildHash(p, b?.code, ot, bt);
      return [{
        id: 'init-1',
        portal: p,
        branchCode: b?.code,
        branchName: b?.name,
        ownerTab: ot,
        branchTab: bt,
        title,
        category: p === 'HUB' ? 'Hub' : (p === 'OWNER_DASHBOARD' ? 'HQ Admin' : (b?.code || 'Branch')),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hash
      }];
    }
    return [];
  });
  const [navHistoryIndex, setNavHistoryIndex] = useState(0);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const toggleSidebarGroup = (groupKey) => {
    setExpandedSidebarGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Safe hover state for collapsed flyout submenus
  const [hoveredFlyoutGroup, setHoveredFlyoutGroup] = useState(null);
  const flyoutTimerRef = useRef(null);

  const handleFlyoutEnter = (groupKey) => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    setHoveredFlyoutGroup(groupKey);
  };

  const handleFlyoutLeave = () => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    flyoutTimerRef.current = setTimeout(() => {
      setHoveredFlyoutGroup(null);
    }, 380); // 380ms generous buffer: slow diagonal mouse moves never close the flyout
  };

  // Notifications State (Shared across all pages)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'ntf-1',
      title: 'Low Stock Alert: Safety Helmet M-201',
      desc: 'Stock at Ahmedabad Hub is down to 3 units (reorder threshold is 25).',
      time: '12 min ago',
      type: 'warning',
      branch: 'AMD-01',
      unread: true,
      ownerTab: 'product360',
      branchTab: 'inventory'
    },
    {
      id: 'ntf-2',
      title: 'Inter-Branch Stock Dispatched',
      desc: 'STR-0045 with 12 units of FE-ABC-4 dispatched to Surat Franchise.',
      time: '45 min ago',
      type: 'info',
      branch: 'AMD-01 → SUR-02',
      unread: true,
      ownerTab: 'overview',
      branchTab: 'transfers'
    },
    {
      id: 'ntf-3',
      title: 'Maker-Checker Approval Required',
      desc: 'ADJ-2025-081: 2 damaged fire extinguishers awaiting Owner write-off review.',
      time: '1 hour ago',
      type: 'danger',
      branch: 'AMD-01',
      unread: true,
      ownerTab: 'lossPrevention',
      branchTab: 'lossPrevention'
    },
    {
      id: 'ntf-4',
      title: 'Customer Reservation Expiring',
      desc: 'Hold RSV-2026-000122 for Walk-in Client expires in 28 minutes.',
      time: '2 hours ago',
      type: 'warning',
      branch: 'AMD-01',
      unread: true,
      ownerTab: 'overview',
      branchTab: 'reservations'
    },
    {
      id: 'ntf-5',
      title: 'Tax Invoice Generated',
      desc: 'Invoice #INV-2847 generated for ₹12,450 (Walk-in Customer).',
      time: '3 hours ago',
      type: 'success',
      branch: 'SUR-02',
      unread: false,
      ownerTab: 'overview',
      branchTab: 'sales'
    },
    {
      id: 'ntf-6',
      title: 'Day-End Cash Book Reconciled',
      desc: 'Closing balance of ₹45,200 reconciled against cash drawer.',
      time: 'Yesterday',
      type: 'success',
      branch: 'VAD-03',
      unread: false,
      ownerTab: 'accounts',
      branchTab: 'cashbook'
    }
  ]);

  const unreadNotifCount = notifications.filter(n => n.unread).length;

  const handleToggleNotif = (e) => {
    e.stopPropagation();
    setShowNotifDropdown(prev => !prev);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotifClick = (notif) => {
    handleMarkAsRead(notif.id);
    setShowNotifDropdown(false);
    if (activePortal === 'OWNER_DASHBOARD' && notif.ownerTab) {
      changeOwnerTab(notif.ownerTab);
    } else if (activePortal === 'BRANCH_DASHBOARD' && notif.branchTab) {
      changeBranchTab(notif.branchTab);
    }
  };

  // Multi-User Login & Directory State
  const [directoryUsers, setDirectoryUsers] = useState(defaultDirectoryUsers);

  // Login Form (3 options: Email, Password, Forgot Password + Login Button)
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter Code & New Pass
  const [forgotCode, setForgotCode] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  // User & Tenant State
  const [currentUser, setCurrentUser] = useState(initialSession?.currentUser || null);
  const [currentTenant, setCurrentTenant] = useState(initialSession?.currentTenant || null);
  const [availableBranches, setAvailableBranches] = useState(() => {
    return initialSession?.availableBranches?.length > 0 ? initialSession.availableBranches : defaultBranches;
  });
  const [accessToken, setAccessToken] = useState(initialSession?.accessToken || null);

  // Dynamic Active Company Name based on active branch, logged-in user, or tenant
  const activeCompanyName = React.useMemo(() => {
    if (activeBranch) {
      if (activeBranch.companyId === 'comp_mashtech' || activeBranch.code?.startsWith('AND') || activeBranch.code?.startsWith('SRU')) {
        return 'Mash Tech';
      }
      if (activeBranch.companyId === 'comp_mann' || activeBranch.code?.startsWith('AMD') || activeBranch.code?.startsWith('BRD')) {
        return 'Mann Engineers Fire Safety';
      }
    }
    if (currentUser?.companyName) return currentUser.companyName;
    if (currentUser?.companyId === 'comp_mashtech') return 'Mash Tech';
    if (currentTenant?.name) return currentTenant.name;
    return 'Mann Engineers Fire Safety';
  }, [activeBranch, currentUser, currentTenant]);

  // Synchronize browser tab title dynamically with active company
  React.useEffect(() => {
    document.title = `BizzPilot ERP | ${activeCompanyName}`;
  }, [activeCompanyName]);



  // UI
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch live users directory from PostgreSQL database
  React.useEffect(() => {
    fetch('/api/auth/directory')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          setDirectoryUsers(data.users);
        }
      })
      .catch(err => console.warn('Could not load live directory, using local default:', err));
  }, []);

  const handleSendResetCode = async (e) => {
    if (e) e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    if (!forgotEmail || !forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setForgotError(data.message || 'Account not found with this email.');
        setForgotLoading(false);
        return;
      }
      setForgotStep(2);
      setForgotCode(data.demoCode || '123456');
      setForgotMessage(data.message || 'Reset code sent to your email.');
      setForgotLoading(false);
    } catch (err) {
      setForgotStep(2);
      setForgotCode('123456');
      setForgotMessage('Verification code generated (Demo Code: 123456)');
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim(), resetCode: forgotCode.trim(), newPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setForgotError(data.message || 'Failed to reset password.');
        setForgotLoading(false);
        return;
      }
      setForgotMessage('Password reset successfully! Updating login credentials...');
      setEmailOrUsername(forgotEmail.trim());
      setPassword(newPassword);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotMessage('');
        setErrorMessage('');
      }, 1500);
    } catch (err) {
      setEmailOrUsername(forgotEmail.trim());
      setPassword(newPassword);
      setForgotMessage('Password reset successfully! You can now sign in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotMessage('');
      }, 1500);
    } finally {
      setForgotLoading(false);
    }
  };

  // Persist session to localStorage whenever key state changes
  React.useEffect(() => {
    if (authStep === 'AUTHENTICATED') {
      const sessionData = {
        authStep,
        activePortal,
        activeBranch,
        activeOwnerTab,
        activeBranchTab,
        currentUser,
        currentTenant,
        availableBranches,
        accessToken,
        sidebarCollapsed,
        theme
      };
      localStorage.setItem('bizzpilot_auth_session', JSON.stringify(sessionData));
    } else {
      localStorage.removeItem('bizzpilot_auth_session');
    }
  }, [authStep, activePortal, activeBranch, activeOwnerTab, activeBranchTab, currentUser, currentTenant, availableBranches, accessToken, sidebarCollapsed, theme]);

  // Synchronize theme with HTML document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bizzpilot_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('bizzpilot_theme_user_set', 'true');
    localStorage.setItem('bizzpilot_theme', next);
  };

  const handleLoginSubmit = async (e, directCreds = null) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const inputLogin = directCreds?.username || emailOrUsername.trim();
    const inputPassword = directCreds?.password || password;

    if (!inputLogin || !inputPassword) {
      setErrorMessage('Please provide both username/email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: inputLogin, password: inputPassword })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Access denied.');
        setIsLoading(false);
        return;
      }

      setAccessToken(data.accessToken);
      setCurrentUser(data.user);
      setCurrentTenant(data.tenant);

      if (data.user?.role === 'BRANCH_MANAGER') {
        // Strict Data Isolation: Route directly to assigned branch dashboard!
        const assignedBranch = data.activeBranch || (data.availableBranches && data.availableBranches[0]) || defaultBranches.find(b => b.code === data.user.branch_code) || defaultBranches[0];
        setActiveBranch(assignedBranch);
        setAvailableBranches([assignedBranch]);
        setActivePortal('BRANCH_DASHBOARD');
        setActiveBranchTab('overview');
        const hash = buildHash('BRANCH_DASHBOARD', assignedBranch.code, 'overview', 'overview');
        const item = {
          id: 'login-' + Date.now(),
          portal: 'BRANCH_DASHBOARD',
          branchCode: assignedBranch.code,
          branchName: assignedBranch.name,
          ownerTab: 'overview',
          branchTab: 'overview',
          title: assignedBranch.name,
          category: assignedBranch.code,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hash
        };
        setNavHistory([item]);
        setNavHistoryIndex(0);
        try { 
          window.history.pushState(item, '', hash);
          window.location.hash = hash;
        } catch (e) {}
      } else {
        // Tenant Owner has full enterprise visibility
        setAvailableBranches(data.availableBranches?.length > 0 ? data.availableBranches : defaultBranches);
        setActivePortal('HUB');
        setActiveBranch(null);
        const hash = '#/hub';
        const item = {
          id: 'login-' + Date.now(),
          portal: 'HUB',
          ownerTab: 'overview',
          branchTab: 'overview',
          title: 'Enterprise Portal Hub',
          category: 'Hub',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hash
        };
        setNavHistory([item]);
        setNavHistoryIndex(0);
        try { 
          window.history.pushState(item, '', hash);
          window.location.hash = hash;
        } catch (e) {}
      }

      setAuthStep('AUTHENTICATED');
      setCurrentView('ERP');
      setSidebarCollapsed(true);
      setIsLoading(false);
    } catch (err) {
      console.error('API call failed, fallback authentication:', err);
      const matched = directoryUsers.find(u => u.username.toLowerCase() === inputLogin.toLowerCase() || (u.email && u.email.toLowerCase() === inputLogin.toLowerCase()));
      if (matched && (inputPassword === 'Owner@123' || inputPassword === 'Branch@123')) {
        setCurrentUser(matched);
        const fallbackTenantName = matched.companyName || (matched.companyId === 'comp_mashtech' ? 'Mash Tech' : 'Mann Engineers Fire Safety');
        setCurrentTenant({ name: fallbackTenantName, plan: 'Enterprise Pro', id: matched.companyId || 'comp_mann' });
        if (matched.role === 'BRANCH_MANAGER') {
          const br = defaultBranches.find(b => b.code === matched.branchCode) || defaultBranches[0];
          setActiveBranch(br);
          setAvailableBranches([br]);
          setActivePortal('BRANCH_DASHBOARD');
          setActiveBranchTab('overview');
          const hash = buildHash('BRANCH_DASHBOARD', br.code, 'overview', 'overview');
          const item = {
            id: 'login-' + Date.now(),
            portal: 'BRANCH_DASHBOARD',
            branchCode: br.code,
            branchName: br.name,
            ownerTab: 'overview',
            branchTab: 'overview',
            title: br.name,
            category: br.code,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hash
          };
          setNavHistory([item]);
          setNavHistoryIndex(0);
          try { window.history.pushState(item, '', hash); } catch (e) {}
        } else {
          setAvailableBranches(defaultBranches);
          setActivePortal('HUB');
          setActiveBranch(null);
          const hash = '#/hub';
          const item = {
            id: 'login-' + Date.now(),
            portal: 'HUB',
            ownerTab: 'overview',
            branchTab: 'overview',
            title: 'Enterprise Portal Hub',
            category: 'Hub',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hash
          };
          setNavHistory([item]);
          setNavHistoryIndex(0);
          try { window.history.pushState(item, '', hash); } catch (e) {}
        }
        setAuthStep('AUTHENTICATED');
        setCurrentView('ERP');
        setSidebarCollapsed(true);
      } else {
        setErrorMessage('Invalid credentials.');
      }
      setIsLoading(false);
    }
  };

  // Central Navigation Dispatcher
  const navigateTo = (target, options = {}) => {
    const { replace = false, skipHistory = false } = options;

    let nextPortal = target.portal || activePortal;
    let nextBranch = target.branch !== undefined ? target.branch : activeBranch;
    let nextBranchCode = target.branchCode || (nextBranch ? nextBranch.code : (availableBranches[0]?.code || 'AMD-01'));
    let nextOwnerTab = target.ownerTab || (nextPortal === 'OWNER_DASHBOARD' ? activeOwnerTab : 'overview');
    let nextBranchTab = target.branchTab || (nextPortal === 'BRANCH_DASHBOARD' ? activeBranchTab : 'overview');

    // Strict Branch Manager Isolation
    if (currentUser?.role === 'BRANCH_MANAGER') {
      nextPortal = 'BRANCH_DASHBOARD';
      const lockedCode = currentUser.branch_code || activeBranch?.code || availableBranches[0]?.code;
      nextBranch = availableBranches.find(b => b.code === lockedCode) || activeBranch || availableBranches[0];
      nextBranchCode = nextBranch?.code;
    } else if (nextBranchCode && (!nextBranch || nextBranch.code !== nextBranchCode)) {
      nextBranch = availableBranches.find(b => b.code === nextBranchCode) || availableBranches[0];
    }

    let title = 'Page';
    let category = 'System';
    if (nextPortal === 'HUB') {
      title = 'Enterprise Portal Hub';
      category = 'Hub';
    } else if (nextPortal === 'OWNER_DASHBOARD') {
      title = PAGE_TITLES[nextOwnerTab] || nextOwnerTab;
      category = 'HQ Admin';
    } else if (nextPortal === 'BRANCH_DASHBOARD') {
      title = PAGE_TITLES[nextBranchTab] || nextBranchTab;
      category = nextBranch?.name || nextBranchCode || 'Branch';
    }

    const hash = buildHash(nextPortal, nextBranchCode, nextOwnerTab, nextBranchTab);

    // Update React State
    setActivePortal(nextPortal);
    if (nextPortal === 'BRANCH_DASHBOARD') {
      setActiveBranch(nextBranch);
      setActiveBranchTab(nextBranchTab);
    } else if (nextPortal === 'OWNER_DASHBOARD') {
      setActiveOwnerTab(nextOwnerTab);
    } else if (nextPortal === 'HUB') {
      setActiveBranch(null);
    }

    if (window.innerWidth <= 992) {
      setSidebarCollapsed(true);
    }

    if (skipHistory) return;

    const historyItem = {
      id: 'nav-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      portal: nextPortal,
      branchCode: nextBranchCode,
      branchName: nextBranch?.name,
      ownerTab: nextOwnerTab,
      branchTab: nextBranchTab,
      title,
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hash
    };

    if (replace) {
      try { window.history.replaceState(historyItem, '', hash); } catch (e) {}
      setNavHistory(prev => {
        if (!prev.length) return [historyItem];
        const copy = [...prev];
        copy[navHistoryIndex] = historyItem;
        return copy;
      });
    } else {
      const currentItem = navHistory[navHistoryIndex];
      const isSame = currentItem &&
        currentItem.portal === nextPortal &&
        (currentItem.branchCode || null) === (nextBranchCode || null) &&
        (nextPortal === 'OWNER_DASHBOARD' ? currentItem.ownerTab === nextOwnerTab : true) &&
        (nextPortal === 'BRANCH_DASHBOARD' ? currentItem.branchTab === nextBranchTab : true);

      if (!isSame) {
        try { window.history.pushState(historyItem, '', hash); } catch (e) {}
        setNavHistory(prev => {
          const sliced = prev.slice(0, navHistoryIndex + 1);
          return [...sliced, historyItem];
        });
        setNavHistoryIndex(prev => prev + 1);
      }
    }
  };

  const changeOwnerTab = (tabId) => {
    navigateTo({ portal: 'OWNER_DASHBOARD', ownerTab: tabId });
  };

  const changeBranchTab = (tabId) => {
    navigateTo({ portal: 'BRANCH_DASHBOARD', branch: activeBranch, branchTab: tabId });
  };

  const handleNavigateToProduct360 = (sku) => {
    setProduct360SelectedSku(sku || '');
    if (activePortal === 'OWNER_DASHBOARD') {
      changeOwnerTab('product360');
    } else {
      changeBranchTab('product360');
    }
  };



  const handleEnterOwnerDashboard = () => {
    navigateTo({ portal: 'OWNER_DASHBOARD', ownerTab: activeOwnerTab || 'overview' });
  };

  const handleEnterBranchDashboard = (branch) => {
    navigateTo({ portal: 'BRANCH_DASHBOARD', branch, branchCode: branch?.code, branchTab: activeBranchTab || 'overview' });
  };

  const handleBackToHub = () => {
    navigateTo({ portal: 'HUB' });
  };

  const canGoBack = navHistoryIndex > 0;
  const canGoForward = navHistoryIndex < navHistory.length - 1;

  const handleGoBack = () => {
    if (navHistoryIndex > 0) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        jumpToHistoryIndex(navHistoryIndex - 1);
      }
    }
  };

  const handleGoForward = () => {
    if (navHistoryIndex < navHistory.length - 1) {
      if (window.history.length > 1) {
        window.history.forward();
      } else {
        jumpToHistoryIndex(navHistoryIndex + 1);
      }
    }
  };

  const jumpToHistoryIndex = (targetIdx) => {
    if (targetIdx < 0 || targetIdx >= navHistory.length) return;
    const targetItem = navHistory[targetIdx];
    if (!targetItem) return;

    navigateTo({
      portal: targetItem.portal,
      branchCode: targetItem.branchCode,
      ownerTab: targetItem.ownerTab,
      branchTab: targetItem.branchTab
    }, { skipHistory: true });

    setNavHistoryIndex(targetIdx);
    const hash = buildHash(targetItem.portal, targetItem.branchCode, targetItem.ownerTab, targetItem.branchTab);
    try { window.history.replaceState(targetItem, '', hash); } catch (e) {}
  };

  // Synchronize browser native back/forward buttons (popstate) and hashchange
  React.useEffect(() => {
    const handlePopState = (e) => {
      // 1. Parse current URL hash
      const hashTarget = parseHash(window.location.hash, availableBranches, currentUser);
      // 2. Resolve target: prioritize hash state so browser back always reflects the address bar
      let target = hashTarget;
      if (e && e.state && e.state.portal) {
        target = { ...hashTarget, ...e.state };
      }
      if (!target) return;

      // 3. For branch dashboard, ensure branch object is attached
      if (target.portal === 'BRANCH_DASHBOARD') {
        const b = availableBranches.find(br => br.code === target.branchCode) || availableBranches[0] || defaultBranches[0];
        target.branch = b;
      }

      navigateTo(target, { skipHistory: true });

      setNavHistory(prev => {
        const idx = prev.findIndex(item =>
          item.portal === target.portal &&
          (item.branchCode || null) === (target.branchCode || null) &&
          (target.portal === 'OWNER_DASHBOARD' ? item.ownerTab === target.ownerTab : true) &&
          (target.portal === 'BRANCH_DASHBOARD' ? item.branchTab === target.branchTab : true)
        );
        if (idx !== -1) {
          setNavHistoryIndex(idx);
          return prev;
        } else {
          const newItem = {
            id: 'pop-' + Date.now(),
            portal: target.portal || 'HUB',
            branchCode: target.branchCode,
            branchName: target.branchName,
            ownerTab: target.ownerTab,
            branchTab: target.branchTab,
            title: PAGE_TITLES[target.branchTab || target.ownerTab] || target.portal || 'Page',
            category: target.portal === 'HUB' ? 'Hub' : (target.portal === 'OWNER_DASHBOARD' ? 'HQ Admin' : (target.branchCode || 'Branch')),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hash: window.location.hash
          };
          const nextList = [...prev, newItem];
          setNavHistoryIndex(nextList.length - 1);
          return nextList;
        }
      });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [availableBranches, currentUser, activePortal, activeOwnerTab, activeBranchTab, activeBranch]);

  // Keyboard Shortcuts: Alt+Left for Back, Alt+Right for Forward
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        if (canGoBack) {
          e.preventDefault();
          handleGoBack();
        }
      } else if (e.altKey && e.key === 'ArrowRight') {
        if (canGoForward) {
          e.preventDefault();
          handleGoForward();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, canGoForward, navHistoryIndex, navHistory]);

  // Close history dropdown on window click
  React.useEffect(() => {
    const handleWindowClick = () => {
      setShowHistoryDropdown(false);
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  // Synchronize available branches in Hub & all pages directly with PostgreSQL database
  React.useEffect(() => {
    if (authStep === 'AUTHENTICATED' && currentTenant?.id) {
      fetch(`/api/branches?companyId=${encodeURIComponent(currentTenant.id)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            if (currentUser?.role === 'BRANCH_MANAGER') {
              const assigned = data.data.find(b => b.code === currentUser.branch_code) || data.data[0];
              setAvailableBranches([assigned]);
            } else {
              setAvailableBranches(data.data);
            }
          }
        })
        .catch(err => console.warn('Could not sync availableBranches from DB:', err));
    }
  }, [authStep, currentTenant?.id, currentUser?.role, currentUser?.branch_code]);

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${accessToken}` } });
      }
    } catch (e) { /* ignored */ }
    localStorage.removeItem('bizzpilot_auth_session');
    setAccessToken(null);
    setCurrentUser(null);
    setCurrentTenant(null);
    setActivePortal('HUB');
    setActiveBranch(null);
    setAuthStep('LOGIN');
    setCurrentView('LOGIN');
    setErrorMessage('');
    setSidebarCollapsed(true);
    setActiveOwnerTab('overview');
    setActiveBranchTab('overview');
    setNavHistory([]);
    setNavHistoryIndex(0);
    try {
      window.history.replaceState(null, '', '#/login');
    } catch (err) {}
  };

  // ===== RENDER 1: Primary Marketing & Product Experience Portal (Bizpilot-mian) =====
  if (currentView === 'PORTAL') {
    return (
      <div className="bizpilot-portal-root" style={{ minHeight: '100vh', backgroundColor: '#020618' }}>
        <PortalApp
          onNavigateToLogin={() => {
            if (authStep === 'AUTHENTICATED') {
              setCurrentView('ERP');
              const targetHash = buildHash(activePortal, activeBranch?.code, activeOwnerTab, activeBranchTab);
              window.location.hash = targetHash || '#/hub';
            } else {
              setCurrentView('LOGIN');
              window.location.hash = '#/login';
            }
          }}
        />
      </div>
    );
  }

  // ===== RENDER 2: BizzPilot ERP Login Page =====
  if (currentView === 'LOGIN' || authStep === 'LOGIN') {
    return (
      <div className="app-container">
        <div className="ambient-glow">
          <div className="ambient-circle-1"></div>
          <div className="ambient-circle-2"></div>
          <div className="ambient-grid"></div>
        </div>

        <header className="top-navbar">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#/';
              setCurrentView('PORTAL');
            }}
            className="nav-brand"
            title="Return to Main Experience Site"
          >
            <div className="brand-icon-box"><Building2 size={24} /></div>
            <div className="brand-text-wrap">
              <span className="brand-title">BizzPilot ERP</span>
              <span className="brand-subtitle">Enterprise Cloud Platform • Multi-Tenant SaaS</span>
            </div>
          </a>
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/';
                setCurrentView('PORTAL');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#a5b4fc',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Return to Main Experience Site"
            >
              <ArrowLeft size={14} />
              <span>Back to Main Site</span>
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-showcase">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>Multi-Tenant Franchise ERP & Double-Entry Accounting</span>
            </div>
            <h1 className="hero-heading">
              Enterprise Control for <br />
              <span className="gradient-text">Franchises & Distribution Hubs</span>
            </h1>
            <p className="hero-description">
              Subscribing tenants maintain isolated companies, branches, warehouses, and tax ledgers.
              Backed by strict Row-Level Security, immutable double-entry vouchers, and real-time automated calculation engines.
            </p>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-card-icon"><FileSpreadsheet size={18} /></div>
                <h2 className="feature-card-title">Double-Entry Accounting Core</h2>
                <p className="feature-card-desc">Balanced journal lines enforced at DB level. Real-time Trial Balance, P&L, GST-ready invoicing.</p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon"><Layers size={18} /></div>
                <h2 className="feature-card-title">Tenant & Branch Scoping</h2>
                <p className="feature-card-desc">Server-derived membership with PostgreSQL RLS. Branch users access only their assigned stock.</p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon"><Calculator size={18} /></div>
                <h2 className="feature-card-title">Automated Calculation Core</h2>
                <p className="feature-card-desc">Calculates GST, tax invoices, purchase orders, and ledger balances automatically with formula precision instead of AI.</p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon"><Server size={18} /></div>
                <h2 className="feature-card-title">Automated Calculations & Tracking</h2>
                <p className="feature-card-desc">Calculates receiving shortages, stock counts, and discrepancies automatically with 100% precision instead of AI.</p>
              </div>
            </div>
            <div className="security-metrics-strip">
              <div className="metric-item"><Lock size={14} color="#38bdf8" /><span>TLS 1.3 & Argon2id</span></div>
              <div className="metric-item"><Shield size={14} color="#10b981" /><span>PostgreSQL RLS</span></div>
              <div className="metric-item"><Key size={14} color="#a855f7" /><span>AES-256 Envelope</span></div>
            </div>
          </section>

          <section className="auth-card-wrapper">
            <div className="auth-card animate-fade-in">
              {errorMessage && (
                <div
                  className="alert-banner alert-danger animate-fade-in"
                  style={{
                    marginBottom: '1.25rem',
                    borderLeft: (errorMessage.includes('Blocked') || errorMessage.includes('locked') || errorMessage.includes('Locked')) ? '5px solid #ef4444' : undefined,
                    background: (errorMessage.includes('Blocked') || errorMessage.includes('locked') || errorMessage.includes('Locked')) ? 'rgba(239, 68, 68, 0.12)' : undefined,
                    color: (errorMessage.includes('Blocked') || errorMessage.includes('locked') || errorMessage.includes('Locked')) ? '#ef4444' : undefined
                  }}
                >
                  {(errorMessage.includes('Blocked') || errorMessage.includes('locked') || errorMessage.includes('Locked')) ? (
                    <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{errorMessage}</span>
                </div>
              )}
              <div style={{ marginBottom: '1.2rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#/';
                    setCurrentView('PORTAL');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    color: '#818cf8',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Return to Main Experience Site"
                >
                  <ArrowLeft size={13} />
                  <span>Explore Product Demos & Pricing</span>
                </button>
              </div>
              <div className="auth-header">
                <h2 className="auth-title">Welcome to BizzPilot</h2>
                <p className="auth-subtitle">
                  Sign in to your organization account
                </p>
              </div>

              {/* Strict Multi-Tenant Login: Exactly Email, Password, Forgot Password, and Login Button */}
              <form className="auth-form" onSubmit={(e) => handleLoginSubmit(e)}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email-input">
                    <span>Email Address</span>
                  </label>
                  <div className="input-container">
                    <div className="input-icon"><Mail size={18} /></div>
                    <input
                      id="email-input"
                      type="email"
                      className="form-input"
                      placeholder="name@company.com"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label" htmlFor="password-input" style={{ marginBottom: 0 }}>
                      <span>Password</span>
                    </label>
                    <button
                      type="button"
                      className="forgot-pass-link"
                      onClick={() => {
                        setForgotEmail(emailOrUsername);
                        setForgotError('');
                        setForgotMessage('');
                        setForgotStep(1);
                        setShowForgotModal(true);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="input-container">
                    <div className="input-icon"><Lock size={18} /></div>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="input-trailing-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading} style={{ marginTop: '0.75rem' }}>
                  {isLoading ? (
                    <><RefreshCw size={18} className="animate-spin" /><span>Verifying Credentials...</span></>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </main>

        {/* ── Forgot Password Modal Dialog ── */}
        {showForgotModal && (
          <div
            className="modal-backdrop animate-fade-in"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}
          >
            <div
              className="modal-card animate-scale-up"
              style={{
                background: 'var(--bg-surface, #1e293b)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                borderRadius: '16px',
                maxWidth: '460px',
                width: '100%',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Reset Password
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {forgotStep === 1
                      ? 'Enter your registered email to receive a reset code'
                      : 'Verify reset code and choose a new password'}
                  </p>
                </div>
              </div>

              {forgotError && (
                <div className="alert-banner alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', fontSize: '0.82rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotMessage && (
                <div className="alert-banner alert-success" style={{ marginBottom: '1rem', padding: '0.75rem', fontSize: '0.82rem' }}>
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{forgotMessage}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="forgot-email-input">
                      <span>Registered Email</span>
                    </label>
                    <div className="input-container">
                      <div className="input-icon"><Mail size={18} /></div>
                      <input
                        id="forgot-email-input"
                        type="email"
                        className="form-input"
                        placeholder="e.g. admin@a.1.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <button type="submit" className="submit-btn" disabled={forgotLoading} style={{ marginTop: '0.5rem' }}>
                    {forgotLoading ? (
                      <><RefreshCw size={18} className="animate-spin" /><span>Sending Verification Code...</span></>
                    ) : (
                      <><span>Send Reset Code</span><ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="forgot-code-input">
                      <span>Verification Code</span>
                    </label>
                    <div className="input-container">
                      <div className="input-icon"><ShieldCheck size={18} /></div>
                      <input
                        id="forgot-code-input"
                        type="text"
                        className="form-input"
                        placeholder="6-digit code"
                        value={forgotCode}
                        onChange={(e) => setForgotCode(e.target.value)}
                        required
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px', display: 'block' }}>
                      Default demo code: <strong>123456</strong>
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="new-pass-input">
                      <span>New Password</span>
                    </label>
                    <div className="input-container">
                      <div className="input-icon"><Lock size={18} /></div>
                      <input
                        id="new-pass-input"
                        type="password"
                        className="form-input"
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="quick-fill-btn"
                      onClick={() => setForgotStep(1)}
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={forgotLoading}
                      style={{ flex: 1 }}
                    >
                      {forgotLoading ? (
                        <><RefreshCw size={18} className="animate-spin" /><span>Updating Password...</span></>
                      ) : (
                        <><span>Save & Update</span><CheckCircle2 size={18} /></>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <footer className="app-footer">
          <p>BizzPilot Multi-Tenant Franchise ERP SaaS • Scalable Architecture for 10,000+ Enterprises</p>
          <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>Strict Section 2 Privacy Rule: Enterprise-isolated database with 100% deterministic automated calculations.</p>
        </footer>
      </div>
    );
  }

  // ===== RENDER: Owner Portal Hub (Portal Selector) =====
  if (authStep === 'AUTHENTICATED' && activePortal === 'HUB') {
    return (
      <div className="app-container">
        <div className="ambient-glow">
          <div className="ambient-circle-1"></div>
          <div className="ambient-circle-2"></div>
          <div className="ambient-grid"></div>
        </div>

        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="#/hub" className="nav-brand" onClick={(e) => { e.preventDefault(); handleBackToHub(); }}>
              <div className="brand-icon-box"><Building2 size={24} /></div>
              <div className="brand-text-wrap">
                <span className="brand-title">BizzPilot ERP</span>
                <span className="brand-subtitle">{activeCompanyName} • Multi-Tenant SaaS</span>
              </div>
            </a>
            {navHistory.length > 1 && (
              <TopbarHistoryControls
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onGoBack={handleGoBack}
                onGoForward={handleGoForward}
                navHistory={navHistory}
                navHistoryIndex={navHistoryIndex}
                showDropdown={showHistoryDropdown}
                onToggleDropdown={(e) => {
                  e.stopPropagation();
                  setShowHistoryDropdown(prev => !prev);
                }}
                onClearHistory={() => {
                  setNavHistory([navHistory[navHistoryIndex]]);
                  setNavHistoryIndex(0);
                  setShowHistoryDropdown(false);
                }}
                onJumpHistory={(idx) => {
                  setShowHistoryDropdown(false);
                  jumpToHistoryIndex(idx);
                }}
              />
            )}
          </div>
          <div className="nav-actions">
            <div className="notif-dropdown-wrapper">
              <button className="dash-icon-btn" title="Notifications" onClick={handleToggleNotif}>
                <Bell size={18} />
                {unreadNotifCount > 0 && <span className="notif-dot"></span>}
              </button>
              {showNotifDropdown && (
                <NotificationsDropdown
                  notifications={notifications}
                  onClose={() => setShowNotifDropdown(false)}
                  onMarkAllRead={handleMarkAllRead}
                  onMarkAsRead={handleMarkAsRead}
                  onClearAll={handleClearAll}
                  onNavigate={handleNotifClick}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/';
                setCurrentView('PORTAL');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginRight: '0.5rem',
                transition: 'all 0.2s'
              }}
              title="Switch to Primary Experience Site & Demos"
            >
              <Globe size={14} />
              <span>Main Site</span>
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>

        <main className="hub-content">
          <div className="hub-card animate-fade-in">
            {/* Header */}
            <div className="hub-user-header">
              <div className="hub-user-info">
                <div className="hub-avatar">TO</div>
                <div>
                  <h3 className="hub-username">{currentUser?.name || 'Tenant Owner'}</h3>
                  <span className="role-tag-pill">TENANT_OWNER</span>
                </div>
              </div>
              <button onClick={handleLogout} className="hub-logout-btn"><LogOut size={15} /><span>Sign Out</span></button>
            </div>

            <div className="alert-banner alert-success" style={{ marginBottom: '1.5rem' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <div><strong>Owner Verified:</strong> Select a portal below to enter directly.</div>
            </div>

            {/* Admin Portal Button */}
            <button type="button" className="admin-portal-card" onClick={handleEnterOwnerDashboard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="portal-icon-box portal-icon-admin"><Shield size={22} /></div>
                <div>
                  <div className="portal-card-title">
                    <span>Login to Admin Portal</span>
                    <span className="portal-badge-tag">Master HQ</span>
                  </div>
                  <p className="portal-card-desc">Central Chart of Accounts, Company Settings & System Masters</p>
                </div>
              </div>
              <ArrowRight size={20} color="#38bdf8" />
            </button>

            {/* Branch Portals */}
            <div className="hub-section-header">
              <span className="hub-section-label">Direct Login to Branch Portals</span>
              <span className="hub-section-count">{availableBranches.length} Branches</span>
            </div>

            <div className="branch-portals-section">
              {availableBranches.map((branch) => (
                <button key={branch.id} type="button" className="branch-portal-item" onClick={() => handleEnterBranchDashboard(branch)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="branch-icon-box"><Store size={18} /></div>
                    <div>
                      <div className="branch-item-name">{branch.name}</div>
                      <div className="branch-item-meta">
                        <MapPin size={11} /><span>{branch.city}, {branch.state}</span>
                        <span>•</span>
                        <span className="branch-code-accent">{branch.code}</span>
                      </div>
                    </div>
                  </div>
                  <div className="branch-portal-btn-badge"><span>Enter Portal</span><ChevronRight size={14} /></div>
                </button>
              ))}
            </div>

            <button type="button" className="hub-bottom-logout" onClick={handleLogout}>
              <LogOut size={16} /><span>Logout from Session</span>
            </button>
          </div>
        </main>

        <footer className="app-footer">
          <p>BizzPilot Multi-Tenant Franchise ERP SaaS • {activeCompanyName}</p>
        </footer>
      </div>
    );
  }

  // ===== RENDER: Owner Dashboard (Full Page) =====
  if (authStep === 'AUTHENTICATED' && activePortal === 'OWNER_DASHBOARD') {
    const ownerSections = [
      {
        heading: 'CORE OPERATIONS',
        items: [
          { type: 'link', id: 'overview', label: 'Overview', icon: Home },
          { type: 'link', id: 'branches', label: 'Branches', icon: Store },
          {
            type: 'dropdown',
            groupKey: 'ownerInventoryGroup',
            label: 'Inventory',
            icon: Boxes,
            subItems: [
              { id: 'inventory', label: 'Inventory Management' },
              { id: 'master-category', label: 'Master Category' },
              { id: 'product360', label: 'Product 360' }
            ]
          },
        ]
      },
      {
        heading: 'FINANCE & STATUTORY',
        items: [
          {
            type: 'dropdown',
            groupKey: 'ownerFinance',
            label: 'Financials & COA',
            icon: FileSpreadsheet,
            subItems: [
              { id: 'accounts', label: 'Chart of Accounts' },
              { id: 'finance', label: 'Financial Periods' },
              { id: 'lossPrevention', label: 'Loss Prevention & Audit' },
            ]
          }
        ]
      },
      {
        heading: 'ANALYTICS & BI',
        items: [
          {
            type: 'dropdown',
            groupKey: 'ownerAnalytics',
            label: 'Analytics & BI',
            icon: BarChart3,
            subItems: [
              { id: 'analytics-charts', label: 'Visual Graphs' },
              { id: 'reports', label: 'Reports & Statements' },
            ]
          }
        ]
      },
      {
        heading: 'SYSTEM & SETTINGS',
        items: [
          {
            type: 'dropdown',
            groupKey: 'ownerSettings',
            label: 'System Settings',
            icon: Settings,
            subItems: [
              { id: 'profile', label: 'My Profile' },
              { id: 'companies', label: 'Companies & GST' },
              { id: 'users', label: 'User & Employee Directory' },
              { id: 'settings', label: 'System Configuration' },
            ]
          }
        ]
      }
    ];

    const stats = [
      { label: 'Active Branches', value: availableBranches.length.toString(), icon: Store, color: '#38bdf8', change: '+1 this month', up: true },
      { label: 'Total Revenue (MTD)', value: '₹18.4L', icon: TrendingUp, color: '#10b981', change: '+12.5%', up: true },
      { label: 'Active Users', value: '24', icon: Users, color: '#a855f7', change: '+3 this week', up: true },
      { label: 'Pending Approvals', value: '7', icon: ClipboardList, color: '#f59e0b', change: '3 urgent', up: false },
    ];

    const recentActivity = [
      { action: 'Stock Transfer Approved', branch: 'AMD-01 → SUR-02', time: '12 min ago', type: 'success' },
      { action: 'New Purchase Order Created', branch: 'Vadodara Depot', time: '45 min ago', type: 'info' },
      { action: 'GST Return Filed (GSTR-3B)', branch: 'HQ - All Branches', time: '2 hours ago', type: 'success' },
      { action: 'Low Stock Alert: Fire Extinguisher 5kg', branch: 'Surat Franchise', time: '3 hours ago', type: 'warning' },
      { action: 'Branch Cashbook Reconciled', branch: 'Ahmedabad Hub', time: '5 hours ago', type: 'success' },
      { action: 'User Access Modified', branch: 'System-wide', time: '1 day ago', type: 'info' },
    ];

    const modules = [
      { name: 'Chart of Accounts', desc: 'Manage COA templates & account groups', icon: FileSpreadsheet, color: '#38bdf8' },
      { name: 'Financial Periods', desc: 'Lock/unlock periods & fiscal year', icon: Calendar, color: '#10b981' },
      { name: 'Companies & GST', desc: 'GSTIN, PAN, state codes, legal entities', icon: Building2, color: '#a855f7' },
      { name: 'Branch Management', desc: 'Add, configure, and monitor branches', icon: Store, color: '#f59e0b' },
      { name: 'User Roles & ACL', desc: 'Role-based access control & permissions', icon: Shield, color: '#ec4899' },
      { name: 'Audit Trail', desc: 'Immutable action logs & compliance', icon: BookOpen, color: '#84cc16' },
      { name: 'Reports Dashboard', desc: 'P&L, Trial Balance, Cash Flow', icon: PieChart, color: '#f97316' },
      { name: 'System Configuration', desc: 'Currency, timezone, integrations', icon: Settings, color: '#6366f1' },
    ];

    return (
      <div className="dashboard-layout">
        {/* Mobile Backdrop */}
        {!sidebarCollapsed && <div className="sidebar-mobile-backdrop" onClick={() => setSidebarCollapsed(true)} />}

        {/* Sidebar (SFTP-FTP-SYNC Layout) */}
        <aside className={`dash-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div
              className="avatar"
              onClick={() => sidebarCollapsed && setSidebarCollapsed(false)}
              title={sidebarCollapsed ? "Expand Sidebar" : "BizzPilot Admin"}
            >
              <Building2 size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-logo">
                <span className="sidebar-logo-title">BizzPilot ERP</span>
                <span className="sidebar-logo-subtitle">Admin Portal</span>
              </div>
            )}
          </div>

          {/* Portal Selector Dropdown */}
          <div className="portal-selector">
            {!sidebarCollapsed ? (
              <select
                className="portal-dropdown"
                value={activePortal === 'OWNER_DASHBOARD' ? 'OWNER_DASHBOARD' : (activeBranch?.code || 'OWNER_DASHBOARD')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'HUB') {
                    handleBackToHub();
                  } else if (val === 'OWNER_DASHBOARD') {
                    handleEnterOwnerDashboard();
                  } else {
                    const br = availableBranches.find(b => b.code === val || b.id === val);
                    if (br) handleEnterBranchDashboard(br);
                  }
                }}
              >
                <option value="OWNER_DASHBOARD">🏢 Owner Admin Dashboard</option>
                <optgroup label="Branch Portals">
                  {availableBranches.map(br => (
                    <option key={br.id || br.code} value={br.code}>
                      📍 {br.code} - {br.name}
                    </option>
                  ))}
                </optgroup>
                <option value="HUB" style={{ fontWeight: 'bold', color: 'var(--brand-accent)' }}>
                  ⇄ Switch User / Portal Hub
                </option>
              </select>
            ) : (
              <div
                className="portal-selector-collapsed"
                onClick={() => setSidebarCollapsed(false)}
                title="Click to Switch Portal"
              >
                <Layers size={17} />
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <nav className="sidebar-nav">
            {ownerSections.map((sec, sIdx) => (
              <React.Fragment key={sIdx}>
                <div className="nav-heading">{sec.heading}</div>
                {sec.items.map((item, iIdx) => {
                  if (item.type === 'dropdown') {
                    const isGroupActive = item.subItems.some(sub => sub.id === activeOwnerTab);
                    const isOpen = !sidebarCollapsed && Boolean(expandedSidebarGroups[item.groupKey]);
                    const isFlyoutOpen = sidebarCollapsed && hoveredFlyoutGroup === item.groupKey;
                    return (
                      <div
                        key={iIdx}
                        className={`nav-group ${isFlyoutOpen ? 'flyout-active' : ''}`}
                        onMouseEnter={() => sidebarCollapsed && handleFlyoutEnter(item.groupKey)}
                        onMouseLeave={() => sidebarCollapsed && handleFlyoutLeave()}
                      >
                        <div
                          className={`nav-item dropdown-toggle ${isGroupActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                          onClick={() => toggleSidebarGroup(item.groupKey)}
                          data-title={item.label}
                        >
                          <span className="nav-icon"><item.icon size={18} /></span>
                          <span className="nav-text">{item.label}</span>
                          <span className="dropdown-icon"><ChevronDown size={14} /></span>
                        </div>
                        <div
                          className={`sub-menu ${isOpen ? 'open' : ''} ${isFlyoutOpen ? 'flyout-visible' : ''}`}
                          onMouseEnter={() => sidebarCollapsed && handleFlyoutEnter(item.groupKey)}
                          onMouseLeave={() => sidebarCollapsed && handleFlyoutLeave()}
                        >
                          <div className="sub-menu-inner">
                            {item.subItems.map(sub => (
                              <button
                                key={sub.id}
                                type="button"
                                className={`sub-item ${activeOwnerTab === sub.id ? 'active' : ''}`}
                                onClick={() => {
                                  setHoveredFlyoutGroup(null);
                                  changeOwnerTab(sub.id);
                                  if (window.innerWidth <= 992) setSidebarCollapsed(true);
                                }}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`nav-item ${activeOwnerTab === item.id ? 'active' : ''}`}
                      onClick={() => {
                        changeOwnerTab(item.id);
                        if (window.innerWidth <= 992) setSidebarCollapsed(true);
                      }}
                      data-title={item.label}
                    >
                      <span className="nav-icon"><item.icon size={18} /></span>
                      <span className="nav-text">{item.label}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <button
              type="button"
              className="nav-item sidebar-back"
              onClick={handleBackToHub}
              data-title="Back to Portal Hub"
            >
              <span className="nav-icon"><ArrowLeft size={18} /></span>
              <span className="nav-text">Back to Hub</span>
            </button>
            <button
              type="button"
              className="nav-item sidebar-logout"
              onClick={handleLogout}
              data-title="Logout"
            >
              <span className="nav-icon"><LogOut size={18} /></span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard */}
        <div className="dash-main">
          {/* Top Bar */}
          <header className="dash-topbar">
            <div className="dash-topbar-left">
              <button
                className="topbar-sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>

              {/* History Navigation: Back, Forward, History Dropdown */}
              <TopbarHistoryControls
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onGoBack={handleGoBack}
                onGoForward={handleGoForward}
                navHistory={navHistory}
                navHistoryIndex={navHistoryIndex}
                showDropdown={showHistoryDropdown}
                onToggleDropdown={(e) => {
                  e.stopPropagation();
                  setShowHistoryDropdown(prev => !prev);
                }}
                onClearHistory={() => {
                  setNavHistory([navHistory[navHistoryIndex]]);
                  setNavHistoryIndex(0);
                  setShowHistoryDropdown(false);
                }}
                onJumpHistory={(idx) => {
                  setShowHistoryDropdown(false);
                  jumpToHistoryIndex(idx);
                }}
              />

              <h1 className="dash-page-title">
                <Shield size={22} className="dash-title-icon" />
                Admin Dashboard
              </h1>
              <span className="dash-tenant-name">{activeCompanyName}</span>

              {/* Breadcrumbs */}
              <DashBreadcrumbs
                portal={activePortal}
                activeBranch={activeBranch}
                activeOwnerTab={activeOwnerTab}
                activeBranchTab={activeBranchTab}
                currentUser={currentUser}
                onBackToHub={handleBackToHub}
                onChangeOwnerTab={changeOwnerTab}
                onChangeBranchTab={changeBranchTab}
              />
            </div>
            <div className="dash-topbar-right">
              <div className="dash-search-box">
                <Search size={16} />
                <input type="text" placeholder="Search modules..." className="dash-search-input" />
              </div>
              <div className="notif-dropdown-wrapper">
                <button className="dash-icon-btn" title="Notifications" onClick={handleToggleNotif}>
                  <Bell size={18} />
                  {unreadNotifCount > 0 && <span className="notif-dot"></span>}
                </button>
                {showNotifDropdown && (
                  <NotificationsDropdown
                    notifications={notifications}
                    onClose={() => setShowNotifDropdown(false)}
                    onMarkAllRead={handleMarkAllRead}
                    onMarkAsRead={handleMarkAsRead}
                    onClearAll={handleClearAll}
                    onNavigate={handleNotifClick}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/';
                  setCurrentView('PORTAL');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                  transition: 'all 0.2s'
                }}
                title="Switch to Primary Experience Site & Demos"
              >
                <Globe size={14} />
                <span>Main Site</span>
              </button>
              <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
              <div
                className="dash-user-pill"
                onClick={() => changeOwnerTab('profile')}
                style={{ cursor: 'pointer' }}
                title="Click to view & edit your profile"
              >
                <div className="dash-user-avatar">TO</div>
                <span className="dash-user-name">{currentUser?.name || 'Owner'}</span>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="dash-content">
            <DashboardErrorBoundary>
              {activeOwnerTab === 'overview' && <OwnerOverview stats={stats} recentActivity={recentActivity} availableBranches={availableBranches} handleEnterBranchDashboard={handleEnterBranchDashboard} currentUser={currentUser} currentTenant={currentTenant} onNavigateTab={changeOwnerTab} />}
              {activeOwnerTab === 'branches' && <OwnerBranches availableBranches={availableBranches} handleEnterBranchDashboard={handleEnterBranchDashboard} onAddBranch={(newB) => setAvailableBranches(prev => [...prev, newB])} currentTenant={currentTenant} />}
              {activeOwnerTab === 'inventory' && <BranchInventory activeBranch={availableBranches[0] || { code: 'AMD-01', name: 'Ahmedabad Hub' }} />}
              {(activeOwnerTab === 'master-category' || activeOwnerTab === 'products-catalog') && <BranchMasterCategory activeBranch={availableBranches[0] || { code: 'AMD-01', name: 'Ahmedabad Hub' }} />}
              {activeOwnerTab === 'product360' && (
                <OwnerProduct360
                  activeBranch={availableBranches[0] || { code: 'AMD-01', name: 'Master HQ' }}
                  availableBranches={availableBranches}
                  currentTenant={currentTenant}
                  isOwnerPortal={true}
                  initialSku={product360SelectedSku}
                />
              )}
              {activeOwnerTab === 'lossPrevention' && <OwnerLossPrevention currentTenant={currentTenant} currentUser={currentUser} availableBranches={availableBranches} />}
              {activeOwnerTab === 'accounts' && <OwnerAccounts currentTenant={currentTenant} currentUser={currentUser} />}
              {activeOwnerTab === 'finance' && <OwnerFinance currentTenant={currentTenant} currentUser={currentUser} />}
              {activeOwnerTab === 'companies' && <OwnerCompanies />}
              {activeOwnerTab === 'users' && <OwnerUsers />}
              {activeOwnerTab === 'analytics-charts' && <OwnerVisualAnalytics onNavigateTab={changeOwnerTab} />}
              {activeOwnerTab === 'reports' && <OwnerReports />}
              {activeOwnerTab === 'settings' && <OwnerSettings />}
              {activeOwnerTab === 'profile' && (
                <UserProfilePage
                  currentUser={currentUser}
                  currentTenant={currentTenant}
                  onUserUpdated={(updated) => setCurrentUser(updated)}
                />
              )}
            </DashboardErrorBoundary>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: Branch Dashboard (Full Page) =====
  if (authStep === 'AUTHENTICATED' && activePortal === 'BRANCH_DASHBOARD') {
    const safeBranch = activeBranch || availableBranches.find(b => b.code === (currentUser?.branch_code || 'AMD-01')) || availableBranches[0] || defaultBranches[0];
    const branchToUse = safeBranch;
    const branchSections = [
      {
        heading: 'CORE OPERATIONS',
        items: [
          { type: 'link', id: 'overview', label: 'Overview', icon: Home },
          { type: 'link', id: 'pos', label: 'POS Billing', icon: Receipt },
          {
            type: 'dropdown',
            groupKey: 'branchInventoryGroup',
            label: 'Inventory',
            icon: Boxes,
            subItems: [
              { id: 'inventory', label: 'Inventory Management' },
              { id: 'master-category', label: 'Master Category' },
              { id: 'product360', label: 'Product 360' }
            ]
          }
        ]
      },
      {
        heading: 'STOCK & LOGISTICS',
        items: [
          {
            type: 'dropdown',
            groupKey: 'branchStock',
            label: 'Stock Operations',
            icon: Truck,
            subItems: [
              { id: 'reservations', label: 'Holds & Pickups' },
              { id: 'transfers', label: 'Stock Transfers' },
              { id: 'lossPrevention', label: 'Stock Audit & Loss' },
            ]
          }
        ]
      },
      {
        heading: 'FINANCE & SALES',
        items: [
          {
            type: 'dropdown',
            groupKey: 'branchFinance',
            label: 'Billing & Cashbook',
            icon: Wallet,
            subItems: [
              { id: 'cashbook', label: 'Daily Cash Book' },
              { id: 'purchases', label: 'Purchases Receiving' },
              { id: 'sales', label: 'Sales & Invoices' },
            ]
          }
        ]
      },
      {
        heading: 'ANALYTICS & BI',
        items: [
          {
            type: 'dropdown',
            groupKey: 'branchAnalytics',
            label: 'Branch Analytics',
            icon: BarChart3,
            subItems: [
              { id: 'branch-analytics-charts', label: 'Visual Graphs' },
              { id: 'reports', label: 'Branch Reports' },
            ]
          }
        ]
      },
      {
        heading: 'ADMINISTRATION',
        items: [
          {
            type: 'dropdown',
            groupKey: 'branchAdminGroup',
            label: 'Admin',
            icon: Sliders,
            subItems: [
              { id: 'profile', label: 'My Profile' },
              { id: 'branchSettings', label: 'Branch Settings' },
              { id: 'team', label: 'Staff Directory' },
            ]
          }
        ]
      }
    ];

    const branchStats = [
      { label: 'Today\'s Sales', value: '₹2.8L', icon: TrendingUp, color: '#10b981', change: '+8.3% vs yesterday', up: true },
      { label: 'Items in Stock', value: '1,847', icon: Package, color: '#38bdf8', change: '23 low stock', up: false },
      { label: 'Pending Orders', value: '12', icon: ClipboardList, color: '#f59e0b', change: '5 urgent', up: false },
      { label: 'Cash in Hand', value: '₹45,200', icon: Wallet, color: '#a855f7', change: 'Last reconciled 2h ago', up: true },
    ];

    const branchModules = [
      { name: 'POS Counter Billing', desc: 'Real-time point-of-sale with barcode scan', icon: Receipt, color: '#38bdf8', tab: 'pos' },
      { name: 'Branch Inventory', desc: 'Stock counts, reorder levels, shelf audit', icon: Boxes, color: '#10b981', tab: 'inventory' },
      { name: 'Stock Transfers', desc: 'Inter-branch material movements', icon: Truck, color: '#a855f7', tab: 'transfers' },
      { name: 'Daily Cash Book', desc: 'Cash receipts, payments & reconciliation', icon: Wallet, color: '#f59e0b', tab: 'cashbook' },
      { name: 'Purchase Receiving', desc: 'GRN, shortage detection, quality check', icon: ShoppingCart, color: '#ec4899', tab: 'purchases' },
      { name: 'Sales & Invoices', desc: 'Tax invoices, credit notes, returns', icon: CreditCard, color: '#06b6d4', tab: 'sales' },
    ];

    const branchActivity = [
      { action: 'Invoice #INV-2847 Generated', detail: '₹12,450 • Fire Ext. 5kg x10', time: '8 min ago', type: 'success' },
      { action: 'Stock Received from HQ', detail: 'GRN #GRN-981 • 45 items', time: '1 hour ago', type: 'info' },
      { action: 'Cash Payment Recorded', detail: '₹3,200 • Supplier: ABC Pvt Ltd', time: '2 hours ago', type: 'info' },
      { action: 'Low Stock Alert', detail: 'Safety Helmet M-201 (Qty: 3)', time: '4 hours ago', type: 'warning' },
      { action: 'Day-End Cashbook Closed', detail: 'Balance: ₹45,200', time: 'Yesterday', type: 'success' },
    ];

    return (
      <div className="dashboard-layout">
        {/* Mobile Backdrop */}
        {!sidebarCollapsed && <div className="sidebar-mobile-backdrop" onClick={() => setSidebarCollapsed(true)} />}

        {/* Sidebar (SFTP-FTP-SYNC Layout) */}
        <aside className={`dash-sidebar branch-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div
              className="avatar branch-avatar"
              onClick={() => sidebarCollapsed && setSidebarCollapsed(false)}
              title={sidebarCollapsed ? "Expand Sidebar" : activeBranch.name}
            >
              <Store size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-logo">
                <span className="sidebar-logo-title">{activeBranch.name}</span>
                <span className="sidebar-logo-subtitle">{activeBranch.code} Branch Portal</span>
              </div>
            )}
          </div>

          {/* Portal Selector Dropdown */}
          <div className="portal-selector">
            {currentUser?.role === 'TENANT_OWNER' ? (
              !sidebarCollapsed ? (
                <select
                  className="portal-dropdown"
                  value={activeBranch.code}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'HUB') {
                      handleBackToHub();
                    } else if (val === 'OWNER_DASHBOARD') {
                      handleEnterOwnerDashboard();
                    } else {
                      const br = availableBranches.find(b => b.code === val || b.id === val);
                      if (br) handleEnterBranchDashboard(br);
                    }
                  }}
                >
                  <option value="OWNER_DASHBOARD">🏢 Owner Admin Dashboard</option>
                  <optgroup label="Branch Portals">
                    {availableBranches.map(br => (
                      <option key={br.id || br.code} value={br.code}>
                        📍 {br.code} - {br.name}
                      </option>
                    ))}
                  </optgroup>
                  <option value="HUB" style={{ fontWeight: 'bold', color: 'var(--brand-accent)' }}>
                    ⇄ Switch User / Portal Hub
                  </option>
                </select>
              ) : (
                <div
                  className="portal-selector-collapsed"
                  onClick={() => setSidebarCollapsed(false)}
                  title="Click to Switch Portal"
                >
                  <Layers size={17} />
                </div>
              )
            ) : (
              // Branch manager has locked single-branch scope!
              !sidebarCollapsed ? (
                <div style={{
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.78rem',
                  color: '#38bdf8'
                }}>
                  <Lock size={14} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, letterSpacing: '0.02em' }}>{activeBranch.code} Scope Locked</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Strict data isolation active</div>
                  </div>
                </div>
              ) : (
                <div
                  className="portal-selector-collapsed"
                  style={{ color: '#38bdf8' }}
                  title={`${activeBranch.code} (Isolated Branch Scope)`}
                >
                  <Lock size={16} />
                </div>
              )
            )}
          </div>

          {/* Sidebar Navigation */}
          <nav className="sidebar-nav">
            {branchSections.map((sec, sIdx) => (
              <React.Fragment key={sIdx}>
                <div className="nav-heading">{sec.heading}</div>
                {sec.items.map((item, iIdx) => {
                  if (item.type === 'dropdown') {
                    const isGroupActive = item.subItems.some(sub => sub.id === activeBranchTab);
                    const isOpen = !sidebarCollapsed && Boolean(expandedSidebarGroups[item.groupKey] || isGroupActive);
                    const isFlyoutOpen = sidebarCollapsed && hoveredFlyoutGroup === item.groupKey;
                    return (
                      <div
                        key={iIdx}
                        className={`nav-group ${isFlyoutOpen ? 'flyout-active' : ''}`}
                        onMouseEnter={() => sidebarCollapsed && handleFlyoutEnter(item.groupKey)}
                        onMouseLeave={() => sidebarCollapsed && handleFlyoutLeave()}
                      >
                        <div
                          className={`nav-item dropdown-toggle ${isGroupActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                          onClick={() => toggleSidebarGroup(item.groupKey)}
                          data-title={item.label}
                        >
                          <span className="nav-icon"><item.icon size={18} /></span>
                          <span className="nav-text">{item.label}</span>
                          <span className="dropdown-icon"><ChevronDown size={14} /></span>
                        </div>
                        <div
                          className={`sub-menu ${isOpen ? 'open' : ''} ${isFlyoutOpen ? 'flyout-visible' : ''}`}
                          onMouseEnter={() => sidebarCollapsed && handleFlyoutEnter(item.groupKey)}
                          onMouseLeave={() => sidebarCollapsed && handleFlyoutLeave()}
                        >
                          <div className="sub-menu-inner">
                            {item.subItems.map(sub => (
                              <button
                                key={sub.id}
                                type="button"
                                className={`sub-item ${activeBranchTab === sub.id ? 'active' : ''}`}
                                onClick={() => {
                                  setHoveredFlyoutGroup(null);
                                  changeBranchTab(sub.id);
                                  if (window.innerWidth <= 992) setSidebarCollapsed(true);
                                }}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`nav-item ${activeBranchTab === item.id ? 'active' : ''}`}
                      onClick={() => {
                        changeBranchTab(item.id);
                        if (window.innerWidth <= 992) setSidebarCollapsed(true);
                      }}
                      data-title={item.label}
                    >
                      <span className="nav-icon"><item.icon size={18} /></span>
                      <span className="nav-text">{item.label}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            {currentUser?.role === 'TENANT_OWNER' && (
              <button
                type="button"
                className="nav-item sidebar-back"
                onClick={handleBackToHub}
                data-title="Back to Portal Hub"
              >
                <span className="nav-icon"><ArrowLeft size={18} /></span>
                <span className="nav-text">Back to Hub</span>
              </button>
            )}
            <button
              type="button"
              className="nav-item sidebar-logout"
              onClick={handleLogout}
              data-title="Logout"
            >
              <span className="nav-icon"><LogOut size={18} /></span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="dash-main">
          <header className="dash-topbar">
            <div className="dash-topbar-left">
              <button
                className="topbar-sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>

              {/* History Navigation: Back, Forward, History Dropdown */}
              <TopbarHistoryControls
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onGoBack={handleGoBack}
                onGoForward={handleGoForward}
                navHistory={navHistory}
                navHistoryIndex={navHistoryIndex}
                showDropdown={showHistoryDropdown}
                onToggleDropdown={(e) => {
                  e.stopPropagation();
                  setShowHistoryDropdown(prev => !prev);
                }}
                onClearHistory={() => {
                  setNavHistory([navHistory[navHistoryIndex]]);
                  setNavHistoryIndex(0);
                  setShowHistoryDropdown(false);
                }}
                onJumpHistory={(idx) => {
                  setShowHistoryDropdown(false);
                  jumpToHistoryIndex(idx);
                }}
              />

              <h1 className="dash-page-title">
                <Store size={22} className="dash-title-icon" />
                {activeBranch?.name || 'Branch Operations'}
              </h1>
              <div className="dash-branch-location">
                <span className="branch-type-tag" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700, borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                  {activeCompanyName}
                </span>
                <MapPin size={14} />
                <span>{activeBranch?.city || ''}{activeBranch?.state ? `, ${activeBranch.state}` : ''}</span>
                <span className="branch-type-tag">{(activeBranch?.type || activeBranch?.branch_type || 'Main Branch').replace(/_/g, ' ')}</span>
              </div>

              {/* Breadcrumbs */}
              <DashBreadcrumbs
                portal={activePortal}
                activeBranch={activeBranch}
                activeOwnerTab={activeOwnerTab}
                activeBranchTab={activeBranchTab}
                currentUser={currentUser}
                onBackToHub={handleBackToHub}
                onChangeOwnerTab={changeOwnerTab}
                onChangeBranchTab={changeBranchTab}
              />
            </div>
            <div className="dash-topbar-right">
              <div className="dash-search-box">
                <Search size={16} />
                <input type="text" placeholder="Search..." className="dash-search-input" />
              </div>
              <div className="notif-dropdown-wrapper">
                <button className="dash-icon-btn" title="Notifications" onClick={handleToggleNotif}>
                  <Bell size={18} />
                  {unreadNotifCount > 0 && <span className="notif-dot"></span>}
                </button>
                {showNotifDropdown && (
                  <NotificationsDropdown
                    notifications={notifications}
                    onClose={() => setShowNotifDropdown(false)}
                    onMarkAllRead={handleMarkAllRead}
                    onMarkAsRead={handleMarkAsRead}
                    onClearAll={handleClearAll}
                    onNavigate={handleNotifClick}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/';
                  setCurrentView('PORTAL');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                  transition: 'all 0.2s'
                }}
                title="Switch to Primary Experience Site & Demos"
              >
                <Globe size={14} />
                <span>Main Site</span>
              </button>
              <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
              <div
                className="dash-user-pill"
                onClick={() => changeBranchTab('profile')}
                style={{ cursor: 'pointer' }}
                title="Click to view & edit your profile"
              >
                <div className="dash-user-avatar">
                  {currentUser?.avatar || (currentUser?.role === 'TENANT_OWNER' ? 'TO' : 'BM')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                  <span className="dash-user-name">{currentUser?.name || 'User'}</span>
                  <span style={{ fontSize: '0.67rem', color: currentUser?.role === 'TENANT_OWNER' ? '#a855f7' : '#38bdf8', fontWeight: 700 }}>
                    {currentUser?.role === 'TENANT_OWNER' ? 'Enterprise Owner' : `Manager (${currentUser?.branch_code || activeBranch?.code})`}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="dash-content">
            <DashboardErrorBoundary>
              {activeBranchTab === 'overview' && <BranchOverview activeBranch={safeBranch} branchStats={branchStats} branchModules={branchModules} branchActivity={branchActivity} onNavigateTab={changeBranchTab} />}
              {activeBranchTab === 'pos' && <BranchPOS activeBranch={safeBranch} currentUser={currentUser} currentTenant={currentTenant} />}
              {activeBranchTab === 'inventory' && <BranchInventory activeBranch={safeBranch} />}
              {(activeBranchTab === 'master-category' || activeBranchTab === 'products-catalog') && <BranchMasterCategory activeBranch={safeBranch} />}
              {activeBranchTab === 'product360' && (
                <BranchProduct360
                  activeBranch={safeBranch}
                  availableBranches={(availableBranches || []).length > 1 ? availableBranches : defaultBranches.filter(b => b.companyId === (currentTenant?.id || safeBranch?.companyId || (safeBranch?.code?.startsWith('AND') || safeBranch?.code?.startsWith('SRU') ? 'comp_mashtech' : 'comp_mann')))}
                  currentTenant={currentTenant}
                  isOwnerPortal={false}
                  initialSku={product360SelectedSku}
                />
              )}
              {activeBranchTab === 'reservations' && <BranchReservations activeBranch={safeBranch} />}
              {activeBranchTab === 'transfers' && <BranchTransfers activeBranch={safeBranch} />}
              {activeBranchTab === 'lossPrevention' && (
                <BranchLossPrevention
                  activeBranch={safeBranch}
                  currentUser={currentUser}
                  currentTenant={currentTenant}
                />
              )}
              {activeBranchTab === 'cashbook' && (
                <BranchCashBook
                  activeBranch={safeBranch}
                  currentUser={currentUser}
                  currentTenant={currentTenant}
                />
              )}
              {activeBranchTab === 'purchases' && (
                <BranchPurchases
                  activeBranch={safeBranch}
                  currentUser={currentUser}
                  currentTenant={currentTenant}
                />
              )}
              {activeBranchTab === 'sales' && (
                <BranchSales
                  activeBranch={safeBranch}
                  currentUser={currentUser}
                  currentTenant={currentTenant}
                />
              )}
              {activeBranchTab === 'branch-analytics-charts' && <BranchVisualAnalytics activeBranch={safeBranch} />}
              {activeBranchTab === 'reports' && <BranchReports activeBranch={safeBranch} />}
              {activeBranchTab === 'team' && (
                <BranchTeamDirectory
                  activeBranch={safeBranch}
                  currentUser={currentUser}
                />
              )}
              {activeBranchTab === 'branchSettings' && (
                <BranchDataCorrectionSettings
                  activeBranch={safeBranch}
                  currentUser={currentUser}
                  onBranchUpdated={(updated) => {
                    setActiveBranch(prev => ({ ...prev, ...updated }));
                    setDefaultBranches(prev => prev.map(b => (b.code === updated.code ? { ...b, ...updated } : b)));
                  }}
                />
              )}
              {activeBranchTab === 'profile' && (
                <UserProfilePage
                  currentUser={currentUser}
                  activeBranch={safeBranch}
                  currentTenant={currentTenant}
                  onUserUpdated={(updated) => setCurrentUser(updated)}
                />
              )}
            </DashboardErrorBoundary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#e2e8f0', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '42px', height: '42px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Loading BizzPilot Enterprise Workspace...</p>
    </div>
  );
}
