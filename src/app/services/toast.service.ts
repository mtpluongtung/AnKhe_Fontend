import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts$ = new BehaviorSubject<Toast[]>([]);

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info', title?: string, delay: number = 3000) {
    const toast: Toast = { message, type, title, delay };
    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, toast]);

    setTimeout(() => {
      this.remove(toast);
    }, delay);
  }

  success(message: string, title: string = 'Thành công') {
    this.show(message, 'success', title);
  }

  error(message: string, title: string = 'Lỗi') {
    this.show(message, 'danger', title);
  }

  warning(message: string, title: string = 'Cảnh báo') {
    this.show(message, 'warning', title);
  }

  info(message: string, title: string = 'Thông báo') {
    this.show(message, 'info', title);
  }

  remove(toast: Toast) {
    const currentToasts = this.toasts$.value.filter(t => t !== toast);
    this.toasts$.next(currentToasts);
  }
}
