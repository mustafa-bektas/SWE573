import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn.value) {
      return true; // Allow access if not logged in
    } else {
      this.router.navigate(['']); // Redirect to a protected page if already logged in
      return false;
    }
  }
}
