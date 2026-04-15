/**
 * Fish Master Service
 * Handles all fish-related API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Fish, CreateFishRequest } from '../models';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api-endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class FishService extends BaseApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.FISH.GET_ALL}`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Get all fish
   */
  getFishdetails(): Observable<Fish[]> {
    return this.get<Fish[]>(this.baseUrl);
  }

  /**
   * Create or update fish
   */
  insertFishdetails(entryData: CreateFishRequest): Observable<Fish> {
    return this.post<Fish>(this.baseUrl, entryData);
  }

  /**
   * Update fish by ID
   */
  updateFish(id: number, entryData: CreateFishRequest): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.put<any>(url, entryData);
  }

  /**
   * Delete fish by ID
   */
  deleteFish(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.delete<any>(url);
  }
}
