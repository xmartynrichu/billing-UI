/**
 * Base API Service
 * Provides common HTTP methods with error handling and logging
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { environment } from '../../environment/environment';

/**
 * Base service for all API calls
 * Centralizes HTTP communication with error handling
 */
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private readonly apiTimeout = environment.apiTimeout || 30000; // Default to 30 seconds

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   */
  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint).pipe(
      timeout(this.apiTimeout),
      tap(response => this.logResponse('GET', endpoint, response)),
      catchError(error => this.handleError(error, 'GET', endpoint))
    );
  }

  /**
   * POST request
   */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(endpoint, body).pipe(
      timeout(this.apiTimeout),
      tap(response => this.logResponse('POST', endpoint, response)),
      catchError(error => this.handleError(error, 'POST', endpoint))
    );
  }

  /**
   * PUT request
   */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(endpoint, body).pipe(
      timeout(this.apiTimeout),
      tap(response => this.logResponse('PUT', endpoint, response)),
      catchError(error => this.handleError(error, 'PUT', endpoint))
    );
  }

  /**
   * DELETE request
   */
  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(endpoint).pipe(
      timeout(this.apiTimeout),
      tap(response => this.logResponse('DELETE', endpoint, response)),
      catchError(error => this.handleError(error, 'DELETE', endpoint))
    );
  }

  /**
   * Error handling
   */
  private handleError(error: HttpErrorResponse, method: string, endpoint: string) {
    let errorMessage = 'An unknown error occurred';

    // Check if ErrorEvent is defined (exists in browser, not in SSR)
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error or SSR environment
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(`[${method}] ${endpoint}:`, errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Log successful response
   */
  private logResponse(method: string, endpoint: string, response: any) {
    console.log(`[${method}] ${endpoint} - Success`, response);
  }
}
