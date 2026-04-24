import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mission {
  id?: number;
  titre: string;
  description: string;
  budget: number;
  categorie: string;
  date_echeance: string;
  statut?: 'ouverte' | 'en_cours' | 'terminee' | 'annulee';
  client_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:8000/api/missions';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Créer une mission
  createMission(mission: Mission): Observable<any> {
    return this.http.post(this.apiUrl, mission, { headers: this.getHeaders() });
  }

  // Récupérer toutes les missions du client connecté
  getMesMissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mes-missions`, { headers: this.getHeaders() });
  }

  // Récupérer toutes les missions (pour les freelances)
  getAllMissions(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Récupérer une mission par ID
  getMission(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Mettre à jour une mission
  updateMission(id: number, mission: Partial<Mission>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mission, { headers: this.getHeaders() });
  }

  // Supprimer une mission
  deleteMission(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Voir les candidatures reçues pour une mission
  getCandidatures(missionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${missionId}/candidatures`, { headers: this.getHeaders() });
  }
}