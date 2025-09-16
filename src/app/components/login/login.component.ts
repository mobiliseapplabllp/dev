import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginResponse } from '../../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        // localStorage.setItem('userid', response.userid);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        alert('Login failed! Please check your credentials and try again.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }
  resetForm(): void {
    this.loginForm.reset();
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  } 
}