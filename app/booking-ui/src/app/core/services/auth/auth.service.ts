import { environment } from '@env/environment';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserRole,
  CurrentUser,
  JwtCustomPayload,
} from '@core/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private tokenKey = 'auth_token';

  currentUser = signal<CurrentUser | null>(null);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.restoreSession();
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        const user = this.decodeToken(response.token);
        this.currentUser.set(user);

        this.redirectUser(user);
      }),
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<void>(`${this.apiUrl}/register`, request);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private restoreSession() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const user = this.decodeToken(token);
      if (user) {
        this.currentUser.set(user);
      } else {
        this.logout();
      }
    }
  }

  private decodeToken(token: string): CurrentUser | null {
    try {
      const decoded = jwtDecode<JwtCustomPayload>(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

      const rawRole =
        decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      let roles: UserRole[] = [];
      if (Array.isArray(rawRole)) {
        roles = rawRole as UserRole[];
      } else if (rawRole) {
        roles = [rawRole as UserRole];
      }

      const id =
        decoded.sub ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        '';
      const email =
        decoded.email ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        '';

      return { id, email, roles };
    } catch {
      return null;
    }
  }

  private redirectUser(user: CurrentUser | null) {
    if (!user) return;

    const rolesLower = user.roles.map((r) => r.toString().toLowerCase());

    if (rolesLower.includes(UserRole.Doctor.toLowerCase())) {
      this.router.navigate(['/doctor']);
    } else if (rolesLower.includes(UserRole.Admin.toLowerCase())) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
