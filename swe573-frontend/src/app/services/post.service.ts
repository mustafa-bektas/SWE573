import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { baseApiUrl } from '../app.module'

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${baseApiUrl}/api/posts`;

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

  upvotePost(postId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upvote/${postId}`, {});
  }

  downvotePost(postId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/downvote/${postId}`, {});
  }

  markBestAnswer(commentId: number, postId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/markBestAnswer/${commentId}`, {});
  }

  searchPosts(keyword: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/searchForPosts?q=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
  }

}
