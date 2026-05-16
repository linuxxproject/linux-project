import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class MissionService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${API_URL}/missions`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/missions/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URL}/missions`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/missions/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/missions/${id}`);
  }

  getMyMissions(): Observable<any> {
    return this.http.get(`${API_URL}/missions/my`);
  }
}
