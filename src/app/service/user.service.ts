/**
 * User Service
 * Handles all user-related API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { User, CreateUserRequest } from '../models';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.USERS.GET_ALL}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get all users
   */
  getUserdetails(): Observable<User[]> {
    return this.get<User[]>(this.baseUrl);
  }

  /**
   * Create or update user
   */
  insertuserdetails(userData: CreateUserRequest): Observable<User> {
    return this.post<User>(this.baseUrl, userData);
  }

  /**
   * Delete user by ID
   */
  deleteUser(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }

  /**
   * Update user by ID
   */
  updateUser(id: number, userData: CreateUserRequest): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.put<any>(url, userData);
  }
}
