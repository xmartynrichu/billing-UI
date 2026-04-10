/**
 * Dashboard Service
 * Handles dashboard statistics API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { DashboardResponse } from '../models';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.DASHBOARD.GET_STATS}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get dashboard statistics and counts
   */
  getdashboarddetails(): Observable<DashboardResponse> {
    return this.get<DashboardResponse>(this.baseUrl);
  }
}
