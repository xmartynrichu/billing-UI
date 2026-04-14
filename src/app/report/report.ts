import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseService } from '../service/expense.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class Report implements OnInit, AfterViewInit {
  data: any[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly expenseService: ExpenseService, private readonly cd: ChangeDetectorRef, private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadExpenseReport();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadExpenseReport() {
    this.expenseService.getExpensedetails().subscribe({
      next: (res: any[]) => {
        this.data = res || [];
        this.dataSource.data = this.data;

        if (this.data.length > 0) {
          // Dynamic columns (excluding 'actions')
             this.displayedColumns = Object.keys(this.data[0]).filter(col => col !== 'actions');
          this.displayedColumns.push('actions'); // Always add actions column
        } else {
          this.displayedColumns = [];
        }

        // Trigger change detection to avoid NG0100
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading report:', err)
    });
  }

  deleteExpense(id: number) {
    if (!confirm('Are you sure to delete?')) return;

    this.expenseService.deleteExpense(id).subscribe({
      next: () => this.loadExpenseReport(),
      error: (err) => console.error('Delete failed:', err)
    });
  }

  downloadExcel() {
    if (this.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
    XLSX.writeFile(workbook, 'Expense_Report.xlsx');
  }
}
