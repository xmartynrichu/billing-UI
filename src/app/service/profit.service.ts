/**
 * Profit Service
 * Handles all profit report API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

export interface ProfitReport {
  date: string;
  revenue: number;
  expense: number;
  profit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfitService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.PROFIT.GET_ALL}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get all profit report data
   */
  getProfitReport(): Observable<ProfitReport[]> {
    return this.get<ProfitReport[]>(this.baseUrl);
  }

  /**
   * Send profit report via email with Excel attachment
   * Backend fetches fresh data from database using get_profittomail function
   */
  sendProfitReportEmail(reportPayload: any, recipientEmail: string): Observable<any> {
    const mailUrl = `${environment.apiBaseUrl}/mail/send-profit-report`;
    return this.post<any>(mailUrl, reportPayload);
  }
}
