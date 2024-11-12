import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://swe573-backend-594781402587.us-central1.run.app/api/posts';

  constructor(private http: HttpClient) {}

  createPost(postData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, postData);
  }

  getPosts(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/getForPostList`, { params });
  }

  getPostById(postId: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getForPostDetails/${postId}`);
  }

}
