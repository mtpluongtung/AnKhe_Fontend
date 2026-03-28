import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from './product.service';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5228/api/Users';

  constructor(private http: HttpClient) { }

  getUsers(pageIndex: number = 1, pageSize: number = 10, searchTerm?: string): Observable<PagedResult<User>> {
    let url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${searchTerm}`;
    return this.http.get<PagedResult<User>>(url);
  }

  updateUserRole(id: string, role: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/role`, { role });
  }
}
