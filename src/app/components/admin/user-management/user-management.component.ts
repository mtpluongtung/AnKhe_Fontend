import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { UserService, User } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (result) => {
        this.users = result.data;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastService.show('Lỗi khi tải danh sách người dùng', 'danger');
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    
    // Prevent self-demotion to avoid losing admin access
    if (user.username === this.authService.currentUserValue.username && newRole === 'Customer') {
      if (!confirm('Bạn đang tự hạ quyền của chính mình. Bạn sẽ mất quyền truy cập vào trang Admin sau khi thực hiện. Bạn có chắc chắn không?')) {
        return;
      }
    }

    if (confirm(`Bạn có chắc chắn muốn đổi quyền của người dùng ${user.username} thành ${newRole}?`)) {
      this.userService.updateUserRole(user.id, newRole).subscribe({
        next: () => {
          this.toastService.show(`Đã cập nhật quyền cho ${user.username} thành ${newRole}`, 'success');
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.toastService.show('Lỗi khi cập nhật quyền', 'danger');
        }
      });
    }
  }
}
