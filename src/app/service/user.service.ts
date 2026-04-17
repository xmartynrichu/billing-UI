/**
 * User Service
 * Handles all user-related API operations
 */

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(
    protected override http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(http);
  }

  /**
   * Get all users
   */
  getUserdetails(): Observable<User[]> {
    const currentuser = isPlatformBrowser(this.platformId) ? localStorage.getItem('username') || 'system' : 'system';
    const url = `${this.baseUrl}?currentuser=${encodeURIComponent(currentuser)}`;
    return this.get<User[]>(url);
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
