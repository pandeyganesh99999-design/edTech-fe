import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { User, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, AuthState, UserRole } from '../models/auth.model';
import { TenantService } from './tenant.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getAccessToken();
    const user = this.getUserFromStorage();

    if (token && user) {
      this.authStateSubject.next({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authStateSubject.next({ ...this.authStateSubject.value, isLoading: true });

    // Dev-friendly multi-tenant dummy login
    const tenantId = credentials.tenantId || 'clr';
    const allowed = [
      { email: 'admin@demo.com', password: 'Password123', role: UserRole.ADMIN },
      { email: 'hr@demo.com', password: 'Password123', role: UserRole.HR },
      { email: 'manager@demo.com', password: 'Password123', role: UserRole.MANAGER },
      { email: 'employee@demo.com', password: 'Password123', role: UserRole.EMPLOYEE }
    ];

    const match = allowed.find(u => u.email === credentials.email && u.password === credentials.password);
    if (match) {
      const mockResponse: LoginResponse = {
        user: {
          id: `${match.role}-${tenantId}`,
          email: match.email,
          firstName: match.role.charAt(0).toUpperCase() + match.role.slice(1),
          lastName: 'Demo',
          role: match.role,
          tenantId: tenantId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        accessToken: `mock-access-token-${tenantId}`,
        refreshToken: `mock-refresh-token-${tenantId}`,
        expiresIn: 3600
      };

      this.setTokens(mockResponse.accessToken, mockResponse.refreshToken);
      this.setUser(mockResponse.user);
      this.authStateSubject.next({
        user: mockResponse.user,
        isAuthenticated: true,
        isLoading: false
      });

      return new Observable<LoginResponse>(subscriber => {
        subscriber.next(mockResponse);
        subscriber.complete();
      });
    }

    // Fallback to backend login if available
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.setUser(response.user);
        this.authStateSubject.next({
          user: response.user,
          isAuthenticated: true,
          isLoading: false
        });
      }),
      catchError(error => {
        this.authStateSubject.next({ ...this.authStateSubject.value, isLoading: false });
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).pipe(
      tap(() => {
        this.clearTokens();
        this.clearUser();
        this.authStateSubject.next({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }),
      catchError(() => {
        // Even if logout fails, clear local state
        this.clearTokens();
        this.clearUser();
        this.authStateSubject.next({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        return throwError(() => new Error('Logout failed'));
      })
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(`${environment.apiUrl}/auth/refresh`, {
      refreshToken
    } as RefreshTokenRequest).pipe(
      tap(response => {
        this.setAccessToken(response.accessToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    // Prefer HttpOnly cookies, but fallback to localStorage
    // For demo, using localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearUser(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}