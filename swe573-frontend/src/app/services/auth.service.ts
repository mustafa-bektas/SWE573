import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {baseApiUrl} from '../app.module';
import { jwtDecode } from 'jwt-decode';

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
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      map((response: any) => response), // Pass the response down
      tap({
        error: (error) => {
          throw error; // Ensure the error bubbles up
        },
      })
    );
  }


  // Login user and store token
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.isLoggedIn.next(true);
          this.userName = credentials.email;
          localStorage.setItem('userName', this.userName);
        }
      }),
      map((response: any) => response), // Pass the response down
      // Pass errors to the component
      tap({
        error: (error) => {
          throw error; // Ensure the error bubbles up
        },
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

  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId || null;
    }
    return null;
  }

  getUserNameFromId(userId: number): Observable<any> {
    return this.http.get(`${baseApiUrl}/api/auth/${userId}`).pipe(
      map((response: any) => response.username),
      tap({
        error: (error) => {
          throw error;
        },
      })
    );
  }
}
