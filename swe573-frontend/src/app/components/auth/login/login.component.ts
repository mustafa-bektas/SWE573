import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        console.log('Login successful');
        this.router.navigate(['/']);  // Redirect to the home page or desired route
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
}
