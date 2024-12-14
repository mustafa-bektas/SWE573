import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {baseApiUrl} from '../app.module';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${baseApiUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: number | null): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, null);
  }

  dismissNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }
}
