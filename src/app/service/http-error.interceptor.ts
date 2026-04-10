/**
 * HTTP Error Interceptor
 * Handles global HTTP error responses
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(error);
        console.error('HTTP Error:', errorMessage);
        return throwError(() => error);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client Error: ${error.error.message}`;
    } else {
      return `Server Error: ${error.status} - ${error.statusText}`;
    }
  }
}
