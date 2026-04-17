import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MasterService } from '../service/master.service';
import { ExpenseService } from '../service/expense.service';
import * as XLSX from 'xlsx';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface ExpenseLabel {
  id: number;
  label_name: string;
  amt: number;
}

interface ExpenseItem {
  date: Date;
  labelId: number;
  labelName: string;
  amount: number;
  entryby: string;
}

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './expense.html',
  styleUrls: ['./expense.css']
})
export class Expense implements OnInit, AfterViewInit {

  expenseForm!: FormGroup;
  labels: ExpenseLabel[] = [];
  expensesDataSource = new MatTableDataSource<ExpenseItem>();
  reportDataSource = new MatTableDataSource<any>();
  reportDisplayedColumns: string[] = [];
  reportFilterValue: string = '';

  displayedColumns: string[] = ['date', 'label', 'amount', 'actions'];
  reportData: any[] = [];
  editingIndex: number | null = null;
  editingExpenseId: number | null = null;
  editingFromReport: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('reportPaginator') reportPaginator!: MatPaginator;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly expenseService: ExpenseService,
    private readonly masterService: MasterService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: [new Date(), Validators.required],
      labelId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    });

    this.getLabelMasterList();
    this.loadExpenseReport();
  }

  ngAfterViewInit(): void {
    this.expensesDataSource.paginator = this.paginator;
    if (this.reportPaginator) {
      this.reportDataSource.paginator = this.reportPaginator;
    }

    // Set up custom filter predicate for report table to search across all columns
    this.reportDataSource.filterPredicate = (data: any, filter: string) => {
      const filterLower = filter.toLowerCase().trim();
      
      // Search across all columns
      return Object.values(data).some(value =>
        value?.toString().toLowerCase().includes(filterLower)
      );
    };
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date <= new Date();
  }

  labelprice(label: ExpenseLabel): void {
    this.expenseForm.patchValue({ amount: label.amt });
  }

  downloadExcel() {
    if (this.expensesDataSource.data.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const data = this.expensesDataSource.data.map(row => ({
      'Date': new Date(row.date).toLocaleDateString('en-IN'),
      'Label': row.labelName,
      'Amount': row.amount
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 12 }
    ];

    XLSX.writeFile(workbook, 'Expense_Report.xlsx');
  }

  addExpense(): void {
    if (this.expenseForm.invalid) return;

    const label: ExpenseLabel = this.expenseForm.value.labelId;

    const newExpense: ExpenseItem = {
      date: this.expenseForm.value.date,
      labelId: label.id,
      labelName: label.label_name,
      amount: this.expenseForm.value.amount,
      entryby: localStorage.getItem('username') || 'system'
    };

    if (this.editingIndex !== null) {
      // Update existing expense
      const updatedData = [...this.expensesDataSource.data];
      updatedData[this.editingIndex] = newExpense;
      this.expensesDataSource.data = updatedData;
      this.editingIndex = null;
    } else {
      // Add new expense
      this.expensesDataSource.data = [...this.expensesDataSource.data, newExpense];
    }

    this.expenseForm.patchValue({
      labelId: null,
      amount: null
    });
  }

  editExpense(index: number): void {
    const expense = this.expensesDataSource.data[index];
    
    // Find the label object from labels array
    const label = this.labels.find(l => l.label_name === expense.labelName);

    this.expenseForm.patchValue({
      date: new Date(expense.date),
      labelId: label,
      amount: expense.amount
    });

    this.editingIndex = index;

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.editingExpenseId = null;
    this.editingFromReport = false;
    this.expenseForm.reset({
      date: new Date(),
      labelId: null,
      amount: null
    });
  }

  removeExpense(index: number): void {
    this.expensesDataSource.data = this.expensesDataSource.data.filter((_, i) => i !== index);
    
    // If we were editing this index, cancel editing
    if (this.editingIndex === index) {
      this.cancelEdit();
    } else if (this.editingIndex !== null && this.editingIndex > index) {
      // Adjust editing index if we removed an item before it
      this.editingIndex--;
    }
  }

  getTotal(): number {
    return this.expensesDataSource.data.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  saveAll(): void {
    // Handle saving from report (update existing)
    if (this.editingFromReport && this.editingExpenseId) {
      // Validate form before saving
      if (this.expenseForm.invalid || !this.expenseForm.value.labelId) {
        this.snackBar.open('Please fill all fields correctly', 'OK', { duration: 2000 });
        return;
      }

      const label: ExpenseLabel = this.expenseForm.value.labelId;
      const expenseData = [{
        date: this.expenseForm.value.date,
        labelId: label.id,
        labelName: label.label_name,
        amount: this.expenseForm.value.amount,
        entryby: localStorage.getItem('username') || 'system'
      }];

      this.expenseService.updateExpense(this.editingExpenseId, expenseData).subscribe({
        next: () => {
          this.snackBar.open('Updated successfully', 'OK', { duration: 2000 });
          this.cancelEdit();
          // Reload report data
          setTimeout(() => {
            this.loadExpenseReport();
          }, 500);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Update failed', 'OK', { duration: 2000 });
        }
      });
      return;
    }

    // Handle saving new expenses
    if (!this.expensesDataSource.data.length) return;

    this.expenseService.insertexpensedetails(this.expensesDataSource.data).subscribe({
      next: () => {
        this.snackBar.open('Saved successfully', 'OK', { duration: 2000 });

        // Defer data reset to avoid expression changed error
        setTimeout(() => {
          this.expensesDataSource.data = [];
          this.expenseForm.reset({
            date: new Date(),
            labelId: null,
            amount: null
          });
          // Reload report data
          this.loadExpenseReport();
        }, 500);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Save failed', 'OK', { duration: 2000 });
      }
    });
  }

  loadExpenseReport(): void {
    this.expenseService.getExpensedetails().subscribe({
      next: (res: any[]) => {
        this.reportData = res || [];
        this.reportDataSource.data = this.reportData;

        if (this.reportData.length > 0) {
          // Dynamic columns (excluding 'actions')
          this.reportDisplayedColumns = Object.keys(this.reportData[0]).filter(col => col !== 'actions');
          this.reportDisplayedColumns.push('actions'); // Always add actions column
        } else {
          this.reportDisplayedColumns = [];
        }

        // Trigger change detection to avoid NG0100
        this.cd.detectChanges();
      },
      error: (err: any) => console.error('Error loading report:', err)
    });
  }

  editExpenseFromReport(expense: any): void {
    // Check if labels are loaded
    if (!this.labels || this.labels.length === 0) {
      this.snackBar.open('Labels not loaded yet, please wait', 'OK', { duration: 2000 });
      return;
    }

    // Find which label column has a value (in pivoted report structure)
    let selectedLabel: ExpenseLabel | undefined;
    let selectedAmount: number = 0;

    // Iterate through labels to find which one has a value in this expense record
    for (const label of this.labels) {
      const columnValue = expense[label.label_name];
      if (columnValue && Number(columnValue) > 0) {
        selectedLabel = label;
        selectedAmount = Number(columnValue);
        break; // Assume one label per header
      }
    }

    if (selectedLabel) {
      this.expenseForm.patchValue({
        date: new Date(expense.expense_date || expense.date),
        labelId: selectedLabel,
        amount: selectedAmount
      });

      // Store the expense id for updating
      this.editingExpenseId = expense.id;
      this.editingFromReport = true;

      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.snackBar.open('Could not load expense for editing', 'OK', { duration: 2000 });
    }
  }

  deleteExpenseFromReport(id: number): void {
    if (!confirm('Are you sure to delete?')) return;

    this.expenseService.deleteExpense(id).subscribe({
      next: () => this.loadExpenseReport(),
      error: (err: any) => console.error('Delete failed:', err)
    });
  }

  downloadReportExcel(): void {
    if (this.reportData.length === 0) {
      this.snackBar.open('No data available to download', 'Close', { duration: 3000 });
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
    XLSX.writeFile(workbook, 'Expense_Report.xlsx');
  }

  applyReportFilter(event: any): void {
    // Set the filter value on the dataSource
    this.reportDataSource.filter = this.reportFilterValue.trim().toLowerCase();
    
    // Reset to first page when filter changes
    if (this.reportDataSource.paginator) {
      this.reportDataSource.paginator.firstPage();
    }
  }

  getLabelMasterList(): void {
    this.masterService.getlabelmasterdetails().subscribe({
      next: (data: ExpenseLabel[]) => {
        this.labels = data;
      }
    });
  }
}
