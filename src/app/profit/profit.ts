import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfitService } from '../service/profit.service';

@Component({
  selector: 'app-profit',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './profit.html',
  styleUrl: './profit.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class Profit implements OnInit {

  reportData: MatTableDataSource<any> = new MatTableDataSource<any>();
  loading = true;
  dataLoaded = false;
  displayedColumns = ['date', 'revenue', 'expense', 'profit'];

  constructor(
    private readonly profitService: ProfitService,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Profit component initialized');
    this.loadReport();
  }

  loadReport() {
    console.log('loadReport called - Starting to fetch profit data');
    this.loading = true;
    this.dataLoaded = false;
    this.cdr.markForCheck();
    
    this.profitService.getProfitReport().subscribe({
      next: (data: any[]) => {
        console.log('Profit data received:', data);
        this.reportData = new MatTableDataSource(data);
        this.loading = false;
        this.dataLoaded = true;
        console.log('loading flag:', this.loading);
        console.log('dataLoaded flag:', this.dataLoaded);
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error loading profit report:', error);
        this.snackBar.open('Error loading profit report', 'Close', { duration: 5000 });
        this.loading = false;
        this.dataLoaded = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        console.log('Profit data load complete');
      }
    });
  }
}
