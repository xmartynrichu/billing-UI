/**
 * Expense Module Models
 */

export interface ExpenseLabel {
  id: number;
  label_name: string;
  amt: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenseItem {
  date: Date;
  labelId: number;
  labelName: string;
  amount: number;
  entryby: string;
}

export interface CreateExpenseRequest {
  entryby: string;
  [key: string]: any; // For JSON array of expenses
}

export interface ExpenseLabelMaster {
  id: number;
  label_name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExpenseLabelRequest {
  entryby: string;
  label_name: string;
  description?: string;
}
