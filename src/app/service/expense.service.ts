/**
 * Expense Service
 * Handles all expense-related API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ExpenseItem, CreateExpenseRequest, ExpenseLabel } from '../models';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.EXPENSE.GET_ALL}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get all expenses
   */
  getExpensedetails(): Observable<ExpenseItem[]> {
    return this.get<ExpenseItem[]>(this.baseUrl);
  }

  /**
   * Create or update expense
   */
  insertexpensedetails(entryData: CreateExpenseRequest | any): Observable<ExpenseItem> {
    return this.post<ExpenseItem>(this.baseUrl, entryData);
  }

  /**
   * Delete expense by ID
   */
  deleteExpense(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }
}
