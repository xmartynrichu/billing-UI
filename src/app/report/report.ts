import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpenseService } from '../service/expense.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class Report implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = [];

  constructor(private readonly expenseService: ExpenseService, private readonly cd: ChangeDetectorRef, private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadExpenseReport();
  }

  loadExpenseReport() {
    this.expenseService.getExpensedetails().subscribe({
      next: (res: any[]) => {
        this.data = res || [];

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
}
