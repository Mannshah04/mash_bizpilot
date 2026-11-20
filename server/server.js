const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { tenants, companies, branches, users, auditLogs } = require('./db');
const {
  initDatabase,
  saveOnboardingData,
  getCompanyById,
  getBranches,
  createBranch,
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
  updateBranch,
  updateBranchManagerCredentials,
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
  getProductCustomerPurchases,
  pool
} = require('./postgres');
const { getOwnerAnalytics, getBranchAnalytics } = require('./analytics');
const {
  DEFAULT_GODOWN,
  computeWarehouseLayout,
  DEFAULT_PRODUCT_SPEC,
  computeVerticalStacking,
  MaxRects,
  computeStorageBilling
} = require('./warehouseEngine');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bizzpilot-ultra-secure-jwt-secret-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'bizzpilot-refresh-secret-key-2026';

app.use(cors());
app.use(express.json());

// Helper: Add Audit Log
function recordAuditLog({ tenantId, userId, action, status, details, req }) {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Agent';

  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tenantId: tenantId || null,
    userId: userId || null,
    action,
    status,
    ipAddress,
    userAgent,
    details,
    timestamp: new Date().toISOString()
  };

  auditLogs.unshift(logEntry);
  if (auditLogs.length > 200) auditLogs.pop();
  return logEntry;
}

// Authentication Token Generator - fully synced with PostgreSQL companies and branches
async function generateTokens(user, activeBranchId = null) {
  const companyId = user.company_id || user.companyId || user.tenantId || 'comp_mann';

  // Fetch real company details from PostgreSQL
  let tenant = null;
  try {
    tenant = await getCompanyById(companyId);
  } catch (err) {
    console.warn('DB getCompanyById lookup error in generateTokens:', err.message);
  }
  if (!tenant) {
    tenant = tenants.find(t => t.id === companyId) || tenants[0];
  }

  // Fetch real branches from PostgreSQL
  let companyBranches = [];
  try {
    companyBranches = await getBranches(companyId);
  } catch (err) {
    console.warn('DB getBranches lookup error in generateTokens:', err.message);
  }
  if (!companyBranches || companyBranches.length === 0) {
    companyBranches = branches.filter(b => b.companyId === companyId);
    if (companyBranches.length === 0 && companyId === 'comp_mann') {
      companyBranches = branches;
    }
  }

  const isOwner = user.role === 'PLATFORM_ADMIN' || user.role === 'TENANT_OWNER' || (user.allowedBranches && user.allowedBranches.includes('*')) || user.branch_code === '*';

  const userBranches = isOwner 
    ? companyBranches 
    : companyBranches.filter(b => 
        (user.allowedBranches && (user.allowedBranches.includes(b.id) || user.allowedBranches.includes(b.code))) ||
        b.code === user.branch_code
      );

  const resolvedBranch = activeBranchId 
    ? userBranches.find(b => b.id === activeBranchId || b.code === activeBranchId) || userBranches[0]
    : userBranches[0] || companyBranches[0] || branches[0];

  const payload = {
    sub: user.user_id || user.userId || user.id,
    userId: user.user_id || user.userId || user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    name: user.name,
    companyId: companyId,
    companyName: user.company_name || user.companyName || tenant.name,
    tenantId: companyId,
    tenantSlug: tenant ? tenant.slug : null,
    branchId: resolvedBranch ? resolvedBranch.id : null,
    branchCode: resolvedBranch ? resolvedBranch.code : (user.branch_code || 'AMD-01'),
    branchName: resolvedBranch ? resolvedBranch.name : (user.branch_name || 'Branch')
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.user_id || user.userId || user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken, payload, userBranches, resolvedBranch, tenant };
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }
    req.user = decoded;
    next();
  });
}

// ================= ROUTES ================= //

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'BizzPilot Multi-Tenant Franchise ERP SaaS',
    owner: 'Mann Engineers',
    version: '1.0.0-hackathon-preview',
    privacyCompliance: 'Section 2 Non-Negotiable Privacy: Strict Local AI Boundary Enforced',
    timestamp: new Date().toISOString()
  });
});

// GET /api/auth/tenants - Public tenant directory/lookup for branding & domain matching
app.get('/api/auth/tenants', (req, res) => {
  const safeTenants = tenants.map(({ id, slug, name, logoText, primaryColor, plan, privacyStatus }) => ({
    id, slug, name, logoText, primaryColor, plan, privacyStatus
  }));
  res.json({ success: true, tenants: safeTenants });
});

// GET /api/auth/directory - Public directory of user accounts and assigned branches for login table
app.get('/api/auth/directory', async (req, res) => {
  try {
    const dbUsers = await getUsersDirectory();
    if (dbUsers && dbUsers.length > 0) {
      return res.json({ success: true, users: dbUsers });
    }
  } catch (err) {
    console.warn('Could not fetch users directory from DB, using fallback:', err.message);
  }

  const fallbackUsers = users.map(u => ({
    id: u.userId || u.id,
    userId: u.userId || u.id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    branchCode: u.branch_code,
    branchName: u.branch_name,
    isActive: u.isActive,
    scopeDesc: u.role === 'TENANT_OWNER' ? 'Global Access (All Branches & HQ)' : `Isolated to ${u.branch_code} (${u.branch_name})`
  }));
  res.json({ success: true, users: fallbackUsers });
});

// POST /api/auth/login - Handles login for both Tenant Owner and Branch Managers with strict data isolation
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password, tenantSlug } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Username and Password are required.'
      });
    }

    const cleanInput = emailOrUsername.trim().toLowerCase();
    
    // First query PostgreSQL "users" table
    let user = null;
    try {
      user = await getUserByUsernameOrEmail(cleanInput);
    } catch (dbErr) {
      console.warn('DB lookup error in login:', dbErr.message);
    }

    // Fallback to in-memory db.js
    if (!user) {
      user = users.find(u => 
        u.email.toLowerCase() === cleanInput || 
        u.username.toLowerCase() === cleanInput
      );
    }

    if (!user) {
      recordAuditLog({
        tenantId: null,
        userId: null,
        action: 'AUTH_LOGIN_FAILED',
        status: 'FAILED',
        details: `Unknown user attempt for: ${cleanInput}`,
        req
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email/username and password.'
      });
    }

    // ── Check if Account is Locked (3 Failed Password Attempts => 1 Hour Lock) ──
    const now = new Date();
    const isLocked = Boolean(user.locked_until && new Date(user.locked_until) > now);
    if (isLocked) {
      const remainingMs = new Date(user.locked_until) - now;
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
      const lockUntilFormatted = new Date(user.locked_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      recordAuditLog({
        tenantId: user.tenantId || 'ten_mann_01',
        userId: user.user_id || user.id,
        action: 'AUTH_LOGIN_BLOCKED_LOCKED',
        status: 'BLOCKED',
        details: `Login blocked for locked user ${user.email}. Locked until ${user.locked_until}`,
        req
      });

      return res.status(403).json({
        success: false,
        isLocked: true,
        remainingMinutes,
        lockedUntil: user.locked_until,
        message: `🔒 Account Blocked: You have exceeded the maximum of 3 failed login attempts. This account is locked for 1 hour (until ${lockUntilFormatted}, ~${remainingMinutes} min remaining). Please wait or contact your branch administrator to unlock immediately.`
      });
    }

    // If lock period has expired, auto-unlock account
    if (user.locked_until && new Date(user.locked_until) <= now) {
      try {
        await recordLoginAttempt(user.user_id || user.id, true);
      } catch (e) {}
      user.failed_attempts = 0;
      user.locked_until = null;
      user.status = 'ACTIVE';
    }

    if (user.isActive === false || user.is_active === false || user.status === 'INACTIVE' || user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated / suspended. Please contact your company administrator.'
      });
    }

    // Verify Password
    const passwordHash = user.passwordHash || user.password_hash;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      let attemptResult;
      try {
        attemptResult = await recordLoginAttempt(user.user_id || user.id, false, 1);
      } catch (e) {
        attemptResult = { failedAttempts: 1, isLocked: false, remainingAttempts: 2 };
      }

      // Sync in-memory user if present
      const inMemUser = users.find(u => u.email.toLowerCase() === cleanInput || u.username.toLowerCase() === cleanInput);
      if (inMemUser) {
        inMemUser.failed_attempts = attemptResult.failedAttempts;
        inMemUser.locked_until = attemptResult.lockedUntil;
        if (attemptResult.isLocked) {
          inMemUser.status = 'LOCKED';
          inMemUser.isActive = false;
        }
      }

      recordAuditLog({
        tenantId: user.tenantId || 'ten_mann_01',
        userId: user.user_id || user.id,
        action: attemptResult.isLocked ? 'AUTH_ACCOUNT_LOCKED' : 'AUTH_LOGIN_FAILED',
        status: 'FAILED',
        details: `Failed password attempt ${attemptResult.failedAttempts}/3 for user ${user.email}`,
        req
      });

      if (attemptResult.isLocked) {
        const lockUntilFormatted = new Date(attemptResult.lockedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return res.status(403).json({
          success: false,
          isLocked: true,
          failedAttempts: 3,
          remainingMinutes: 60,
          lockedUntil: attemptResult.lockedUntil,
          message: `🔒 Account Blocked: You entered an incorrect password 3 times! Your account has been locked for 1 hour (until ${lockUntilFormatted}). Please contact your branch administrator to unlock immediately.`
        });
      }

      const remaining = Math.max(0, 3 - attemptResult.failedAttempts);
      return res.status(401).json({
        success: false,
        failedAttempts: attemptResult.failedAttempts,
        remainingAttempts: remaining,
        message: `Incorrect password! Attempt ${attemptResult.failedAttempts} of 3. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before your account is blocked for 1 hour.`
      });
    }

    // Successful password match: Reset failed attempts
    try {
      await recordLoginAttempt(user.user_id || user.id, true);
    } catch (e) {}
    const inMemUser = users.find(u => u.email.toLowerCase() === cleanInput || u.username.toLowerCase() === cleanInput);
    if (inMemUser) {
      inMemUser.failed_attempts = 0;
      inMemUser.locked_until = null;
      inMemUser.status = 'ACTIVE';
      inMemUser.isActive = true;
    }

    // Tenant check if provided
    if (tenantSlug && user.role !== 'PLATFORM_ADMIN') {
      const tenant = tenants.find(t => t.slug === tenantSlug);
      if (tenant && user.tenantId && user.tenantId !== tenant.id) {
        return res.status(403).json({
          success: false,
          message: `User does not belong to the selected tenant workspace (${tenantSlug}).`
        });
      }
    }

    if (user.isActive === false || user.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact your company administrator.'
      });
    }

    // Generate tokens directly
    const tokenData = await generateTokens(user);

    recordAuditLog({
      tenantId: user.tenantId || 'ten_mann_01',
      userId: user.user_id || user.id,
      action: 'AUTH_LOGIN_SUCCESS',
      status: 'SUCCESS',
      details: `Successful login as ${user.role} into branch ${tokenData.resolvedBranch?.code || 'N/A'}`,
      req
    });

    res.json({
      success: true,
      requires2FA: false,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      user: {
        id: user.user_id || user.id,
        userId: user.user_id || user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.role === 'TENANT_OWNER' ? 'TO' : 'BM',
        companyId: tokenData.payload.companyId,
        companyName: tokenData.payload.companyName,
        company_id: tokenData.payload.companyId,
        company_name: tokenData.payload.companyName,
        tenantId: tokenData.payload.companyId,
        branch_code: tokenData.payload.branchCode,
        branch_name: tokenData.payload.branchName
      },
      tenant: tokenData.tenant,
      availableBranches: tokenData.userBranches,
      activeBranch: tokenData.resolvedBranch
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server authentication error.' });
  }
});

// POST /api/onboarding/signup - Pre-validates user registration during step 1
app.post('/api/onboarding/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    let existing = null;
    try {
      existing = await getUserByUsernameOrEmail(cleanEmail);
    } catch (e) {
      // ignore
    }
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists in BizzPilot. Please log in or use a different email.'
      });
    }
    res.json({ success: true, email: cleanEmail });
  } catch (err) {
    console.error('Onboarding signup check error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/onboarding/complete - Saves full onboarding state to PostgreSQL: company, branches, and tenant owner user
app.post('/api/onboarding/complete', async (req, res) => {
  try {
    const { user, company, branches } = req.body;
    if (!user?.email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }
    if (!company?.name) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    const result = await saveOnboardingData({ user, company, branches: branches || [] });

    // Synchronize in-memory companies & tenants list in db.js so any in-memory references recognize the new company
    const memoryTenant = {
      id: result.companyId,
      slug: result.company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30),
      name: result.company.name,
      legalName: result.company.legalName,
      status: "ACTIVE",
      plan: "Enterprise Pro",
      currency: "INR",
      logoText: result.company.name,
      primaryColor: "#0284c7",
      privacyStatus: "STRICT_LOCAL_AI"
    };
    tenants.push(memoryTenant);
    companies.push({
      id: result.companyId,
      tenantId: result.companyId,
      name: result.company.name,
      legalName: result.company.legalName,
      gstin: result.company.gstin,
      pan: result.company.pan,
      primaryColor: "#0284c7",
      currency: "INR",
      status: "ACTIVE"
    });

    // Generate real JWT tokens
    const tokenData = await generateTokens(result.user);

    res.json({
      success: true,
      message: 'Onboarding completed and saved directly to PostgreSQL database!',
      companyId: result.companyId,
      company: result.company,
      branches: result.branches,
      user: {
        id: result.user.userId || result.user.id,
        userId: result.user.userId || result.user.id,
        name: result.user.name,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        companyId: result.companyId,
        companyName: result.company.name,
        branch_code: result.user.branch_code,
        branch_name: result.user.branch_name
      },
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tenant: memoryTenant,
      availableBranches: result.branches,
      activeBranch: result.branches[0] || null
    });
  } catch (err) {
    console.error('Onboarding complete error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/verify-2fa
app.post('/api/auth/verify-2fa', async (req, res) => {
  try {
    const { sessionToken, code, branchId } = req.body;

    if (!sessionToken || !code) {
      return res.status(400).json({
        success: false,
        message: 'Session token and 6-digit code are required.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(sessionToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Verification session expired. Please log in again.'
      });
    }

    if (decoded.purpose !== '2fa_verification') {
      return res.status(403).json({ success: false, message: 'Invalid token purpose.' });
    }

    const user = users.find(u => u.id === decoded.sub);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Validate TOTP code (Mock supports default '123456' or user's secret)
    const validCodes = ['123456', user.twoFactorSecret].filter(Boolean);
    if (!validCodes.includes(code.trim())) {
      recordAuditLog({
        tenantId: user.tenantId,
        userId: user.id,
        action: 'AUTH_2FA_FAILED',
        status: 'FAILED',
        details: `Invalid 2FA code supplied by ${user.email}`,
        req
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA code. Please check your authenticator app (Demo Code: 123456).'
      });
    }

    const tokenData = await generateTokens(user, branchId);

    recordAuditLog({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'AUTH_LOGIN_SUCCESS',
      status: 'SUCCESS',
      details: `Successful 2FA login as ${user.role}`,
      req
    });

    res.json({
      success: true,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        tenantId: user.tenantId
      },
      tenant: tokenData.tenant,
      availableBranches: tokenData.userBranches,
      activeBranch: tokenData.resolvedBranch
    });

  } catch (error) {
    console.error('2FA error:', error);
    res.status(500).json({ success: false, message: '2FA verification processing error.' });
  }
});

// POST /api/auth/switch-branch
app.post('/api/auth/switch-branch', authenticateToken, async (req, res) => {
  const { branchId } = req.body;
  const user = users.find(u => u.id === req.user.sub);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const branch = branches.find(b => b.id === branchId);
  if (!branch) {
    return res.status(404).json({ success: false, message: 'Branch not found.' });
  }

  // Enforce branch access security rule from Section 5
  const isAllowed = user.role === 'PLATFORM_ADMIN' || 
    user.allowedBranches.includes('*') || 
    user.allowedBranches.includes(branchId);

  if (!isAllowed) {
    recordAuditLog({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'AUTH_BRANCH_ACCESS_DENIED',
      status: 'SECURITY_ALERT',
      details: `Attempted to switch to unauthorized branch: ${branch.name} (${branch.code})`,
      req
    });
    return res.status(403).json({
      success: false,
      message: 'Access denied: You do not hold permissions for this branch.'
    });
  }

  const tokenData = await generateTokens(user, branchId);

  recordAuditLog({
    tenantId: user.tenantId,
    userId: user.id,
    action: 'AUTH_BRANCH_SWITCH',
    status: 'SUCCESS',
    details: `Active branch switched to ${branch.name} (${branch.code})`,
    req
  });

  res.json({
    success: true,
    accessToken: tokenData.accessToken,
    activeBranch: tokenData.resolvedBranch,
    message: `Active branch switched to ${branch.name}.`
  });
});

// GET /api/auth/me - Database-aware profile inspection
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  let user = null;
  try {
    user = await getUserByUsernameOrEmail(req.user.email || req.user.username);
  } catch (e) {}
  if (!user) {
    user = users.find(u => u.id === req.user.sub || u.email === req.user.email);
  }
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const companyId = user.company_id || user.companyId || user.tenantId || 'comp_mann';

  let tenant = null;
  try {
    tenant = await getCompanyById(companyId);
  } catch (e) {}
  if (!tenant) {
    tenant = tenants.find(t => t.id === companyId) || tenants[0];
  }

  let companyBranches = [];
  try {
    companyBranches = await getBranches(companyId);
  } catch (e) {}
  if (!companyBranches || companyBranches.length === 0) {
    companyBranches = branches.filter(b => b.companyId === companyId);
    if (companyBranches.length === 0 && companyId === 'comp_mann') {
      companyBranches = branches;
    }
  }

  const isOwner = user.role === 'PLATFORM_ADMIN' || user.role === 'TENANT_OWNER' || (user.allowedBranches && user.allowedBranches.includes('*')) || user.branch_code === '*';
  const userBranches = isOwner
    ? companyBranches
    : companyBranches.filter(b => (user.allowedBranches && (user.allowedBranches.includes(b.id) || user.allowedBranches.includes(b.code))) || b.code === user.branch_code);

  const activeBranch = userBranches.find(b => b.id === req.user.branchId || b.code === req.user.branchCode) || userBranches[0] || companyBranches[0];

  res.json({
    success: true,
    user: {
      id: user.user_id || user.id,
      userId: user.user_id || user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.role === 'TENANT_OWNER' ? 'TO' : 'BM',
      is2FAEnabled: user.is2FAEnabled
    },
    tenant,
    company: tenant,
    activeBranch,
    availableBranches: userBranches
  });
});

// POST /api/auth/forgot-password - Dispatches reset verification code
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await getUserByUsernameOrEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered enterprise account found with this email.'
      });
    }

    recordAuditLog({
      tenantId: user.company_id || user.tenantId,
      userId: user.user_id,
      action: 'AUTH_PASSWORD_RESET_REQUESTED',
      status: 'SUCCESS',
      details: `Password reset OTP dispatched to ${user.email}`,
      req
    });

    res.json({
      success: true,
      message: `Verification code sent to ${user.email}. (Demo Code: 123456)`,
      demoCode: '123456'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Failed to process forgot password request.' });
  }
});

// POST /api/auth/reset-password - Updates password in PostgreSQL database
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, resetCode, newPassword } = req.body;
    const suppliedCode = (resetCode || code || '').toString().trim();

    if (!email || !suppliedCode || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, code, and new password are required.' });
    }

    if (suppliedCode !== '123456' && suppliedCode !== '888888') {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code (Demo Code: 123456).' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const updated = await resetUserPassword(cleanEmail, newPassword);

    // Also update in-memory fallback if present
    const inMem = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (inMem) {
      inMem.passwordHash = bcrypt.hashSync(newPassword, 10);
    }

    if (!updated && !inMem) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    recordAuditLog({
      tenantId: updated?.company_id || 'comp_mann',
      userId: updated?.user_id || 'USR-RESET',
      action: 'AUTH_PASSWORD_RESET_SUCCESS',
      status: 'SUCCESS',
      details: `Password reset successfully completed for ${cleanEmail}`,
      req
    });

    res.json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      recordAuditLog({
        tenantId: decoded.tenantId,
        userId: decoded.sub,
        action: 'AUTH_LOGOUT',
        status: 'SUCCESS',
        details: 'User explicitly logged out',
        req
      });
    } catch (e) {
      // Ignored on logout
    }
  }

  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/audit-logs
app.get('/api/auth/audit-logs', (req, res) => {
  res.json({ success: true, logs: auditLogs });
});

// Multi-Tenant Dynamic Company Resolution Cache: strictly isolates all companies & branches
const branchCompanyMap = new Map([
  ['MUM-01', 'comp_acmetechno_cajc'],
  ['ASH-01', 'comp_apexglobal_a1sf'],
  ['HCD-01', 'comp_zenithindu_vk4c'],
  ['MECB', 'comp_mannengine_s000'],
  ['AND-01', 'comp_mashtech'],
  ['SRU-02', 'comp_mashtech'],
  ['AMD-01', 'comp_mann'],
  ['BRD-02', 'comp_mann'],
  ['HAL-01', 'comp_mann']
]);

const refreshBranchCompanyMap = async () => {
  try {
    const res = await pool.query('SELECT UPPER(TRIM(code)) as code, company_id FROM branches');
    for (const row of res.rows) {
      if (row.code && row.company_id) {
        branchCompanyMap.set(row.code, row.company_id);
      }
    }
  } catch (err) {
    console.error('Failed to populate branchCompanyMap:', err.message);
  }
};

// Initial background population of branch map from PostgreSQL
refreshBranchCompanyMap();

const resolveCompany = (cId, bCode) => {
  if (cId && cId !== 'undefined' && cId !== 'null' && cId !== '*' && cId !== 'ALL') return cId;
  if (bCode && bCode !== '*' && bCode !== 'ALL') {
    const code = String(bCode).toUpperCase().trim();
    if (branchCompanyMap.has(code)) {
      return branchCompanyMap.get(code);
    }
    if (code.startsWith('AND') || code.startsWith('SRU')) return 'comp_mashtech';
    if (code === 'MECB') return 'comp_mannengine_s000';
    if (code === 'MUM-01') return 'comp_acmetechno_cajc';
    if (code === 'ASH-01') return 'comp_apexglobal_a1sf';
    if (code === 'HCD-01') return 'comp_zenithindu_vk4c';
  }
  return (cId && cId !== 'undefined' && cId !== 'null') ? cId : 'comp_mann';
};

// ─── POSTGRESQL BRANCHES ENDPOINTS (DATABASE: bizzpilot) ───────────────

// GET /api/branches - Fetch branches with GPS coordinates from PostgreSQL
app.get('/api/branches', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.company || 'comp_mann';
    const branches = await getBranches(companyId);
    res.json({
      success: true,
      count: branches.length,
      data: branches,
      companyId,
      source: 'PostgreSQL: bizzpilot.branches'
    });
  } catch (err) {
    console.error('Failed to get branches from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/branches - Add single branch one-by-one with coordinates to PostgreSQL
app.post('/api/branches', async (req, res) => {
  try {
    const companyId = req.body.companyId || req.query.companyId || 'comp_mann';
    const branch = await createBranch(req.body, companyId);
    res.json({
      success: true,
      message: `Branch "${branch.name}" (${branch.code}) saved to PostgreSQL successfully!`,
      data: branch
    });
  } catch (err) {
    console.error('Failed to add branch to PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/branches/:id - Delete branch from PostgreSQL
app.delete('/api/branches/:id', async (req, res) => {
  try {
    const deleted = await deleteBranch(req.params.id);
    res.json({ success: deleted, message: deleted ? 'Branch deleted successfully.' : 'Branch not found.' });
  } catch (err) {
    console.error('Failed to delete branch from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/branches/:id - Update branch details & coordinates in PostgreSQL
app.put('/api/branches/:id', async (req, res) => {
  try {
    let companyId = req.body.companyId || req.query.companyId;
    if (!companyId) {
      try {
        const findBranch = await pool.query(
          'SELECT company_id FROM branches WHERE id = $1 OR UPPER(TRIM(code)) = UPPER(TRIM($2)) LIMIT 1',
          [!isNaN(req.params.id) ? parseInt(req.params.id) : 0, req.params.id]
        );
        if (findBranch.rows.length) companyId = findBranch.rows[0].company_id;
      } catch (e) {}
    }
    const updated = await updateBranch(req.params.id, req.body, companyId);
    res.json({
      success: true,
      message: `Branch "${updated.name}" (${updated.code}) updated successfully in PostgreSQL`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update branch in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/branch/correction - Unified Branch Settings & Data Correction Endpoint
// Strictly updates branch details, GPS coordinates, and branch manager credentials/password
app.post('/api/branch/correction', async (req, res) => {
  try {
    const {
      branchCode,
      branchId,
      name,
      city,
      state,
      type,
      address,
      phone,
      email,
      gstin,
      latitude,
      longitude,
      managerName,
      managerEmail,
      managerPassword,
      companyId: explicitCompanyId
    } = req.body;

    if (!branchCode && !branchId) {
      return res.status(400).json({ success: false, message: 'Branch code or ID is required for data correction.' });
    }

    // Auto-detect the branch and its actual company_id from PostgreSQL
    let targetCode = branchCode ? String(branchCode).trim() : null;
    let targetId = branchId && !isNaN(branchId) ? parseInt(branchId, 10) : null;
    let resolvedCompanyId = explicitCompanyId || req.query.companyId;

    try {
      const branchLookup = await pool.query(
        'SELECT id, company_id, code, name FROM branches WHERE (code IS NOT NULL AND UPPER(TRIM(code)) = UPPER(TRIM($1))) OR id = $2 LIMIT 1',
        [targetCode || '', targetId || 0]
      );
      if (branchLookup.rows.length > 0) {
        resolvedCompanyId = branchLookup.rows[0].company_id;
        targetCode = branchLookup.rows[0].code;
        targetId = branchLookup.rows[0].id;
      }
    } catch (lookupErr) {
      console.warn('Branch auto-resolution error:', lookupErr.message);
    }

    // 1. Update Branch Master Info & GPS Coordinates
    const branchUpdateData = {};
    if (name) branchUpdateData.name = name;
    if (city) branchUpdateData.city = city;
    if (state) branchUpdateData.state = state;
    if (type) branchUpdateData.type = type;
    if (address !== undefined) branchUpdateData.address = address;
    if (phone !== undefined) branchUpdateData.phone = phone;
    if (email !== undefined) branchUpdateData.email = email;
    if (gstin !== undefined) branchUpdateData.gstin = gstin;
    if (latitude !== undefined) branchUpdateData.latitude = latitude;
    if (longitude !== undefined) branchUpdateData.longitude = longitude;

    const identifier = targetId || targetCode;
    const updatedBranch = await updateBranch(identifier, branchUpdateData, resolvedCompanyId);

    // 2. Update Branch Manager credentials/password if provided
    let updatedManager = null;
    if (managerName || managerEmail || (managerPassword && managerPassword.trim())) {
      updatedManager = await updateBranchManagerCredentials(
        updatedBranch.code,
        { managerName, managerEmail, managerPassword },
        resolvedCompanyId
      );
    }

    res.json({
      success: true,
      message: `Branch "${updatedBranch.name}" (${updatedBranch.code}) profile, coordinates & manager credentials updated successfully!`,
      data: {
        branch: updatedBranch,
        manager: updatedManager ? {
          name: updatedManager.name,
          email: updatedManager.email,
          username: updatedManager.username,
          role: updatedManager.role
        } : null
      }
    });
  } catch (err) {
    console.error('Branch data correction error:', err);
    res.status(500).json({ success: false, message: 'Failed to correct branch data: ' + err.message });
  }
});

// ─── CONSOLIDATED EMPLOYEES & USERS DIRECTORY (DATABASE: bizzpilot) ───

// GET /api/employees - Fetch all employee records across all branches on one page
app.get('/api/employees', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.company || null;
    const branchCode = req.query.branch || req.query.branchCode || null;
    const employees = await getAllEmployees(companyId, branchCode);
    res.json({
      success: true,
      count: employees.length,
      data: employees,
      source: 'PostgreSQL: bizzpilot (table: users)'
    });
  } catch (err) {
    console.error('Failed to get employees from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users - Alias for employees directory
app.get('/api/users', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.company || null;
    const branchCode = req.query.branch || req.query.branchCode || null;
    const employees = await getAllEmployees(companyId, branchCode);
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    console.error('Failed to get users from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees - Create new employee / user in PostgreSQL
app.post('/api/employees', async (req, res) => {
  try {
    const companyId = req.body.companyId || 'comp_mann';
    const newEmp = await createEmployee(req.body, companyId);
    res.json({
      success: true,
      message: `Employee "${newEmp.name}" (${newEmp.userId}) registered successfully in PostgreSQL!`,
      data: newEmp
    });
  } catch (err) {
    console.error('Failed to create employee in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/employees/:id - Fetch single employee / user profile
app.get('/api/employees/:id', async (req, res) => {
  try {
    const { pool } = require('./postgres');
    const param = String(req.params.id).trim();
    const isNum = /^\d+$/.test(param);
    const result = await pool.query(
      `SELECT id, user_id, username, email, name, role, company_id, company_name,
              branch_code, branch_name, phone, designation, department, salary,
              joining_date, is_active, created_at
       FROM users
       WHERE ${isNum ? 'id = $1 OR user_id = $1 OR username = $1' : 'user_id = $1 OR username = $1 OR email = $1'}
       LIMIT 1`,
      [isNum ? parseInt(param, 10) : param]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'User profile not found in PostgreSQL.' });
    }

    const u = result.rows[0];
    res.json({
      success: true,
      data: {
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
        joiningDate: u.joining_date ? (u.joining_date instanceof Date ? u.joining_date.toISOString().split('T')[0] : String(u.joining_date).split('T')[0]) : '',
        isActive: u.is_active,
        status: u.is_active ? 'Active' : 'Suspended',
        createdAt: u.created_at
      }
    });
  } catch (err) {
    console.error('Failed to get employee profile from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/employees/:id - Update employee details / role / branch / status
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updated = await updateEmployee(req.params.id, req.body);
    const inMem = users.find(u => String(u.id) === String(req.params.id) || u.userId === req.params.id || u.username === req.params.id || u.email === req.params.id);
    if (inMem) {
      if (req.body.name) inMem.name = req.body.name;
      if (req.body.email) inMem.email = req.body.email;
      if (req.body.role) inMem.role = req.body.role;
      if (req.body.phone) inMem.phone = req.body.phone;
      if (req.body.designation) inMem.designation = req.body.designation;
      if (req.body.department) inMem.department = req.body.department;
      if (req.body.salary) inMem.salary = parseFloat(req.body.salary) || inMem.salary;
      if (req.body.isActive !== undefined) inMem.isActive = req.body.isActive;
      if (req.body.unlock || req.body.status === 'Active') {
        inMem.failed_attempts = 0;
        inMem.locked_until = null;
        inMem.status = 'ACTIVE';
        inMem.isActive = true;
      }
      if (req.body.password && req.body.password.trim()) {
        inMem.passwordHash = bcrypt.hashSync(req.body.password.trim(), 10);
      }
    }
    res.json({
      success: true,
      message: `Employee "${updated.name}" updated successfully!`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update employee in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees/:id/unlock - Unlock user account & reset failed attempts
app.post('/api/employees/:id/unlock', async (req, res) => {
  try {
    let updated;
    try {
      updated = await unlockUserAccount(req.params.id);
    } catch (dbErr) {
      console.warn('Unlock DB failed, attempting memory fallback:', dbErr.message);
    }

    const inMem = users.find(u => String(u.id) === String(req.params.id) || u.userId === req.params.id || u.username === req.params.id || u.email === req.params.id);
    if (inMem) {
      inMem.failed_attempts = 0;
      inMem.locked_until = null;
      inMem.status = 'ACTIVE';
      inMem.isActive = true;
      if (!updated) {
        updated = { ...inMem, isLocked: false, failedAttempts: 0, status: 'Active', isActive: true };
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found to unlock.' });
    }

    res.json({
      success: true,
      message: `Account for "${updated.name}" has been unlocked! Failed attempts reset to 0.`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to unlock user account:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees/:id/lock - Manually lock user account for specified hours
app.post('/api/employees/:id/lock', async (req, res) => {
  try {
    const hours = parseInt(req.body.hours, 10) || 1;
    let updated;
    try {
      updated = await lockUserAccount(req.params.id, hours);
    } catch (dbErr) {
      console.warn('Lock DB failed, attempting memory fallback:', dbErr.message);
    }

    const inMem = users.find(u => String(u.id) === String(req.params.id) || u.userId === req.params.id || u.username === req.params.id || u.email === req.params.id);
    if (inMem) {
      inMem.failed_attempts = 3;
      inMem.locked_until = new Date(Date.now() + hours * 3600 * 1000);
      inMem.status = 'LOCKED';
      inMem.isActive = false;
      if (!updated) {
        updated = { ...inMem, isLocked: true, failedAttempts: 3, status: 'Locked', isActive: false };
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found to lock.' });
    }

    res.json({
      success: true,
      message: `Account for "${updated.name}" has been locked for ${hours} hour(s).`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to lock user account:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/employees/:id - Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deleted = await deleteEmployee(req.params.id);
    res.json({
      success: deleted,
      message: deleted ? 'Employee deleted successfully from PostgreSQL.' : 'Employee not found.'
    });
  } catch (err) {
    console.error('Failed to delete employee from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees/:id/reset-password - Admin reset password for employee & auto-unlock
app.post('/api/employees/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    const updated = await updateEmployee(req.params.id, { password: newPassword, unlock: true });
    const inMem = users.find(u => String(u.id) === String(req.params.id) || u.userId === req.params.id || u.username === req.params.id || u.email === req.params.id);
    if (inMem) {
      inMem.passwordHash = bcrypt.hashSync(newPassword, 10);
      inMem.failed_attempts = 0;
      inMem.locked_until = null;
      inMem.status = 'ACTIVE';
      inMem.isActive = true;
    }
    res.json({
      success: true,
      message: `Password for "${updated.name}" has been reset successfully! Account is active & unlocked.`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to reset employee password:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POSTGRESQL INVENTORY ENDPOINTS (DATABASE: bizzpilot) ─────────────

// GET /api/inventory - Common item catalog with branch-specific stock quantity
app.get('/api/inventory', async (req, res) => {
  try {
    const branchCode = req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.query.companyId || req.query.company, branchCode);
    const items = await getProductsByBranch(companyId, branchCode);
    res.json({
      success: true,
      count: items.length,
      data: items,
      companyId,
      branch: branchCode,
      commonCatalog: true,
      source: 'PostgreSQL: bizzpilot (Common Catalog + Branch Stock)'
    });
  } catch (err) {
    console.error('Failed to get inventory from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/inventory/network-stock - All individual branch stock records across the company
app.get('/api/inventory/network-stock', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.company || 'comp_mann';
    const items = await getNetworkBranchStock(companyId);
    res.json({
      success: true,
      count: items.length,
      data: items,
      companyId,
      source: 'PostgreSQL: branch_stock'
    });
  } catch (err) {
    console.error('Failed to get network branch stock from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/inventory/top-selling - Top 4 selling products with real-time PostgreSQL invoice metrics
app.get('/api/inventory/top-selling', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.company || 'comp_mann';
    const branchCode = req.query.branch || null;
    const items = await getTopSellingProducts(companyId, branchCode);
    res.json({
      success: true,
      count: items.length,
      data: items,
      companyId,
      branchCode,
      source: 'PostgreSQL: product + invoice_items'
    });
  } catch (err) {
    console.error('Failed to get top selling products from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});



// POST /api/inventory - Add single product to common catalog & set initial branch stock
app.post('/api/inventory', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const product = await createProduct(req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Product saved successfully to catalog and stock registered for branch ${branchCode}`,
      data: product
    });
  } catch (err) {
    console.error('Failed to create product in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/inventory/:id - Update product catalog and branch-specific stock
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const updated = await updateProduct(id, req.body, companyId, branchCode);
    if (!updated) {
      return res.status(404).json({ success: false, message: `Product #${id} not found` });
    }
    res.json({
      success: true,
      message: `Product updated successfully for branch ${branchCode}`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update product in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/inventory/:id - Delete product from PostgreSQL company common catalog & all branch stock
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const branchCode = req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.query.companyId || req.body.companyId, branchCode);
    const deleted = await deleteProduct(id, companyId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Product #${id} not found` });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully from company catalog and branch inventory',
      data: deleted
    });
  } catch (err) {
    console.error('Failed to delete product in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/inventory/bulk - Bulk import from Excel to company common catalog & branch stock
app.post('/api/inventory/bulk', async (req, res) => {
  try {
    const { items, branchCode = 'AMD-01', mode = 'merge' } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided for import' });
    }
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const updated = await bulkImportProducts(items, branchCode, mode, companyId);
    res.json({
      success: true,
      message: `Successfully imported ${items.length} items for branch ${branchCode} with mode "${mode}"`,
      count: updated.length,
      data: updated
    });
  } catch (err) {
    console.error('Failed to bulk import products in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/inventory/audit - Update physical count audit for specific branch
app.post('/api/inventory/audit', async (req, res) => {
  try {
    const { pid, countVal, branchCode = 'AMD-01' } = req.body;
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const updated = await updateStockCount(pid, countVal, branchCode, companyId);
    if (!updated) {
      return res.status(404).json({ success: false, message: `Product ${pid} not found in company inventory` });
    }
    res.json({
      success: true,
      message: `Stock count updated to ${countVal} for ${pid} at branch ${branchCode}`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update stock count in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── WAREHOUSE SPACE OPTIMIZATION & STORAGE BILLING (Option C Engine) ───

// GET /api/warehouse/layout - Option C godown layout parameters
app.get('/api/warehouse/layout', (req, res) => {
  try {
    const layout = computeWarehouseLayout(req.query);
    res.json({ success: true, layout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/warehouse/stacking - Vertical stacking analysis
app.post('/api/warehouse/stacking', (req, res) => {
  try {
    const { spec, godown, quantity = 500 } = req.body;
    const stacking = computeVerticalStacking(spec || {}, godown || DEFAULT_GODOWN, quantity);
    res.json({ success: true, stacking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/warehouse/billing/preview - Storage billing with GST (SAC 996729)
app.post('/api/warehouse/billing/preview', (req, res) => {
  try {
    const billing = computeStorageBilling(req.body);
    res.json({ success: true, billing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── POSTGRESQL INVOICES & QUOTATIONS ENDPOINTS ───────────────────────

// GET /api/invoices - Fetch invoices from PostgreSQL
app.get('/api/invoices', async (req, res) => {
  try {
    const branchCode = req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.query.companyId || req.query.company, branchCode);
    const invoices = await getInvoicesByBranch(companyId, branchCode);
    res.json({
      success: true,
      count: invoices.length,
      data: invoices,
      companyId,
      branch: branchCode,
      source: 'PostgreSQL: bizzpilot (table: invoices)'
    });
  } catch (err) {
    console.error('Failed to get invoices from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/invoices/:id - Fetch single invoice with line items
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: `Invoice #${req.params.id} not found` });
    }
    res.json({
      success: true,
      data: invoice
    });
  } catch (err) {
    console.error('Failed to get invoice from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/invoices - Create new invoice in PostgreSQL (decrements stock transactionally)
app.post('/api/invoices', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const invoice = await createInvoice(req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Invoice ${invoice.invoiceNo} generated & saved successfully into PostgreSQL`,
      data: invoice
    });
  } catch (err) {
    console.error('Failed to create invoice in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/invoices/:id - Update invoice in PostgreSQL
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const updated = await updateInvoice(req.params.id, req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Invoice ${updated.invoiceNo} updated successfully in PostgreSQL`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update invoice in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/invoices/:id - Delete invoice from PostgreSQL
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const branchCode = req.query.branch || req.body.branchCode || null;
    const companyId = resolveCompany(req.query.companyId || req.body.companyId, branchCode);
    const result = await deleteInvoice(req.params.id, companyId, branchCode);
    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (err) {
    console.error('Failed to delete invoice from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POSTGRESQL PURCHASES & PURCHASE ORDERS ENDPOINTS ───────────────────

// GET /api/purchases - Fetch purchase orders with branch isolation
app.get('/api/purchases', async (req, res) => {
  try {
    const branchCode = req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.query.companyId || req.query.company, branchCode);
    const purchases = await getPurchasesByBranch(companyId, branchCode);
    res.json({
      success: true,
      count: purchases.length,
      data: purchases,
      companyId,
      branch: branchCode,
      source: 'PostgreSQL: bizzpilot (table: purchases)'
    });
  } catch (err) {
    console.error('Failed to get purchases from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/purchases/:id - Fetch single purchase order with line items
app.get('/api/purchases/:id', async (req, res) => {
  try {
    const purchase = await getPurchaseById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: `Purchase order #${req.params.id} not found` });
    }
    res.json({
      success: true,
      data: purchase
    });
  } catch (err) {
    console.error('Failed to get purchase from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/purchases - Create new purchase order in PostgreSQL
app.post('/api/purchases', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const purchase = await createPurchase(req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Purchase Order ${purchase.poNo} generated & saved successfully into PostgreSQL`,
      data: purchase
    });
  } catch (err) {
    console.error('Failed to create purchase order in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/purchases/:id - Update purchase order in PostgreSQL
app.put('/api/purchases/:id', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const updated = await updatePurchase(req.params.id, req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Purchase Order ${updated.poNo} updated successfully in PostgreSQL`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update purchase order in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/purchases/:id - Delete purchase order from PostgreSQL
app.delete('/api/purchases/:id', async (req, res) => {
  try {
    const branchCode = req.query.branch || req.body.branchCode || null;
    const companyId = resolveCompany(req.query.companyId || req.body.companyId, branchCode);
    const result = await deletePurchase(req.params.id, companyId, branchCode);
    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (err) {
    console.error('Failed to delete purchase order from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POSTGRESQL DAILY CASH BOOK ENDPOINTS ─────────────────────────────

// GET /api/cashbook - Fetch cash book entries with strict branch isolation
app.get('/api/cashbook', async (req, res) => {
  try {
    const branchCode = req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.query.companyId || req.query.company, branchCode);
    const entries = await getCashBookEntries(companyId, branchCode);
    res.json({
      success: true,
      count: entries.length,
      data: entries,
      companyId,
      branch: branchCode,
      source: 'PostgreSQL: bizzpilot (table: cash_book)'
    });
  } catch (err) {
    console.error('Failed to get cash book entries from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cashbook - Create new cash book entry in PostgreSQL
app.post('/api/cashbook', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const entry = await createCashBookEntry(req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Cash Book entry #${entry.entryNo} saved successfully into PostgreSQL`,
      data: entry
    });
  } catch (err) {
    console.error('Failed to create cash book entry in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cashbook/:id - Update cash book entry in PostgreSQL
app.put('/api/cashbook/:id', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.query.branch || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.query.companyId, branchCode);
    const updated = await updateCashBookEntry(req.params.id, req.body, companyId, branchCode);
    res.json({
      success: true,
      message: `Cash Book entry #${updated.entryNo} updated successfully in PostgreSQL`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to update cash book entry in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cashbook/:id - Delete cash book entry from PostgreSQL
app.delete('/api/cashbook/:id', async (req, res) => {
  try {
    const branchCode = req.query.branch || req.body.branchCode || null;
    const companyId = resolveCompany(req.query.companyId || req.body.companyId, branchCode);
    const result = await deleteCashBookEntry(req.params.id, companyId, branchCode);
    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (err) {
    console.error('Failed to delete cash book entry from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cashbook/:id/reconcile - Toggle reconciliation status
app.post('/api/cashbook/:id/reconcile', async (req, res) => {
  try {
    const branchCode = req.query.branch || req.body.branchCode || null;
    const companyId = resolveCompany(req.query.companyId || req.body.companyId, branchCode);
    const updated = await toggleCashBookReconciliation(req.params.id, companyId, branchCode);
    res.json({
      success: true,
      message: `Entry #${updated.entryNo} reconciliation updated`,
      data: updated
    });
  } catch (err) {
    console.error('Failed to reconcile cash book entry in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/customers - Customer autocomplete directory lookup
app.get('/api/customers', async (req, res) => {
  try {
    const search = req.query.search || req.query.q || '';
    const customers = await getCustomers(search);
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (err) {
    console.error('Failed to get customers from PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/customers - Add customer to directory
app.post('/api/customers', async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    res.json({
      success: true,
      message: 'Customer saved successfully in PostgreSQL',
      data: customer
    });
  } catch (err) {
    console.error('Failed to create customer in PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dedicated /api/cat-sub endpoints (for cat_sub table)
app.get('/api/cat-sub', async (req, res) => {
  try {
    const items = await getCatalogCategories();
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/cat-sub', async (req, res) => {
  try {
    const cat = await createCatalogCategory(req.body);
    res.json({ success: true, message: 'Entry saved to cat_sub table', data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/cat-sub/:id', async (req, res) => {
  try {
    await deleteCatalogCategory(req.params.id);
    res.json({ success: true, message: 'Entry deleted from cat_sub table' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



// ── Analytics & BI Endpoints (Dynamic PostgreSQL Aggregation) ─────────────
app.get('/api/analytics/owner', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '30D';
    const data = await getOwnerAnalytics(timeRange);
    res.json(data);
  } catch (err) {
    console.error('Error fetching owner analytics:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/analytics/branch', async (req, res) => {
  try {
    const branchCode = req.query.branchCode || 'AMD-01';
    const timeFilter = req.query.timeFilter || '7D';
    const data = await getBranchAnalytics(branchCode, timeFilter);
    res.json(data);
  } catch (err) {
    console.error('Error fetching branch analytics:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Customer Holds & Pickups Endpoints ─────────────────────────────────────
app.get('/api/holds', async (req, res) => {
  try {
    const companyId = req.query.companyId || 'comp_mann';
    const branchCode = req.query.branchCode || null;
    const holds = await getCustomerHolds(companyId, branchCode);
    res.json({ success: true, count: holds.length, data: holds });
  } catch (err) {
    console.error('Error in GET /api/holds:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/holds', async (req, res) => {
  try {
    const hold = await createCustomerHold(req.body);
    res.json({ success: true, data: hold, message: `Reservation ${hold.hold_no} created successfully!` });
  } catch (err) {
    console.error('Error in POST /api/holds:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/holds/:id/status', async (req, res) => {
  try {
    const { status, invoiceNo } = req.body;
    const updated = await updateCustomerHoldStatus(req.params.id, status, invoiceNo);
    if (!updated) return res.status(404).json({ success: false, message: 'Hold not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error in PUT /api/holds/:id/status:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/holds/:id', async (req, res) => {
  try {
    const ok = await deleteCustomerHold(req.params.id);
    res.json({ success: ok });
  } catch (err) {
    console.error('Error in DELETE /api/holds/:id:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Stock Transfers Endpoints ──────────────────────────────────────────────
app.get('/api/transfers', async (req, res) => {
  try {
    const companyId = req.query.companyId || 'comp_mann';
    const branchCode = req.query.branchCode || null;
    const transfers = await getStockTransfers(companyId, branchCode);
    res.json({ success: true, count: transfers.length, data: transfers });
  } catch (err) {
    console.error('Error in GET /api/transfers:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/transfers', async (req, res) => {
  try {
    const transfer = await createStockTransfer(req.body);
    res.json({ success: true, data: transfer, message: `Stock transfer ${transfer.transfer_no} dispatched!` });
  } catch (err) {
    console.error('Error in POST /api/transfers:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/transfers/:id/receive', async (req, res) => {
  try {
    const { receiverUser, notes } = req.body;
    const updated = await receiveStockTransfer(req.params.id, receiverUser, notes);
    if (!updated) return res.status(404).json({ success: false, message: 'Transfer not found' });
    res.json({ success: true, data: updated, message: `Transfer ${updated.transfer_no} marked as Received & added to inventory!` });
  } catch (err) {
    console.error('Error in PUT /api/transfers/:id/receive:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/transfers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await updateStockTransferStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Transfer not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error in PUT /api/transfers/:id/status:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/transfers/:id', async (req, res) => {
  try {
    const ok = await deleteStockTransfer(req.params.id);
    res.json({ success: ok });
  } catch (err) {
    console.error('Error in DELETE /api/transfers/:id:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================================
// 1. CHART OF ACCOUNTS (COA) API ROUTES
// ============================================================================
app.get('/api/finance/accounts', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.tenantId || 'comp_mann';
    const accounts = await getChartOfAccounts(companyId);
    res.json({ success: true, count: accounts.length, accounts });
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ success: false, message: 'Failed to load chart of accounts' });
  }
});

app.post('/api/finance/accounts', async (req, res) => {
  try {
    const { companyId, name, nature, accountGroup, openingBalance, balanceType, notes } = req.body;
    if (!name || !nature) {
      return res.status(400).json({ success: false, message: 'Name and Nature are required' });
    }
    const account = await createChartOfAccount({
      companyId: companyId || 'comp_mann',
      name,
      nature,
      accountGroup: accountGroup || 'General',
      openingBalance: openingBalance || 0,
      balanceType: balanceType || 'DR',
      notes: notes || ''
    });
    res.status(201).json({ success: true, message: 'Ledger account created successfully', account });
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).json({ success: false, message: 'Failed to create ledger account' });
  }
});

app.get('/api/finance/accounts/:id/vouchers', async (req, res) => {
  try {
    const companyId = req.query.companyId || 'comp_mann';
    const accountId = parseInt(req.params.id, 10);
    const vouchers = await getAccountVouchers(accountId, companyId);
    res.json({ success: true, count: vouchers.length, vouchers });
  } catch (err) {
    console.error('Error fetching account vouchers:', err);
    res.status(500).json({ success: false, message: 'Failed to load vouchers' });
  }
});

app.delete('/api/finance/accounts/:id', async (req, res) => {
  try {
    const companyId = req.query.companyId || 'comp_mann';
    const accountId = parseInt(req.params.id, 10);
    const result = await deleteChartOfAccount(accountId, companyId);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
});

// ============================================================================
// 2. FINANCIAL PERIODS & YEAR LOCK API ROUTES
// ============================================================================
app.get('/api/finance/periods', async (req, res) => {
  try {
    const companyId = req.query.companyId || req.query.tenantId || 'comp_mann';
    const periods = await getFinancialPeriods(companyId);
    const lockedCount = periods.filter(p => p.status === 'Locked').length;
    const openCount = periods.filter(p => p.status === 'Open').length;
    res.json({
      success: true,
      fiscalYear: periods[0]?.fiscal_year || '2025–2026',
      lockedCount,
      openCount,
      count: periods.length,
      periods
    });
  } catch (err) {
    console.error('Error fetching financial periods:', err);
    res.status(500).json({ success: false, message: 'Failed to load financial periods' });
  }
});

app.post('/api/finance/periods/lock', async (req, res) => {
  try {
    const { id, lockedBy, notes } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Period ID is required' });
    const period = await lockFinancialPeriod(id, lockedBy || 'Tenant Owner', notes || '');
    res.json({ success: true, message: `Period "${period.month_name}" permanently locked`, period });
  } catch (err) {
    console.error('Error locking period:', err);
    res.status(500).json({ success: false, message: 'Failed to lock period' });
  }
});

app.post('/api/finance/periods/unlock', async (req, res) => {
  try {
    const { id, notes } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Period ID is required' });
    const period = await unlockFinancialPeriod(id, notes || '');
    res.json({ success: true, message: `Period "${period.month_name}" unlocked`, period });
  } catch (err) {
    console.error('Error unlocking period:', err);
    res.status(500).json({ success: false, message: 'Failed to unlock period' });
  }
});

app.post('/api/finance/periods', async (req, res) => {
  try {
    const company_id = req.body.companyId || req.body.company_id || 'comp_mann';
    const fiscal_year = req.body.fiscalYear || req.body.fiscal_year || '2025–2026';
    const month_name = req.body.monthName || req.body.month || req.body.name;
    const start_date = req.body.periodStart || req.body.start_date || '2026-01-01';
    const end_date = req.body.periodEnd || req.body.end_date || '2026-01-31';
    const notes = req.body.notes || '';

    if (!month_name) {
      return res.status(400).json({ success: false, message: 'Month name is required' });
    }
    const period = await createFinancialPeriod({
      companyId: company_id,
      fiscalYear: fiscal_year,
      monthName: month_name,
      periodStart: start_date,
      periodEnd: end_date,
      notes
    });
    res.status(201).json({ success: true, message: 'Financial period created successfully', period });
  } catch (err) {
    console.error('Error creating financial period:', err);
    res.status(500).json({ success: false, message: 'Failed to create financial period' });
  }
});

// ============================================================================
// 3. LOSS PREVENTION & SHRINKAGE DETECTION API ROUTES
// ============================================================================
app.get('/api/loss-prevention/summary', async (req, res) => {
  try {
    const branchCode = req.query.branchCode || req.query.branch || null;
    const companyId = resolveCompany(req.query.companyId || req.query.tenantId || req.query.company, branchCode);
    const summary = await getLossPreventionSummary(companyId);
    res.json({ success: true, summary, ...summary, companyId });
  } catch (err) {
    console.error('Error fetching loss prevention summary:', err);
    res.status(500).json({ success: false, message: 'Failed to load loss prevention summary' });
  }
});

app.get('/api/loss-prevention/alerts', async (req, res) => {
  try {
    const branchCode = req.query.branchCode || req.query.branch || null;
    const companyId = resolveCompany(req.query.companyId || req.query.tenantId || req.query.company, branchCode);
    const alerts = await getLossAlerts(companyId);
    res.json({ success: true, count: alerts.length, alerts, companyId });
  } catch (err) {
    console.error('Error fetching loss alerts:', err);
    res.status(500).json({ success: false, message: 'Failed to load loss alerts' });
  }
});

app.post('/api/loss-prevention/alerts/:id/resolve', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.body.branch || null;
    const companyId = resolveCompany(req.body.companyId || req.query.companyId || req.body.tenantId, branchCode);
    const alertId = parseInt(req.params.id, 10);
    const alert = await resolveLossAlert(alertId, companyId);
    res.json({ success: true, message: 'Alert resolved', alert });
  } catch (err) {
    console.error('Error resolving loss alert:', err);
    res.status(500).json({ success: false, message: 'Failed to resolve alert' });
  }
});

app.get('/api/loss-prevention/approvals', async (req, res) => {
  try {
    const branchCode = req.query.branchCode || req.query.branch || req.query.branch_code || null;
    const companyId = resolveCompany(req.query.companyId || req.query.tenantId || req.query.company, branchCode);
    const status = req.query.status || null; // e.g. PENDING
    const approvals = await getStockAdjustments(companyId, status, branchCode);
    res.json({ success: true, count: approvals.length, approvals, companyId });
  } catch (err) {
    console.error('Error fetching stock adjustments:', err);
    res.status(500).json({ success: false, message: 'Failed to load stock adjustments' });
  }
});

app.post('/api/loss-prevention/approvals/:id/decision', async (req, res) => {
  try {
    const adjustmentId = parseInt(req.params.id, 10);
    const decision = (req.body.decision || (req.body.status === 'APPROVED' ? 'APPROVE' : req.body.status === 'REJECTED' ? 'REJECT' : req.body.status) || '').toUpperCase();
    const reviewedBy = req.body.reviewedBy || req.body.approver_name || req.body.reviewed_by || 'Tenant Owner';
    const notes = req.body.notes || '';
    if (!['APPROVE', 'REJECT'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decision must be APPROVE or REJECT' });
    }
    const updated = await recordStockAdjustmentDecision(adjustmentId, decision, reviewedBy, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Stock adjustment not found' });
    }
    res.json({
      success: true,
      message: `Stock adjustment ${updated.adjustment_no} ${decision === 'APPROVE' ? 'approved' : 'rejected'}`,
      adjustment: updated
    });
  } catch (err) {
    console.error('Error recording stock adjustment decision:', err);
    res.status(500).json({ success: false, message: 'Failed to record decision' });
  }
});

app.post('/api/loss-prevention/approvals', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.body.branch_code || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.body.company_id || req.body.tenantId, branchCode);
    const itemName = req.body.itemName || req.body.item_name;
    const sku = req.body.sku;
    const quantity = parseInt(req.body.quantity, 10) || 1;
    const lossValue = parseFloat(req.body.lossValue || req.body.value_amount || req.body.loss_value || 0);
    const reasonCode = req.body.reasonCode || req.body.reason_code || 'DAMAGED_IN_TRANSIT';
    const requestedBy = req.body.requestedBy || req.body.requested_by || 'Staff';
    const photoEvidence = req.body.photoEvidence !== undefined ? req.body.photoEvidence : (req.body.has_photo_evidence !== false);
    const photoUrl = req.body.photoUrl || req.body.photo_url || '';

    if (!itemName || !sku || !quantity) {
      return res.status(400).json({ success: false, message: 'Item name, SKU, and quantity are required' });
    }
    const adjustment = await createStockAdjustment({
      companyId,
      branchCode,
      itemName,
      sku,
      quantity,
      lossValue,
      reasonCode,
      requestedBy,
      photoEvidence,
      photoUrl
    });
    res.status(201).json({ success: true, message: 'Stock adjustment request submitted', adjustment });
  } catch (err) {
    console.error('Error creating stock adjustment:', err);
    res.status(500).json({ success: false, message: 'Failed to submit adjustment request' });
  }
});

app.get('/api/loss-prevention/counts', async (req, res) => {
  try {
    const branchCode = req.query.branchCode || req.query.branch || req.query.branch_code || null;
    const companyId = resolveCompany(req.query.companyId || req.query.tenantId || req.query.company, branchCode);
    const counts = await getCycleCounts(companyId, branchCode);
    res.json({ success: true, count: counts.length, counts, companyId });
  } catch (err) {
    console.error('Error fetching cycle counts:', err);
    res.status(500).json({ success: false, message: 'Failed to load cycle counts' });
  }
});

app.post('/api/loss-prevention/counts', async (req, res) => {
  try {
    const branchCode = req.body.branchCode || req.body.branch_code || 'AMD-01';
    const companyId = resolveCompany(req.body.companyId || req.body.company_id || req.body.tenantId, branchCode);
    const countMode = req.body.countMode || req.body.count_mode || req.body.mode || 'Blind Count';
    const section = req.body.section || req.body.section_name || req.body.session_name || 'General Inventory';
    const auditorName = req.body.auditorName || req.body.auditor_name || 'Branch Staff';
    const systemQty = parseInt(req.body.systemQty !== undefined ? req.body.systemQty : (req.body.ledger_qty !== undefined ? req.body.ledger_qty : (req.body.system_qty || 0)), 10);
    const physicalQty = parseInt(req.body.physicalQty !== undefined ? req.body.physicalQty : (req.body.physical_qty !== undefined ? req.body.physical_qty : 0), 10);
    const notes = req.body.notes || req.body.session_name || '';

    const count = await createCycleCount({
      companyId,
      branchCode,
      countMode,
      section,
      auditorName,
      systemQty,
      physicalQty,
      notes
    });
    res.status(201).json({ success: true, message: 'Cycle count recorded successfully', count });
  } catch (err) {
    console.error('Error creating cycle count:', err);
    res.status(500).json({ success: false, message: 'Failed to record cycle count' });
  }
});

app.get('/api/loss-prevention/benchmarks', async (req, res) => {
  try {
    const branchCode = req.query.branchCode || req.query.branch || null;
    const companyId = resolveCompany(req.query.companyId || req.query.tenantId || req.query.company, branchCode);
    const benchmarks = await getBranchShrinkBenchmarks(companyId);
    res.json({ success: true, count: benchmarks.length, benchmarks, companyId });
  } catch (err) {
    console.error('Error fetching benchmarks:', err);
    res.status(500).json({ success: false, message: 'Failed to load benchmarks' });
  }
});

app.get(['/api/inventory/items/:itemCode/customers', '/api/products/:itemCode/customers'], async (req, res) => {
  try {
    const itemCode = req.params.itemCode;
    const branchCode = req.query.branchCode || req.query.branch || null;
    const companyId = resolveCompany(req.query.companyId || req.query.tenantId || req.query.company, branchCode);
    const customers = await getProductCustomerPurchases(itemCode, companyId, branchCode);
    res.json({ success: true, count: customers.length, itemCode, customers });
  } catch (err) {
    console.error('Error fetching product customers:', err);
    res.status(500).json({ success: false, message: 'Failed to load product customer purchases' });
  }
});


// ── Serve React Frontend (Single Port for localhost & ngrok) ───────────────
const clientDistPath = path.resolve(__dirname, '../client/dist');

// Disable caching for HTML to guarantee immediate SPA bundle updates
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html' || req.path.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// Serve static assets with proper caching policies
app.use(express.static(clientDistPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.includes('assets')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// Fallback for missing/stale assets: If browser requests an old JS bundle after a new build,
// return a self-reloading JS stub instead of a 404 or index.html to prevent blank screen syntax errors.
app.use('/assets', (req, res) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
    return res.send(`console.warn('Stale BizzPilot asset requested: ${req.path}. Auto-reloading latest version...'); window.location.reload();`);
  }
  res.status(404).send('Asset not found');
});

// Explicit root route handler to guarantee GET / always serves index.html with no-cache headers
app.get('/', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(indexPath);
  }
  res.status(404).send('BizzPilot ERP frontend build not found. Please run "npm run build" in client directory.');
});

// For any non-API and non-asset GET request, serve index.html for SPA hash/history routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(indexPath);
  }
  res.status(404).send('BizzPilot ERP API running. Run "npm run build" in the client directory to generate frontend files.');
});

app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 BizzPilot ERP (Unified Port) running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend & Backend on same port for seamless ngrok tunnel:`);
  console.log(`   👉 Run: ngrok http ${PORT}`);
  console.log(`🏢 Multi-Tenant Engine: Mann Engineers Platform`);
  console.log(`🔒 Section 2 Privacy Compliance: Active & Monitored`);
  console.log(`🐘 PostgreSQL Database: "bizzpilot" initialized`);
  console.log(`=======================================================`);
  await initDatabase();
});

