/**
 * User roles in the system
 */
export type UserRole =
  | 'customer' // End user (buyer)
  | 'store_owner' // End user (seller)
  | 'support' // Internal staff
  | 'employee' // Internal staff
  | 'vendor'; // Internal staff

/**
 * Role groups for easier checking
 */
export type EndUserRole = 'customer' | 'store_owner';
export type InternalRole = 'support' | 'employee' | 'vendor';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[]; // Array of roles - users can have multiple
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}
