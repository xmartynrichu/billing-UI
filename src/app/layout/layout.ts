import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout implements OnInit {
  menuList = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Revenue', route: '/revenue' },
    { label: 'Expense', route: '/expense' },
    { label: 'Profit', route: '/profitreport' },

    { label: 'Fish Item', route: '/fishitem' },

    { label: 'Employee', route: '/employee' },
    { label: 'Expense Label', route: '/expenselabel' },
  ];

  username = '';
  sidebarOpen = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // ✅ Only access localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username') || 'User';
      
      // Add User Creation menu only for a1012
      if (this.username === 'a1012') {
        this.menuList.push({ label: 'User Creation', route: '/userreport' });
      }
    }
  }
  ngOnInit(): void {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
