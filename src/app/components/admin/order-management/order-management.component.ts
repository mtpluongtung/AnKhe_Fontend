import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  showCancelModal = false;
  selectedOrder: any = null;
  cancelReason = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';

  constructor(
    private orderService: OrderService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getUserOrders(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (result) => {
        this.orders = result.data;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  updateStatus(order: any, status: string) {
    if (status === 'Cancelled') {
      this.selectedOrder = order;
      this.cancelReason = '';
      this.showCancelModal = true;
      return;
    }

    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        this.toastService.success(`Cập nhật trạng thái đơn hàng #${order.id} thành ${status}`);
        this.loadOrders();
      },
      error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
    });
  }

  confirmCancel() {
    if (!this.cancelReason.trim()) {
      this.toastService.warning('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    this.orderService.updateOrderStatus(this.selectedOrder.id, 'Cancelled', this.cancelReason).subscribe({
      next: () => {
        this.toastService.success(`Đã hủy đơn hàng #${this.selectedOrder.id}`);
        this.showCancelModal = false;
        this.loadOrders();
      },
      error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
    });
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.selectedOrder = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'badge bg-warning';
      case 'Completed': return 'badge bg-success';
      case 'Cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}
