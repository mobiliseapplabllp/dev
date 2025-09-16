import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  step: number = 1; // track current step
  otpSent = false;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  enteredOtp: string = '';
  dummyOtp: string = '1234';

  constructor(private fb: FormBuilder, private router: Router) {
    // Form to enter email/phone
    this.otpForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]]
    });

    // Form to enter new password after OTP
    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator for password match
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
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
    console.log('Password reset successfully!');
    alert('Password reset successful!');
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