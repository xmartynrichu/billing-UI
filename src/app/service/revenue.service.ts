/**
 * Revenue Service
 * Handles all revenue-related API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Revenue, CreateRevenueRequest } from '../models';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class RevenueService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.REVENUE.GET_ALL}`;
  private readonly fishUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.FISH.GET_ALL}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get all revenue records
   */
  getRevenuedetails(): Observable<Revenue[]> {
    return this.get<Revenue[]>(this.baseUrl);
  }

  /**
   * Create or update revenue record
   */
  insertRevenuedetails(entryData: CreateRevenueRequest): Observable<Revenue> {
    return this.post<Revenue>(this.baseUrl, entryData);
  }

  /**
   * Update revenue record by ID
   */
  updateRevenue(id: number, entryData: CreateRevenueRequest): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.put<any>(url, entryData);
  }

  /**
   * Delete revenue record by ID
   */
  deleteRevenue(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }

  /**
   * Get all fish names for dropdown
   */
  getFishList(): Observable<any[]> {
    return this.get<any[]>(this.fishUrl);
  }
}
