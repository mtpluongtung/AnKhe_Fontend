import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:5228/api/Statistics';

  constructor(private http: HttpClient) { }

  getRevenueStats(period: string = 'monthly'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/revenue-stats?period=${period}`);
  }

  getConfirmedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/confirmed-products`);
  }
}
