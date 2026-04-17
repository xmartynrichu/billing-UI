import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Only check in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const username = localStorage.getItem('username');
    
    // Only allow access if username is 'a1012'
    if (username === 'a1012') {
      return true;
    }

    // Redirect to dashboard and deny access
    this.router.navigate(['/dashboard']);
    return false;
  }
}
