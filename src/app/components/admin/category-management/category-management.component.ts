import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  showModal = false;
  isEditMode = false;

  currentCategory: any = {
    id: 0,
    name: ''
  };

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        this.toastService.info('Đã tải ' + data.length + ' danh mục từ hệ thống');
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Không thể tải danh mục: ' + (err.error?.message || err.message));
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentCategory = { id: 0, name: '' };
    this.showModal = true;
  }

  openEditModal(category: Category) {
    this.isEditMode = true;
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (this.isEditMode) {
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
          this.toastService.success('Cập nhật danh mục thành công!');
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    } else {
      this.categoryService.addCategory(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
          this.toastService.success('Thêm danh mục thành công!');
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Hệ thống có thể bị ảnh hưởng nếu sản phẩm vẫn còn thuộc danh mục này.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.toastService.success('Đã xóa danh mục thành công!');
        },
        error: (err) => this.toastService.error('Lỗi khi xóa: ' + (err.error?.message || err.message))
      });
    }
  }
}
