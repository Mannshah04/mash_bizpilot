import * as OTPAuth from 'otpauth';
import type { User, Company, Branch, OnboardingState, TotpSetupData } from '../types/onboarding';

const STORAGE_KEY = 'bizpilot_onboarding_v1';
const DELAY_MS = 250; // realistic mock latency

const delay = (ms: number = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const getInitialState = (): OnboardingState => ({
  user: null,
  company: null,
  branches: [],
  currentStep: 1,
  onboardingCompleted: false,
  lastUpdated: new Date().toISOString(),
});

export const mockApiService = {
  getStoredState(): OnboardingState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read state from localStorage', e);
    }
    return getInitialState();
  },

  saveStoredState(state: OnboardingState): void {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  },

  async getState(): Promise<OnboardingState> {
    await delay(100);
    return this.getStoredState();
  },

  async signUp(email: string, password: string): Promise<{ user: User }> {
    await delay(200);
    const cleanEmail = email.trim().toLowerCase();

    // Validate with backend PostgreSQL
    try {
      const resp = await fetch('/api/onboarding/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.message || 'An account with this email already exists.');
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('Failed to fetch')) {
        throw e;
      }
      // If network offline, continue with local simulation
    }

    const state = this.getStoredState();
    const secret = new OTPAuth.Secret({ size: 20 }).base32;

    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      email: cleanEmail,
      password: password,
      passwordHash: 'mock_hash_' + btoa(password).substring(0, 16),
      isTotpVerified: false,
      totpSecret: secret,
      createdAt: new Date().toISOString(),
    };

    state.user = user;
    state.currentStep = 2;
    state.onboardingCompleted = false;
    this.saveStoredState(state);

    return { user };
  },

  async skipTotp(_userId?: string): Promise<{ success: boolean }> {
    await delay(150);
    const state = this.getStoredState();
    if (state.user) {
      state.user.isTotpVerified = true;
      state.user.totpSkipped = true;
      state.currentStep = 3;
      this.saveStoredState(state);
    }
    return { success: true };
  },

  async getTotpSetup(_userId?: string): Promise<TotpSetupData> {
    await delay(150);
    const state = this.getStoredState();
    let secret = state.user?.totpSecret;

    if (!secret) {
      secret = new OTPAuth.Secret({ size: 20 }).base32;
      if (state.user) {
        state.user.totpSecret = secret;
        this.saveStoredState(state);
      }
    }

    const email = state.user?.email || 'user@bizpilot.in';
    const issuer = 'Bizpilot';

    const totp = new OTPAuth.TOTP({
      issuer,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    return {
      secret,
      otpauthUri: totp.toString(),
      email,
      issuer,
    };
  },

  async verifyTotp(
    _userId: string,
    code: string
  ): Promise<{ success: boolean; delta: number | null; error?: string }> {
    await delay(300);
    const state = this.getStoredState();

    if (!state.user || !state.user.totpSecret) {
      return { success: false, delta: null, error: 'User session or secret not found.' };
    }

    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'Bizpilot',
        label: state.user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(state.user.totpSecret),
      });

      // Allow +-1 period window tolerance (as per requirement: 30s window with +-1 tolerance)
      const delta = totp.validate({ token: code.trim(), window: 1 });

      if (delta === null) {
        return {
          success: false,
          delta: null,
          error: 'Invalid 6-digit code. Please enter the latest code from your authenticator app.',
        };
      }

      state.user.isTotpVerified = true;
      state.currentStep = 3;
      this.saveStoredState(state);

      return { success: true, delta };
    } catch (err: unknown) {
      return {
        success: false,
        delta: null,
        error: err instanceof Error ? err.message : 'Verification failed.',
      };
    }
  },

  // Generates current live TOTP token for testing convenience
  generateCurrentTotpToken(secretBase32: string): string {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'Bizpilot',
        label: 'test',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secretBase32),
      });
      return totp.generate();
    } catch {
      return '';
    }
  },

  async saveCompany(
    companyData: Omit<Company, 'id' | 'createdAt'>
  ): Promise<{ company: Company }> {
    await delay(300);
    const state = this.getStoredState();

    const company: Company = {
      id: state.company?.id || 'comp_' + Math.random().toString(36).substring(2, 10),
      ...companyData,
      gstNumber: companyData.gstNumber.toUpperCase().trim(),
      createdAt: state.company?.createdAt || new Date().toISOString(),
    };

    state.company = company;
    state.currentStep = 4;
    this.saveStoredState(state);

    return { company };
  },

  async getCompany(): Promise<Company | null> {
    await delay(100);
    return this.getStoredState().company;
  },

  async addBranch(
    branchData: Omit<Branch, 'id' | 'companyId' | 'createdAt'>
  ): Promise<{ branch: Branch }> {
    await delay(250);
    const state = this.getStoredState();

    if (!state.company) {
      throw new Error('Main company must be created before adding branches.');
    }

    const codeUpper = branchData.branchCode.toUpperCase().trim();
    // Validate unique branch code
    const exists = state.branches.some(
      (b) => b.branchCode.toUpperCase() === codeUpper
    );
    if (exists) {
      throw new Error(`Branch Code "${codeUpper}" already exists. Please choose a unique code.`);
    }

    const newBranch: Branch = {
      id: 'br_' + Math.random().toString(36).substring(2, 10),
      companyId: state.company.id,
      ...branchData,
      branchCode: codeUpper,
      branchGst: branchData.branchGst ? branchData.branchGst.toUpperCase().trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    state.branches.push(newBranch);
    this.saveStoredState(state);

    return { branch: newBranch };
  },

  async updateBranch(
    branchId: string,
    branchData: Omit<Branch, 'id' | 'companyId' | 'createdAt'>
  ): Promise<{ branch: Branch }> {
    await delay(250);
    const state = this.getStoredState();

    const index = state.branches.findIndex((b) => b.id === branchId);
    if (index === -1) {
      throw new Error('Branch not found.');
    }

    const codeUpper = branchData.branchCode.toUpperCase().trim();
    // Validate unique branch code excluding self
    const exists = state.branches.some(
      (b) => b.id !== branchId && b.branchCode.toUpperCase() === codeUpper
    );
    if (exists) {
      throw new Error(`Branch Code "${codeUpper}" already exists on another branch.`);
    }

    const updatedBranch: Branch = {
      ...state.branches[index],
      ...branchData,
      branchCode: codeUpper,
      branchGst: branchData.branchGst ? branchData.branchGst.toUpperCase().trim() : undefined,
    };

    state.branches[index] = updatedBranch;
    this.saveStoredState(state);

    return { branch: updatedBranch };
  },

  async deleteBranch(branchId: string): Promise<{ success: boolean }> {
    await delay(200);
    const state = this.getStoredState();

    state.branches = state.branches.filter((b) => b.id !== branchId);
    this.saveStoredState(state);

    return { success: true };
  },

  async getBranches(): Promise<Branch[]> {
    await delay(100);
    return this.getStoredState().branches;
  },

  async finishOnboarding(): Promise<{ success: boolean; state: OnboardingState }> {
    await delay(250);
    const state = this.getStoredState();

    // Persist full setup directly into PostgreSQL database via backend
    try {
      const resp = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: state.user,
          company: state.company,
          branches: state.branches,
        }),
      });
      const data = await resp.json();
      if (data.success) {
        state.dbResult = data;
        // Also save active session in localStorage for immediate BizzPilot ERP dashboard entry
        const session = {
          authStep: 'AUTHENTICATED',
          activePortal: 'OWNER_DASHBOARD',
          currentUser: data.user,
          currentTenant: data.tenant,
          availableBranches: data.branches || [],
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          theme: 'dark',
        };
        localStorage.setItem('bizzpilot_auth_session', JSON.stringify(session));
      }
    } catch (e) {
      console.warn('Backend onboarding complete failed (proceeding locally):', e);
    }

    state.onboardingCompleted = true;
    state.currentStep = 'completed';
    this.saveStoredState(state);

    return { success: true, state };
  },

  async resetOnboarding(): Promise<void> {
    await delay(150);
    localStorage.removeItem(STORAGE_KEY);
  },
};
