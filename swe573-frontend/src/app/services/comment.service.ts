import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {baseApiUrl} from '../app.module';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = `${baseApiUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  getCommentsForPost(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get/${postId}`);
  }

  createComment(commentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, commentData);
  }
}
