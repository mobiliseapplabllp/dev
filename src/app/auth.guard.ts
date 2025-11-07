// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './providers/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}
  
  canActivate(): boolean {
    // Check both token keys for compatibility
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token && this.authService.isAuthenticated()) {
      return true; // User is authenticated
    } else {
      this.router.navigate(['/login']);
      return false; // User not authenticated
    }
  }
}