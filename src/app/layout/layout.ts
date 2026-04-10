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
    { label: 'Report', route: '/report' },
    { label: 'Profit', route: '/profitreport' },

    { label: 'Fish Item', route: '/fishitem' },

    { label: 'Employee', route: '/employee' },
    { label: 'Expense Label', route: '/expenselabel' },
    { label: 'User Creation', route: '/userreport' },
  ];

  username = '';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // ✅ Only access localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username') || 'User';
    }
  }
  ngOnInit(): void {}
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
