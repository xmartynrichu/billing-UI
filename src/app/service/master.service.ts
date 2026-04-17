import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';




@Injectable({
  providedIn: 'root',
})
export class MasterService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  insertlabeldetails(data: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/labelmaster`;
    return this.http.post<any>(url, data);
  }
  getlabelmasterdetails(): Observable<any> {
    const currentuser = isPlatformBrowser(this.platformId) ? localStorage.getItem('username') || '' : '';
    const url = `${environment.apiBaseUrl}/labelmaster?currentuser=${encodeURIComponent(currentuser)}`;
    return this.http.get<any>(url);
  }

  deletelabelmaster(id: number): Observable<any> {
  const url = `${environment.apiBaseUrl}/labelmaster/${id}`;
  return this.http.delete<any>(url);
}


}
