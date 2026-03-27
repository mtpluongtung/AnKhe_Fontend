import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banner {
  id: number;
  name: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  info: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = 'http://localhost:5228/api/Banners';

  constructor(private http: HttpClient) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl);
  }

  getBanner(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.apiUrl}/${id}`);
  }

  addBanner(banner: Banner): Observable<Banner> {
    return this.http.post<Banner>(this.apiUrl, banner);
  }

  updateBanner(id: number, banner: Banner): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, banner);
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
