export interface User {
  id: string;
  email: string;
  password?: string;
  passwordHash: string; // mock hashed password
  isTotpVerified: boolean;
  totpSecret?: string;
  totpSkipped?: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  gstNumber: string;
  address: string;
  pinCode: string;
  state: string;
  country: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  branchName: string;
  branchCode: string;
  address: string;
  pinCode: string;
  state: string;
  country: string;
  contactPerson: string;
  phone: string;
  branchGst?: string;
  createdAt: string;
}

export type StepNumber = 1 | 2 | 3 | 4 | 'completed';

export interface OnboardingState {
  user: User | null;
  company: Company | null;
  branches: Branch[];
  currentStep: StepNumber;
  onboardingCompleted: boolean;
  lastUpdated: string;
  dbResult?: any;
}

export interface TotpSetupData {
  secret: string;
  otpauthUri: string;
  qrCodeUrl?: string;
  email: string;
  issuer: string;
}
