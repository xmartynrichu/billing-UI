/**
 * Dashboard Service
 * Handles dashboard statistics API operations
 */

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(
    protected override http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(http);
  }

  /**
   * Get dashboard statistics and counts
   */
  getdashboarddetails(): Observable<DashboardResponse> {
    const currentuser = isPlatformBrowser(this.platformId) ? localStorage.getItem('username') || '' : '';
    const url = `${this.baseUrl}?currentuser=${encodeURIComponent(currentuser)}`;
    return this.get<DashboardResponse>(url);
  }
}
