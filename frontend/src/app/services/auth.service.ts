import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'freelance';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'freelance';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Restaurer l'utilisateur au démarrage
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}