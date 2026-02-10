import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginRequest } from '@core/models/auth.model';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const request: LoginRequest = this.loginForm.value as LoginRequest;

    this.authService.login(request).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage.set('Incorrect email or password.');
        } else {
          this.errorMessage.set('Something went wrong. Please try again later.');
        }
        this.isLoading.set(false);
      },
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
