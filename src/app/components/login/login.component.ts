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
    let { username, password } = this.loginForm.value;
    
    // Trim whitespace from username and password
    username = username ? username.trim() : '';
    password = password ? password.trim() : '';
    
    // Debug: Check if values are present
    console.log('Form values:', { username, password: password ? '***' : 'empty' });
    console.log('Username value:', username, 'Type:', typeof username, 'Length:', username.length);
    console.log('Password value:', password ? '***' : 'empty', 'Type:', typeof password, 'Length:', password.length);

    if (!username || !password || username.length === 0 || password.length === 0) {
      alert('Please enter both username and password');
      this.isLoading = false;
      return;
    }

    this.authService.login(username, password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login successful:', response);
        if (response.success && response.token) {
          // Auth service will handle token storage
          if (response.user) {
            // Auth service will handle user storage
          }
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Login failed:', response.message || 'Invalid response');
          alert(response.message || 'Login failed! Please check your credentials and try again.');
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        const errorMessage = error?.error?.message || error?.message || 'Login failed! Please check your credentials and try again.';
        alert(errorMessage);
        this.isLoading = false;
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