export interface StateOption {
  code: string;
  name: string;
  type: 'State' | 'Union Territory';
}

export const INDIAN_STATES_AND_UTS: StateOption[] = [
  // 28 States
  { code: 'AP', name: 'Andhra Pradesh', type: 'State' },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'State' },
  { code: 'AS', name: 'Assam', type: 'State' },
  { code: 'BR', name: 'Bihar', type: 'State' },
  { code: 'CG', name: 'Chhattisgarh', type: 'State' },
  { code: 'GA', name: 'Goa', type: 'State' },
  { code: 'GJ', name: 'Gujarat', type: 'State' },
  { code: 'HR', name: 'Haryana', type: 'State' },
  { code: 'HP', name: 'Himachal Pradesh', type: 'State' },
  { code: 'JH', name: 'Jharkhand', type: 'State' },
  { code: 'KA', name: 'Karnataka', type: 'State' },
  { code: 'KL', name: 'Kerala', type: 'State' },
  { code: 'MP', name: 'Madhya Pradesh', type: 'State' },
  { code: 'MH', name: 'Maharashtra', type: 'State' },
  { code: 'MN', name: 'Manipur', type: 'State' },
  { code: 'ML', name: 'Meghalaya', type: 'State' },
  { code: 'MZ', name: 'Mizoram', type: 'State' },
  { code: 'NL', name: 'Nagaland', type: 'State' },
  { code: 'OD', name: 'Odisha', type: 'State' },
  { code: 'PB', name: 'Punjab', type: 'State' },
  { code: 'RJ', name: 'Rajasthan', type: 'State' },
  { code: 'SK', name: 'Sikkim', type: 'State' },
  { code: 'TN', name: 'Tamil Nadu', type: 'State' },
  { code: 'TS', name: 'Telangana', type: 'State' },
  { code: 'TR', name: 'Tripura', type: 'State' },
  { code: 'UP', name: 'Uttar Pradesh', type: 'State' },
  { code: 'UK', name: 'Uttarakhand', type: 'State' },
  { code: 'WB', name: 'West Bengal', type: 'State' },

  // 8 Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'Union Territory' },
  { code: 'CH', name: 'Chandigarh', type: 'Union Territory' },
  { code: 'DH', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'Union Territory' },
  { code: 'DL', name: 'Delhi', type: 'Union Territory' },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'Union Territory' },
  { code: 'LA', name: 'Ladakh', type: 'Union Territory' },
  { code: 'LD', name: 'Lakshadweep', type: 'Union Territory' },
  { code: 'PY', name: 'Puducherry', type: 'Union Territory' },
];

export const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Singapore',
  'Australia',
  'Germany',
  'Canada',
  'Japan',
  'Other',
];

// GST Regex: 2 digits + 5 chars + 4 digits + 1 char + 1 char/digit + Z + 1 char/digit
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// 6-digit PIN code regex (exactly 6 digits)
export const PIN_CODE_REGEX = /^[0-9]{6}$/;

// 10-digit Indian phone regex
export const PHONE_REGEX = /^[6-9]\d{9}$/;
