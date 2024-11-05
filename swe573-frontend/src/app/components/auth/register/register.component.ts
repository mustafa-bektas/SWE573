import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.user).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/login']);  // Redirect to login
      },
      error: (err) => {
        console.error('Registration error:', err);
      }
    });
  }
}
