import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
  isSidebarOpen = false;
  user: any = null;
  currentPage: string = 'attendance';
  attendanceDate: string = new Date().toISOString().split('T')[0];
  attendanceRecords: any[] = [];
  selectedStatus: string = 'present';

  constructor(private auth: AuthService, private router: Router) {}

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
    this.loadAttendanceRecords();
  }

  loadAttendanceRecords() {
    // Mock data - replace with actual API call
    this.attendanceRecords = [
      { date: '2024-11-01', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM' },
      { date: '2024-11-02', status: 'present', checkIn: '09:15 AM', checkOut: '06:15 PM' },
      { date: '2024-11-03', status: 'late', checkIn: '09:45 AM', checkOut: '06:00 PM' },
      { date: '2024-11-04', status: 'absent', checkIn: '-', checkOut: '-' },
      { date: '2024-11-05', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM' },
    ];
  }

  markAttendance() {
    if (!this.attendanceDate) {
      Swal.fire('Error', 'Please select a date', 'error');
      return;
    }

    Swal.fire({
      title: 'Mark Attendance',
      text: `Mark attendance as ${this.selectedStatus} for ${this.attendanceDate}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Mark',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would call your API
        Swal.fire('Success', `Attendance marked as ${this.selectedStatus}`, 'success');
        this.loadAttendanceRecords();
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
