import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-memberships',
  standalone: false,
  templateUrl: './memberships.component.html',
  styleUrl: './memberships.component.scss'
})
export class MembershipsComponent implements OnInit {
  isSidebarOpen = false;
  user: any = null;
  currentPage: string = 'memberships';
  members: any[] = [];
  filteredMembers: any[] = [];
  searchText: string = '';

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
    this.loadMembers();
  }

  loadMembers() {
    // Mock data - replace with actual API call
    this.members = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Premium', status: 'Active', joinDate: '2024-01-15', expiryDate: '2025-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Standard', status: 'Active', joinDate: '2024-02-20', expiryDate: '2025-02-20' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Premium', status: 'Active', joinDate: '2024-03-10', expiryDate: '2025-03-10' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Basic', status: 'Expired', joinDate: '2023-04-05', expiryDate: '2024-04-05' },
      { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Standard', status: 'Active', joinDate: '2024-05-12', expiryDate: '2025-05-12' },
    ];
    this.filteredMembers = [...this.members];
  }

  onSearch() {
    if (!this.searchText.trim()) {
      this.filteredMembers = [...this.members];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search) ||
      member.role.toLowerCase().includes(search)
    );
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
