import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  step: number = 1; 
  otpSent = false;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  enteredOtp: string = '';
  dummyOtp: string = '1111'; // For demo purposes

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {

    this.otpForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]]
    });

    // Form to enter new password after OTP
    this.passwordForm = this.fb.group(
      {
        id: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
    
  }

  // Custom validator for password match
  passwordsMatch(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  // Send OTP
  sendOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.otpSent = true;
    this.step = 2;
    // In real scenario, call API to send OTP
    console.log('OTP sent to:', this.otpForm.value.emailOrPhone);
  }

  // Verify OTP
  verifyOtp() {
    if (this.passwordForm.get('otp')?.value === this.dummyOtp) {
      this.step = 3; // show new password fields
    } else {
      alert('Invalid OTP');
    }
  }

  // Submit new password
  submitNewPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const newPassword = this.passwordForm.value.newPassword;
    const userId =  this.passwordForm.value.id;
    this.auth.updatePassword(userId, newPassword).subscribe({
      next: (response) => {
        console.log('Password updated successfully', response);
        this.afterPasswordReset();
      }

      ,
      error: (error) => {
        console.error('Password update failed:', error);
        alert('Failed to update password. Please try again.');
      }
    });
  }

  afterPasswordReset() {
    console.log('Password reset successfully!');
    this.router.navigate(['/login']);
  }
  // Add inside ForgotPasswordComponent
  moveNext(event: any, index: number) {
    const input = event.target;
    if (input.value.length === 1 && index < 3) {
      const nextInput = document.querySelectorAll<HTMLInputElement>('.otp-inputs input')[index + 1];
      nextInput.focus();
    }
  }

  verifyOtpFromBoxes(value: string) {
    if (value === this.dummyOtp) {
      this.step = 3;
    } else {
      alert('Invalid OTP');
    }
  }

}