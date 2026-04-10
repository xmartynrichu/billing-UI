import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';




@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) {}

  // GET users (optional / testing)
  checkloginuser(userData: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/users/usercheck`;
    return this.http.post<any>(url,userData);
  }


}
