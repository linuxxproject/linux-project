import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, data);
  }

  me(): Observable<any> {
    return this.http.get(`${API_URL}/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${API_URL}/profile`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${API_URL}/logout`, {});
  }

  saveSession(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}