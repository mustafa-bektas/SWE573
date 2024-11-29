import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {baseApiUrl} from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${baseApiUrl}/api/auth`;  // Update with your backend URL
  private tokenKey = 'authToken';

  // Observable to track login status
  public isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public userName = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Register user
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Login user and store token
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response.token; // Assuming response has a 'token' property
        if (token) {
          localStorage.setItem(this.tokenKey, token); // Store token as a string
          this.isLoggedIn.next(true); // Update login status
          this.userName = credentials.email;
          localStorage.setItem('userName', this.userName);
        }
      })
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.next(false);
    this.router.navigate(['/']);
  }

  // Check if the token exists (user is logged in)
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Retrieve the stored JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
