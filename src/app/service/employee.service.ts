/**
 * Employee Master Service
 * Handles all employee-related API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get all employees
   */
  getEmployeedetails(): Observable<Employee[]> {
    return this.get<Employee[]>(this.baseUrl);
  }

  /**
   * Create or update employee
   */
  insertEmployeedetails(entryData: CreateEmployeeRequest): Observable<Employee> {
    return this.post<Employee>(this.baseUrl, entryData);
  }

  /**
   * Delete employee by ID
   */
  deleteEmployee(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }
}
