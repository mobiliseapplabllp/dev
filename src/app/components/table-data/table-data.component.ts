import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-data',
  standalone: false,
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss'
})
export class TableDataComponent implements OnInit {
  tableData: any[] = [];
  filteredData: any[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isSidebarOpen = false;
  user: any = null;
  currentRoute: string = 'table-data';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
    });
    
    // Load table data
    this.loadTableData();
    
    // Set current route
    const url = this.router.url;
    if (url.includes('table-data')) this.currentRoute = 'table-data';
    else if (url.includes('dashboard')) this.currentRoute = 'dashboard';
    else if (url.includes('attendance')) this.currentRoute = 'attendance';
    else if (url.includes('add-member')) this.currentRoute = 'add-member';
    else if (url.includes('memberships')) this.currentRoute = 'memberships';
  }

  loadTableData() {
    // Mock data - replace with actual API call
    this.tableData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active', joinDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active', joinDate: '2024-02-20' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', status: 'Active', joinDate: '2024-03-10' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Developer', status: 'Inactive', joinDate: '2024-04-05' },
      { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Analyst', status: 'Active', joinDate: '2024-05-12' },
    ];
    this.filteredData = [...this.tableData];
  }

  onSearch() {
    if (!this.searchText.trim()) {
      this.filteredData = [...this.tableData];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.filteredData = this.tableData.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.role.toLowerCase().includes(search)
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  navigateTo(page: string) {
    this.closeSidebar();
    this.router.navigate([`/${page}`]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
