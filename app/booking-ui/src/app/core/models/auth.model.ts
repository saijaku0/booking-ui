export enum UserRole {
  Admin = 'admin',
  Doctor = 'doctor',
  Patient = 'patient',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  userSurname: string;
  userEmail: string;
  userPassword: string;
  dateOfBirth?: string;
  gender?: number;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  roles: UserRole[];
}

export interface JwtCustomPayload {
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  sub?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  email?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  exp?: number;
}
