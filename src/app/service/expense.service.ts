/**
 * Expense Service
 * Handles all expense-related API operations
 */

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(
    protected override http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(http);
  }

  /**
   * Get all expenses
   */
  getExpensedetails(): Observable<ExpenseItem[]> {
    const currentuser = isPlatformBrowser(this.platformId) ? localStorage.getItem('username') || '' : '';
    const url = `${this.baseUrl}?currentuser=${encodeURIComponent(currentuser)}`;
    return this.get<ExpenseItem[]>(url);
  }

  /**
   * Create or update expense
   */
  insertexpensedetails(entryData: CreateExpenseRequest | any): Observable<ExpenseItem> {
    return this.post<ExpenseItem>(this.baseUrl, entryData);
  }

  /**
   * Update expense details
   */
  updateExpense(headerId: number, expenseData: any): Observable<any> {
    const url = `${this.baseUrl}/${headerId}`;
    return this.put<any>(url, expenseData);
  }

  /**
   * Delete expense by ID
   */
  deleteExpense(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }
}
