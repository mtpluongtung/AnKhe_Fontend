import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface News {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  content: string;
  createdDate: Date;
  viewsCount: number;
  isHot: boolean;
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
export class NewsService {
  private apiUrl = 'http://localhost:5228/api/News';

  constructor(private http: HttpClient) { }

  getNews(pageIndex: number = 1, pageSize: number = 10): Observable<PagedResult<News>> {
    return this.http.get<PagedResult<News>>(`${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  getSingleNews(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  createNews(news: any): Observable<News> {
    return this.http.post<News>(this.apiUrl, news);
  }

  updateNews(id: number, news: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, news);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
