/**
 * Employee Master Service
 * Handles all employee-related API operations
 */

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Employee, CreateEmployeeRequest } from '../models';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.EMPLOYEE.GET_ALL}`;

  constructor(
    protected override http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(http);
  }

  /**
   * Get all employees
   */
  getEmployeedetails(): Observable<Employee[]> {
    const currentuser = isPlatformBrowser(this.platformId) ? localStorage.getItem('username') || '' : '';
    const url = `${this.baseUrl}?currentuser=${encodeURIComponent(currentuser)}`;
    return this.get<Employee[]>(url);
  }

  /**
   * Create or update employee
   */
  insertEmployeedetails(entryData: CreateEmployeeRequest): Observable<Employee> {
    return this.post<Employee>(this.baseUrl, entryData);
  }

  /**
   * Update employee by ID
   */
  updateEmployee(id: number, entryData: CreateEmployeeRequest): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.put<any>(url, entryData);
  }

  /**
   * Delete employee by ID
   */
  deleteEmployee(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }
}
