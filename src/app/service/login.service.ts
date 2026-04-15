import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';




@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) {}

  // Check login user
  checkloginuser(userData: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/users/usercheck`;
    return this.http.post<any>(url,userData);
  }

  // Register new user
  signup(userData: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/users`;
    return this.http.post<any>(url, userData);
  }


}
