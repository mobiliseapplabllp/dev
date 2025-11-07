import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('attendanceChart', { static: true }) attendanceChartRef!: ElementRef<HTMLCanvasElement>;
  
  user: any = null;
  stats: any[] = [];
  isSidebarOpen = false;
  searchText: string = '';
  attendanceChart: any;
  birthdayEmployees: any[] = [];
  isChatbotOpen = false;
  currentPage: string = 'dashboard';

  constructor(private router: Router, private auth: AuthService) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
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
      console.log('Current User in Dashboard:', this.user);
    });

    // Initialize stats
    this.loadStats();
    this.loadBirthdayEmployees();
    this.initAttendanceChart();
  }

  loadStats() {
    // Mock data - replace with actual API calls
    this.stats = [
      { title: 'Total Users', value: '1,234', icon: '👥', color: '#667eea', change: '+12%' },
      { title: 'Active Members', value: '856', icon: '✅', color: '#48bb78', change: '+8%' },
      { title: 'Today Attendance', value: '342', icon: '📊', color: '#ed8936', change: '+5%' },
      { title: 'Pending Tasks', value: '23', icon: '📝', color: '#f56565', change: '-3%' }
    ];
  }

  loadBirthdayEmployees() {
    // Mock data - replace with actual API calls
    this.birthdayEmployees = [
      { name: 'John Doe', birthday: 'Today', avatar: '👤' },
      { name: 'Jane Smith', birthday: 'Today', avatar: '👤' },
      { name: 'Mike Johnson', birthday: 'Tomorrow', avatar: '👤' }
    ];
  }

  initAttendanceChart() {
    setTimeout(() => {
      const ctx = this.attendanceChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.attendanceChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Present', 'Absent', 'Late', 'Leave'],
            datasets: [{
              data: [65, 15, 10, 10],
              backgroundColor: [
                '#48bb78',
                '#f56565',
                '#ed8936',
                '#4299e1'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              },
              title: {
                display: true,
                text: 'Monthly Attendance Overview',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: 20
              }
            }
          }
        });
      }
    }, 100);
  }

  sendBirthdayMessage(employee: any) {
    Swal.fire({
      title: 'Send Birthday Wish',
      text: `Send a birthday message to ${employee.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Sent!', `Birthday wish sent to ${employee.name}`, 'success');
      }
    });
  }

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.closeSidebar();
    this.router.navigate([`/${page}`]);
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.auth.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }

  onSearch() {
    console.log(this.searchText);
  }
}
