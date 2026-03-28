import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from './product.service';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5228/api/Categories';

  constructor(private http: HttpClient) { }

  getCategories(pageIndex: number = 1, pageSize: number = 10, searchTerm?: string): Observable<PagedResult<Category>> {
    let url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${searchTerm}`;
    return this.http.get<PagedResult<Category>>(url);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
