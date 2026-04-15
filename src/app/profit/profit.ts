import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProfitService } from '../service/profit.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-profit',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './profit.html',
  styleUrl: './profit.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class Profit implements OnInit, AfterViewInit {

  reportData: MatTableDataSource<any> = new MatTableDataSource<any>();
  loading = true;
  dataLoaded = false;
  displayedColumns = ['date', 'revenue', 'expense', 'profit', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly profitService: ProfitService,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Profit component initialized');
    this.loadReport();
  }

  ngAfterViewInit(): void {
    this.reportData.paginator = this.paginator;
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

  downloadExcel() {
    if (this.reportData.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const data = this.reportData.data.map(row => ({
      'Date': row.date,
      'Revenue': row.revenue,
      'Expense': row.expense,
      'Profit': row.profit
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profit');
    
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 }
    ];

    XLSX.writeFile(workbook, 'Profit_Report.xlsx');
  }

  /**
   * Send profit report via email with Excel attachment for specific date
   * Fetches fresh data from database based on selected date
   * Converts UTC date to local date to match table display
   */
  sendEmail(selectedProfit: any): void {
    if (!selectedProfit || !selectedProfit.date) {
      this.snackBar.open('No data selected', 'OK', { duration: 2000 });
      return;
    }

    const recipientEmail = prompt('Enter recipient email address:');
    
    if (!recipientEmail) {
      this.snackBar.open('Email cancelled', 'OK', { duration: 2000 });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      this.snackBar.open('Invalid email address', 'OK', { duration: 2000 });
      return;
    }

    this.loading = true;
    
    // Convert UTC date to LOCAL date to match table display
    const dateObj = new Date(selectedProfit.date);
    
    // These methods return LOCAL date components (not UTC)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    console.log('📧 Original UTC date:', selectedProfit.date);
    console.log('📧 Converted to LOCAL date:', dateString);
    console.log('📧 Table displays as:', new Date(selectedProfit.date).toLocaleDateString('en-IN'));

    // Send only date - backend will fetch fresh data from database
    const reportPayload = {
      selectedDate: dateString,
      recipientEmail: recipientEmail
    };
    
    this.profitService.sendProfitReportEmail(reportPayload, recipientEmail).subscribe({
      next: (response: any) => {
        this.snackBar.open('✓ Email sent successfully with profit report!', 'OK', { duration: 3000 });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error sending email:', error);
        this.snackBar.open('Failed to send email: ' + error?.error?.details, 'OK', { duration: 3000 });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
