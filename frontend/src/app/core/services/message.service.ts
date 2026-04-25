import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private http: HttpClient) {}

  getConversations(): Observable<any> {
    return this.http.get(`${API_URL}/conversations`);
  }

  getMessages(conversationId: number): Observable<any> {
    return this.http.get(`${API_URL}/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: number, content: string): Observable<any> {
    return this.http.post(`${API_URL}/conversations/${conversationId}/messages`, {
      content: content
    });
  }

  startConversation(userId: number, message: string): Observable<any> {
    return this.http.post(`${API_URL}/conversations`, {
      user_id: userId,
      message: message
    });
  }
}