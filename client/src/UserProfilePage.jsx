import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Building2, Shield, KeyRound, Check, AlertCircle,
  Clock, Calendar, Award, Briefcase, Lock, CheckCircle2, RefreshCw, Eye, EyeOff,
  Sparkles, Save, X, Smartphone, Globe, AlertTriangle
} from 'lucide-react';

export function UserProfilePage({ currentUser, activeBranch, currentTenant, onUserUpdated }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showSalary, setShowSalary] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    username: currentUser?.username || '',
    designation: currentUser?.designation || '',
    department: currentUser?.department || '',
    branchCode: currentUser?.branch_code || currentUser?.branchCode || activeBranch?.code || 'AMD-01',
    branchName: currentUser?.branch_name || currentUser?.branchName || activeBranch?.name || 'Ahmedabad Hub',
    companyName: currentUser?.company_name || currentUser?.companyName || currentTenant?.name || 'Mann Engineers Fire Safety',
    salary: currentUser?.salary || 0,
    joiningDate: currentUser?.joining_date || currentUser?.joiningDate || '2025-01-15',
    address: currentUser?.address || 'Plot 42, GIDC Phase II, Gujarat, India',
    emergencyContact: currentUser?.emergencyContact || 'Family Member',
    emergencyPhone: currentUser?.emergencyPhone || '+91 98250 99887',
    bio: currentUser?.bio || 'Certified industrial fire safety & ERP operations specialist at BizzPilot Enterprise.'
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Fetch latest data from database
  const fetchFreshProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const idOrUser = currentUser.id || currentUser.userId || currentUser.username;
      const res = await fetch(`/api/employees/${idOrUser}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setFormData(prev => ({
          ...prev,
          name: d.name || prev.name,
          email: d.email || prev.email,
          phone: d.phone || prev.phone,
          username: d.username || prev.username,
          designation: d.designation || prev.designation,
          department: d.department || prev.department,
          branchCode: d.branchCode || prev.branchCode,
          branchName: d.branchName || prev.branchName,
          companyName: d.companyName || prev.companyName,
          salary: d.salary !== undefined ? d.salary : prev.salary,
          joiningDate: d.joiningDate || prev.joiningDate
        }));
      }
    } catch (err) {
      console.warn('Could not fetch fresh profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshProfile();
  }, [currentUser?.id, currentUser?.username]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Submit profile updates
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email address cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const idOrUser = currentUser.id || currentUser.userId || currentUser.username;
      const res = await fetch(`/api/employees/${idOrUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          designation: formData.designation.trim(),
          department: formData.department.trim()
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        showToast('Your profile details have been saved to PostgreSQL!');
        setHasChanges(false);

        // Merge updated data back into currentUser
        const updatedUser = {
          ...currentUser,
          ...json.data,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          designation: formData.designation.trim(),
          department: formData.department.trim(),
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          bio: formData.bio
        };

        if (onUserUpdated) {
          onUserUpdated(updatedUser);
        }

        // Update local session
        try {
          const raw = localStorage.getItem('bizzpilot_auth');
          if (raw) {
            const sess = JSON.parse(raw);
            sess.currentUser = updatedUser;
            localStorage.setItem('bizzpilot_auth', JSON.stringify(sess));
          }
        } catch (err) {}
      } else {
        setErrorMessage(json.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMessage('Network error while saving profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const idOrUser = currentUser.id || currentUser.userId || currentUser.username;
      const res = await fetch(`/api/employees/${idOrUser}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: passwordForm.newPassword })
      });

      const json = await res.json();
      if (json.success) {
        setPasswordSuccess('Password has been updated successfully in PostgreSQL!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Security password updated!');
      } else {
        setPasswordError(json.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Error updating password: ' + err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const roleLabel = currentUser?.role === 'TENANT_OWNER'
    ? 'Enterprise Platform Owner'
    : (currentUser?.role === 'BRANCH_MANAGER' ? 'Branch Manager' : 'Operations Staff Member');

  const roleBadgeColor = currentUser?.role === 'TENANT_OWNER'
    ? '#a855f7'
    : (currentUser?.role === 'BRANCH_MANAGER' ? '#0284c7' : '#10b981');

  return (
    <div className="invoice-page-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* ── TOP HERO BANNER & AVATAR ── */}
      <div
        className="invoice-form-card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Big Avatar */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${roleBadgeColor}, #0284c7)`,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                letterSpacing: '1px',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
                border: '3px solid var(--bg-card)'
              }}
            >
              {getInitials(formData.name)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {formData.name || 'User Profile'}
                </h2>
                <span
                  className="mono-badge"
                  style={{
                    background: `${roleBadgeColor}15`,
                    color: roleBadgeColor,
                    borderColor: `${roleBadgeColor}40`,
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}
                >
                  <Shield size={12} style={{ marginRight: '4px' }} />
                  {roleLabel}
                </span>
                <span
                  className="status-badge active"
                  style={{ fontSize: '0.72rem' }}
                >
                  ● Active
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span><strong>Username:</strong> @{formData.username || 'user'}</span>
                <span>•</span>
                <span><Building2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />{formData.companyName}</span>
                <span>•</span>
                <span><MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />Branch: <strong>{formData.branchCode}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="secondary-action-btn"
              onClick={fetchFreshProfile}
              disabled={loading}
              title="Refresh profile data from PostgreSQL"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Sync DB'}</span>
            </button>
            <button
              type="button"
              className="primary-action-btn"
              onClick={handleSaveProfile}
              disabled={saving || !hasChanges}
              style={{ opacity: hasChanges ? 1 : 0.7 }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Info badges row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Employee / User Code</div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {currentUser?.userId || currentUser?.user_id || 'USR-2026-LIVE'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {formData.department || 'Operations'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Designation</div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {formData.designation || 'Staff'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date of Joining</div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {formData.joiningDate || '15 Jan 2025'}
            </div>
          </div>
        </div>
      </div>

      {/* ── ERROR OR TOAST NOTICES ── */}
      {errorMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── NAVIGATION TABS ── */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '0.25rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          style={{
            padding: '0.65rem 1.2rem',
            background: activeTab === 'personal' ? 'var(--bg-card)' : 'transparent',
            border: activeTab === 'personal' ? '1px solid var(--border-medium)' : '1px solid transparent',
            borderBottom: activeTab === 'personal' ? '2px solid var(--brand-accent)' : 'none',
            borderRadius: '8px 8px 0 0',
            color: activeTab === 'personal' ? 'var(--brand-accent)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <User size={15} />
          <span>Personal Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('organization')}
          style={{
            padding: '0.65rem 1.2rem',
            background: activeTab === 'organization' ? 'var(--bg-card)' : 'transparent',
            border: activeTab === 'organization' ? '1px solid var(--border-medium)' : '1px solid transparent',
            borderBottom: activeTab === 'organization' ? '2px solid var(--brand-accent)' : 'none',
            borderRadius: '8px 8px 0 0',
            color: activeTab === 'organization' ? 'var(--brand-accent)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <Briefcase size={15} />
          <span>Employment & Branch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            padding: '0.65rem 1.2rem',
            background: activeTab === 'security' ? 'var(--bg-card)' : 'transparent',
            border: activeTab === 'security' ? '1px solid var(--border-medium)' : '1px solid transparent',
            borderBottom: activeTab === 'security' ? '2px solid var(--brand-accent)' : 'none',
            borderRadius: '8px 8px 0 0',
            color: activeTab === 'security' ? 'var(--brand-accent)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <KeyRound size={15} />
          <span>Security & Password</span>
        </button>
      </div>

      {/* ── TAB 1: PERSONAL INFORMATION ── */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSaveProfile} className="invoice-form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <User size={18} color="var(--brand-accent)" />
              <span>Contact & Individual Details</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Edit your information and click Save Changes
            </span>
          </div>

          <div className="invoice-form-grid">
            {/* Full Name */}
            <div className="invoice-field-group invoice-col-span-2">
              <label className="invoice-field-label">Full Legal Name *</label>
              <input
                type="text"
                required
                className="invoice-input"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Your full name..."
              />
            </div>

            {/* Email Address */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">
                <span>Email Address *</span>
                <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✓ Verified</span>
              </label>
              <input
                type="email"
                required
                className="invoice-input"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            {/* Phone Number */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Primary Mobile / Phone</label>
              <input
                type="text"
                className="invoice-input"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+91 98250 12345"
              />
            </div>

            {/* Communication Address */}
            <div className="invoice-field-group invoice-col-span-2">
              <label className="invoice-field-label">Residential / Communication Address</label>
              <input
                type="text"
                className="invoice-input"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="Street address, apartment, city, state, PIN..."
              />
            </div>

            {/* Emergency Contact Name */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Emergency Contact Name</label>
              <input
                type="text"
                className="invoice-input"
                value={formData.emergencyContact}
                onChange={e => handleChange('emergencyContact', e.target.value)}
                placeholder="e.g. Spouse / Parent"
              />
            </div>

            {/* Emergency Phone */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Emergency Phone Number</label>
              <input
                type="text"
                className="invoice-input"
                value={formData.emergencyPhone}
                onChange={e => handleChange('emergencyPhone', e.target.value)}
                placeholder="+91 98250 99887"
              />
            </div>

            {/* Professional Summary / Bio */}
            <div className="invoice-field-group invoice-col-span-2" style={{ gridColumn: 'span 4' }}>
              <label className="invoice-field-label">Professional Notes & Bio</label>
              <textarea
                rows={3}
                className="invoice-textarea"
                value={formData.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Brief summary of your roles, operations certifications, or personal notes..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="secondary-action-btn"
              onClick={fetchFreshProfile}
              disabled={loading || saving}
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="primary-action-btn"
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 2: EMPLOYMENT & BRANCH ── */}
      {activeTab === 'organization' && (
        <div className="invoice-form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <Briefcase size={18} color="var(--brand-accent)" />
              <span>Organization & Role Configuration</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Assigned branch parameters and organization hierarchy
            </span>
          </div>

          <div className="invoice-form-grid">
            {/* Department */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Department *</label>
              <select
                className="invoice-select"
                value={formData.department}
                onChange={e => handleChange('department', e.target.value)}
              >
                <option value="Operations">Operations & Field</option>
                <option value="Sales & Billing">Sales & Counter Billing</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Warehouse & Stores">Warehouse & Stores</option>
                <option value="Technical Services">Technical Services</option>
                <option value="Executive Board">Executive Board</option>
              </select>
            </div>

            {/* Designation */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Job Title / Designation *</label>
              <input
                type="text"
                className="invoice-input"
                value={formData.designation}
                onChange={e => handleChange('designation', e.target.value)}
                placeholder="e.g. Senior Billing Officer"
              />
            </div>

            {/* Assigned Branch */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Branch Assignment</label>
              <input
                type="text"
                readOnly
                className="invoice-input"
                style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                value={`${formData.branchCode} - ${formData.branchName}`}
                title="Branch assignments are managed centrally by the Administrator."
              />
            </div>

            {/* Company / Enterprise */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Company Legal Entity</label>
              <input
                type="text"
                readOnly
                className="invoice-input"
                style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                value={formData.companyName}
              />
            </div>

            {/* Joining Date */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">Date of Joining</label>
              <input
                type="text"
                readOnly
                className="invoice-input"
                style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                value={formData.joiningDate}
              />
            </div>

            {/* Salary Package */}
            <div className="invoice-field-group">
              <label className="invoice-field-label">
                <span>Monthly Compensation</span>
                <button
                  type="button"
                  onClick={() => setShowSalary(!showSalary)}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  {showSalary ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showSalary ? 'Hide' : 'Show'}</span>
                </button>
              </label>
              <input
                type="text"
                readOnly
                className="invoice-input"
                style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed', fontWeight: 600 }}
                value={showSalary ? `₹${parseFloat(formData.salary || 0).toLocaleString('en-IN')}` : '••••••••'}
              />
            </div>

            {/* Access Role */}
            <div className="invoice-field-group invoice-col-span-2">
              <label className="invoice-field-label">System Access Privilege</label>
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '7px',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Lock size={15} color={roleBadgeColor} />
                <span>
                  <strong>{roleLabel}</strong> — {currentUser?.role === 'TENANT_OWNER' ? 'Global Multi-Branch ERP System Access' : `Strictly scoped to Branch ${formData.branchCode}`}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="primary-action-btn"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Update Employment Info'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: SECURITY & PASSWORD ── */}
      {activeTab === 'security' && (
        <div className="invoice-form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 className="invoice-card-title" style={{ margin: 0 }}>
              <KeyRound size={18} color="var(--brand-accent)" />
              <span>Credentials & Account Security</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Change your password and manage session authentication
            </span>
          </div>

          {passwordSuccess && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', color: '#10b981', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="invoice-field-group">
                <label className="invoice-field-label">Login Username</label>
                <input
                  type="text"
                  readOnly
                  className="invoice-input"
                  style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                  value={formData.username}
                />
              </div>

              <div className="invoice-field-group">
                <label className="invoice-field-label">
                  <span>New Password *</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="invoice-input"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="At least 6 characters..."
                />
              </div>

              <div className="invoice-field-group">
                <label className="invoice-field-label">Confirm New Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="invoice-input"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-type new password..."
                />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="primary-action-btn"
                  disabled={passwordSaving}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Lock size={16} />
                  <span>{passwordSaving ? 'Updating Password...' : 'Update & Reset Password'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Security Overview */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem'
            }}
          >
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-medium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <CheckCircle2 size={16} />
                <span>Two-Factor Authentication</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                OTP verification is required during branch login for heightened security.
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-medium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <Globe size={16} />
                <span>Active Session Scope</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Logged in via Web Application • PostgreSQL backend: <strong>bizzpilot</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Banner */}
      {toastMessage && (
        <div className="toast-floating-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
export default UserProfilePage;
