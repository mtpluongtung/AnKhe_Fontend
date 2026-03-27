import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateOrderStatus(orderId: number, status: string, cancelReason?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status, cancelReason });
  }
}
