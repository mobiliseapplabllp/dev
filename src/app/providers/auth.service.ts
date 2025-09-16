import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  userId: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  expiresIn: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  private tokenKey = 'authToken';
  private userKey = 'currentUser';
  
  // Observable for authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if token exists on service initialization
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.setToken(response.token);
            this.setCurrentUser(response.user);
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Get HTTP headers with authorization
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Verify token
  verifyToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-token`, {}, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Get user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Get all users (protected)
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { 
      headers: this.getAuthHeaders() 
    });
  }

  addUser(username: string, email: string, dob: string, mobile: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addUser`, 
      { username, email, dob, mobile, password }, 
      { headers: this.getAuthHeaders() }
    );
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Test connection (public endpoint)
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}