import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${API_URL}/applications`);
  }

  getMine(): Observable<any> {
    return this.http.get(`${API_URL}/applications/mine`);
  }

  apply(missionId: number, message: string = '', proposedBudget?: number): Observable<any> {
    return this.http.post(`${API_URL}/applications`, {
      mission_id: missionId,
      message: message,
      proposed_budget: proposedBudget
    });
  }

  updateStatus(id: number, status: 'en_attente' | 'acceptee' | 'refusee'): Observable<any> {
    return this.http.put(`${API_URL}/applications/${id}/status`, { status });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/applications/${id}`);
  }
}