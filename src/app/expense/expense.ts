import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MasterService } from '../service/master.service';
import { ExpenseService } from '../service/expense.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
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
export class Expense implements OnInit {

  expenseForm!: FormGroup;
  labels: ExpenseLabel[] = [];
  expenses: ExpenseItem[] = [];

  displayedColumns: string[] = ['date', 'label', 'amount', 'actions'];

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

  labelprice(label: ExpenseLabel): void {
    this.expenseForm.patchValue({ amount: label.amt });
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

    this.expenses = [...this.expenses, newExpense];

    this.expenseForm.patchValue({
      labelId: null,
      amount: null
    });
  }

  removeExpense(index: number): void {
    this.expenses = this.expenses.filter((_, i) => i !== index);
  }

  getTotal(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  saveAll(): void {
    if (!this.expenses.length) return;

    this.expenseService.insertexpensedetails(this.expenses).subscribe({
      next: () => {
        this.snackBar.open('Saved successfully', 'OK', { duration: 2000 });

        // ✅ Reset expenses and form — no detectChanges() needed
        this.expenses = [];
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
