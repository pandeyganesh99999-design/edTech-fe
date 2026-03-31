import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  forgotPasswordForm: FormGroup;
  isLoading = false;
  message = '';
  isSuccess = false;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.message = '';

      // TODO: Implement forgot password API call
      // For now, just simulate success
      setTimeout(() => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'Password reset instructions have been sent to your email.';
      }, 2000);
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}