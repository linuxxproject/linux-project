import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${API_URL}/stats`);
  }

  getMonthlyActivity(): Observable<any> {
    return this.http.get(`${API_URL}/stats/monthly`);
  }

  getRecentUsers(): Observable<any> {
    return this.http.get(`${API_URL}/stats/users`);
  }
}
