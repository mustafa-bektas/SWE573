import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form with validation rules
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Easy access to form fields in the template
  get f() {
    return this.registerForm.controls;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          const errorMessage = err.error?.error || 'An error occurred';
          console.error('Registration error:', errorMessage);

          // Show the error to the user (update template or use a variable)
          if (errorMessage.includes('Email')) {
            this.registerForm.controls['email'].setErrors({ emailTaken: true });
          } else if (errorMessage.includes('Username')) {
            this.registerForm.controls['username'].setErrors({ usernameTaken: true });
          }
        } else {
          console.error('Unexpected registration error:', err);
        }
      },
    });
  }

}
