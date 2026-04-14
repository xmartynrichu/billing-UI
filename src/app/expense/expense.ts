import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  displayedColumns: string[] = ['date', 'label', 'amount', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly expenseService: ExpenseService,
    private readonly masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: [new Date(), Validators.required],
      labelId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    });

    this.getLabelMasterList();
  }

  ngAfterViewInit(): void {
    this.expensesDataSource.paginator = this.paginator;
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
      entryby: 'admin'
    };

    this.expensesDataSource.data = [...this.expensesDataSource.data, newExpense];

    this.expenseForm.patchValue({
      labelId: null,
      amount: null
    });
  }

  removeExpense(index: number): void {
    this.expensesDataSource.data = this.expensesDataSource.data.filter((_, i) => i !== index);
  }

  getTotal(): number {
    return this.expensesDataSource.data.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  saveAll(): void {
    if (!this.expensesDataSource.data.length) return;

    this.expenseService.insertexpensedetails(this.expensesDataSource.data).subscribe({
      next: () => {
        this.snackBar.open('Saved successfully', 'OK', { duration: 2000 });

        // ✅ Reset expenses and form — no detectChanges() needed
        this.expensesDataSource.data = [];
        this.expenseForm.reset({
          date: new Date(),
          labelId: null,
          amount: null
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Save failed', 'OK', { duration: 2000 });
      }
    });
  }

  getLabelMasterList(): void {
    this.masterService.getlabelmasterdetails().subscribe({
      next: (data: ExpenseLabel[]) => {
        this.labels = data;
      }
    });
  }
}
