// Database matching Multi-Tenant Franchise ERP Specifications
// Scalable to 10,000+ companies with strict company and branch isolation

const bcrypt = require('bcryptjs');

const hash = (pwd) => bcrypt.hashSync(pwd, 10);

const companies = [
  {
    id: "comp_mann",
    tenantId: "comp_mann",
    name: "Mann Engineers Fire Safety",
    legalName: "Mann Engineers Fire Safety Pvt Ltd",
    gstin: "24AABCM8921K1ZK",
    pan: "AABCM8921K",
    primaryColor: "#0284c7",
    currency: "INR",
    status: "ACTIVE"
  },
  {
    id: "comp_mashtech",
    tenantId: "comp_mashtech",
    name: "Mash Tech",
    legalName: "Mash Tech Solutions Pvt Ltd",
    gstin: "24AABCM9988T1Z9",
    pan: "AABCM9988T",
    primaryColor: "#8b5cf6",
    currency: "INR",
    status: "ACTIVE"
  }
];

const tenants = companies.map(c => ({
  id: c.id,
  slug: c.id === 'comp_mann' ? 'mann-engineers' : 'mash-tech',
  name: c.name,
  legalName: c.legalName,
  status: "ACTIVE",
  plan: "Enterprise Pro",
  currency: "INR",
  logoText: c.id === 'comp_mann' ? 'Mann Engineers' : 'Mash Tech',
  primaryColor: c.primaryColor,
  privacyStatus: "STRICT_LOCAL_AI"
}));

const branches = [
  // Mann Engineers Fire Safety branches
  {
    id: "br_mann_amd",
    companyId: "comp_mann",
    code: "AMD-01",
    name: "Amd-Branch (Ahmedabad)",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "CENTRAL_HUB",
    isPrimary: true
  },
  {
    id: "br_mann_brd",
    companyId: "comp_mann",
    code: "BRD-02",
    name: "Brd-Branch (Baroda)",
    city: "Vadodara",
    state: "Gujarat",
    type: "BRANCH_OFFICE",
    isPrimary: false
  },
  // Mash Tech branches
  {
    id: "br_mash_and",
    companyId: "comp_mashtech",
    code: "AND-01",
    name: "And-Branch (Anand)",
    city: "Anand",
    state: "Gujarat",
    type: "TECH_CENTRE",
    isPrimary: true
  },
  {
    id: "br_mash_sru",
    companyId: "comp_mashtech",
    code: "SRU-02",
    name: "Sru-Branch (Surat)",
    city: "Surat",
    state: "Gujarat",
    type: "BRANCH_DEPOT",
    isPrimary: false
  }
];

// Enterprise Users for demo data
const users = [
  // ── Mann Engineers Fire Safety ──
  {
    id: "usr_mann_admin",
    userId: "USR-MANN-ADMIN",
    email: "admin@a.1.com",
    username: "admin_mann",
    passwordHash: hash("Pass@123"),
    name: "Mann Engineers Admin",
    role: "TENANT_OWNER",
    companyId: "comp_mann",
    companyName: "Mann Engineers Fire Safety",
    tenantId: "comp_mann",
    allowedBranches: ["*"],
    branch_code: "*",
    branch_name: "All Branches (Master HQ)",
    isActive: true
  },
  {
    id: "usr_mann_amd",
    userId: "USR-MANN-AMD",
    email: "branch@b.1.com",
    username: "amd_branch",
    passwordHash: hash("Pass@123"),
    name: "Amd-Branch Manager",
    role: "BRANCH_MANAGER",
    companyId: "comp_mann",
    companyName: "Mann Engineers Fire Safety",
    tenantId: "comp_mann",
    allowedBranches: ["br_mann_amd"],
    branch_code: "AMD-01",
    branch_name: "Amd-Branch (Ahmedabad)",
    isActive: true
  },
  {
    id: "usr_mann_brd",
    userId: "USR-MANN-BRD",
    email: "branch@b.2.com",
    username: "brd_branch",
    passwordHash: hash("Pass@123"),
    name: "Brd-Branch Manager",
    role: "BRANCH_MANAGER",
    companyId: "comp_mann",
    companyName: "Mann Engineers Fire Safety",
    tenantId: "comp_mann",
    allowedBranches: ["br_mann_brd"],
    branch_code: "BRD-02",
    branch_name: "Brd-Branch (Baroda)",
    isActive: true
  },

  // ── Mash Tech ──
  {
    id: "usr_mash_admin",
    userId: "USR-MASH-ADMIN",
    email: "admin@a.2.com",
    username: "admin_mash",
    passwordHash: hash("Pass@123"),
    name: "Mash Tech Admin",
    role: "TENANT_OWNER",
    companyId: "comp_mashtech",
    companyName: "Mash Tech",
    tenantId: "comp_mashtech",
    allowedBranches: ["*"],
    branch_code: "*",
    branch_name: "All Branches (Tech HQ)",
    isActive: true
  },
  {
    id: "usr_mash_and",
    userId: "USR-MASH-AND",
    email: "branch@b.3.com",
    username: "and_branch",
    passwordHash: hash("Pass@123"),
    name: "And-Branch Manager",
    role: "BRANCH_MANAGER",
    companyId: "comp_mashtech",
    companyName: "Mash Tech",
    tenantId: "comp_mashtech",
    allowedBranches: ["br_mash_and"],
    branch_code: "AND-01",
    branch_name: "And-Branch (Anand)",
    isActive: true
  },
  {
    id: "usr_mash_sru",
    userId: "USR-MASH-SRU",
    email: "branch@b.4.com",
    username: "sru_branch",
    passwordHash: hash("Pass@123"),
    name: "Sru-Branch Manager",
    role: "BRANCH_MANAGER",
    companyId: "comp_mashtech",
    companyName: "Mash Tech",
    tenantId: "comp_mashtech",
    allowedBranches: ["br_mash_sru"],
    branch_code: "SRU-02",
    branch_name: "Sru-Branch (Surat)",
    isActive: true
  }
];

const auditLogs = [];

module.exports = {
  tenants,
  companies,
  branches,
  users,
  auditLogs
};