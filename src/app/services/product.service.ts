import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  category?: any;
  isHot: boolean;
  viewCount: number;
  stockQuantity: number;
}

export interface PagedResult<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: T[];
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5228/api/Products';

  constructor(private http: HttpClient) { }

  getProducts(
    pageIndex: number = 1, 
    pageSize: number = 10, 
    categoryId?: number, 
    minPrice?: number, 
    maxPrice?: number, 
    sort?: string,
    searchTerm?: string
  ): Observable<PagedResult<Product>> {
    let url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (sort) url += `&sort=${sort}`;
    if (searchTerm) url += `&searchTerm=${searchTerm}`;
    return this.http.get<PagedResult<Product>>(url);
  }

  getHotProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/hot`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }



  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

