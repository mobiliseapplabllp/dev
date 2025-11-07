import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-member',
  standalone: false,
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent implements OnInit {
  isSidebarOpen = false;
  user: any = null;
  currentPage: string = 'add-member';
  memberForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.memberForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['member', [Validators.required]]
    });
  }

  ngOnInit() {
    // Set current page based on route
    const url = this.router.url;
    if (url.includes('dashboard')) this.currentPage = 'dashboard';
    else if (url.includes('table-data')) this.currentPage = 'table-data';
    else if (url.includes('attendance')) this.currentPage = 'attendance';
    else if (url.includes('add-member')) this.currentPage = 'add-member';
    else if (url.includes('memberships')) this.currentPage = 'memberships';

    this.auth.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSubmit() {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      Swal.fire('Error', 'Please fill all required fields correctly', 'error');
      return;
    }

    const formData = this.memberForm.value;
    
    this.auth.addUser(
      formData.username,
      formData.email,
      formData.dob,
      formData.mobile,
      formData.password
    ).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Member added successfully!', 'success');
        this.memberForm.reset();
      },
      error: (error) => {
        console.error('Error adding member:', error);
        Swal.fire('Error', error?.error?.message || 'Failed to add member', 'error');
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.closeSidebar();
    this.router.navigate([`/${page}`]);
  }
}
