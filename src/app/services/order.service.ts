import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PagedResult } from './product.service';

export interface OrderDetailDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  totalAmount: number;
  shippingAddress: string;
  receiverName: string;
  receiverPhoneNumber: string;
  orderDetails: OrderDetailDto[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5228/api/Orders';

  constructor(private http: HttpClient) { }

  placeOrder(order: OrderDto): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  getUserOrders(pageIndex: number = 1, pageSize: number = 10, searchTerm?: string): Observable<PagedResult<any>> {
    let url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (searchTerm) url += `&searchTerm=${searchTerm}`;
    return this.http.get<PagedResult<any>>(url);
  }

  updateOrderStatus(orderId: number, status: string, cancelReason?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status, cancelReason });
  }
}
