import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { AuthService } from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.error.message === 'JWT expired') {
          console.error('Token expired. Logging out...');
          this.authService.logout(); // Clear token and user info
          this.router.navigate(['/login']); // Redirect to login
        }
        return throwError(() => err);
      })
    );
  }

}
