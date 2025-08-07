export interface Consumer {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  accountNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface License {
  _id?: string;
  licenseKey: string;
  productId: string;
  consumerId: string;
  licenseType: 'full' | 'trial';
  expires?: string | null;
  active: boolean;
  createdAt?: string;
}

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface User {
  _id?: string;
  email: string;
  password?: string; // Optional for OAuth users
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LicenseCheckRequest {
  licenseKey: string;
  productName: string;
  accountNumber: string;
}

export interface LicenseCheckResponse {
  status: 'valid' | 'invalid';
  product?: string;
  expires?: string | null;
  active?: boolean;
  error?: string;
}