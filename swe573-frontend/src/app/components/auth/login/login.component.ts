import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = ''; // For displaying the error message

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.errorMessage = ''; // Clear any previous error
        this.router.navigate(['/']); // Redirect to the home page or desired route
      },
      error: (err) => {
        if (err.status === 401) { // Handle Unauthorized error
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Login error:', err);
      }
    });
  }
}
