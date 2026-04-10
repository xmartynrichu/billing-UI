import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';




@Injectable({
  providedIn: 'root',
})
export class MasterService {

  constructor(private http: HttpClient) {}

  insertlabeldetails(data: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/labelmaster`;
    return this.http.post<any>(url, data);
  }
  getlabelmasterdetails(): Observable<any> {
    const url = `${environment.apiBaseUrl}/labelmaster`;
    return this.http.get<any>(url);
  }

  deletelabelmaster(id: number): Observable<any> {
  const url = `${environment.apiBaseUrl}/labelmaster/${id}`;
  return this.http.delete<any>(url);
}


}
