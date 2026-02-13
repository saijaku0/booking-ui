import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { RegisterRequest } from '@core/models/auth.model';
import { AuthService } from '@core/services/auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  birthDate = signal<string>('');
  isFocused = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isGenderFocused = signal(false);
  maxDate = new Date().toISOString().split('T')[0];

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { firstName, lastName, email, password, confirmPassword, gender, dateOfBirth } =
      this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: RegisterRequest = {
      userEmail: email!,
      userPassword: password!,
      dateOfBirth: dateOfBirth!,
      userName: firstName!,
      userSurname: lastName!,
      gender: Number(gender),
    };

    this.authService.register(request).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(
          'Registration failed. ' + (err.error?.message || 'Please try again.'),
        );
        this.isLoading.set(false);
      },
    });
  }

  onDateChange(value: Event) {
    this.birthDate.set((value.target as HTMLInputElement).value);
    this.registerForm
      .get('dateOfBirth')
      ?.setValue((value.target as HTMLInputElement).value, { emitEvent: true });
    this.registerForm.get('dateOfBirth')?.markAsDirty();
  }
}
