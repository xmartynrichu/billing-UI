import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../service/dashboard.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit, OnDestroy {
  loading: boolean = true;
  private readonly destroy$ = new Subject<void>();

  dashboardCounts = {
    employees: 0,
    expenses: 0,
    fish: 0,
    labels: 0,
    revenue: 0,
    users: 0,
  };

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    this.getDashboardList();
  }

  ngOnDestroy(): void {
    console.log('Dashboard component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDashboardList(): void {
    console.log('Fetching dashboard data...');
    this.dashboardService
      .getdashboarddetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('Dashboard API response:', data);
          console.log('Data structure:', JSON.stringify(data, null, 2));

          if (!data) {
            console.warn('Dashboard API returned empty data');
            this.loading = false;
            this.cdr.markForCheck();
            return;
          }

          try {
            // Helper to extract value from response
            const extractValue = (arr: any): number => {
              if (!arr || !Array.isArray(arr) || arr.length === 0) return 0;
              const item = arr[0];
              return Number(item?.value ?? item?.count ?? 0);
            };

            this.dashboardCounts = {
              employees: extractValue(data?.empcount),
              expenses: extractValue(data?.expcount),
              fish: extractValue(data?.fiscount),
              labels: extractValue(data?.lblcount),
              revenue: extractValue(data?.revcount),
              users: extractValue(data?.usrcount),
            };

            console.log('Processed dashboard counts:', this.dashboardCounts);
            this.loading = false;
            this.cdr.markForCheck();
          } catch (err) {
            console.error('Error processing dashboard data:', err);
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('Dashboard API error:', err);
          console.error('Error details:', err.message);
          this.loading = false;
          this.cdr.markForCheck();
        },
        complete: () => {
          console.log('Dashboard API subscription completed');
        },
      });
  }

  navigate(e: any): void {
    this.router.navigate(['/' + e]);
  }
}
