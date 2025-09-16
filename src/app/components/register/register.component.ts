import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']  // <-- corrected
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });  // <-- corrected
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;  // <-- already correct placement

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { username, email, dob, mobile, password } = this.registerForm.value;

    this.auth.addUser(username, email, dob, mobile, password).subscribe({
      next: (response: any) => {
        console.log('Registration successful', response);
        Swal.fire({
          title: 'Successful',
          text: 'You have been registered successfully!',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel'
        }).then(result => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);  // Navigate to login page, not dashboard
          }
        });
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        Swal.fire('Error', 'Registration failed! Please check your credentials and try again.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
