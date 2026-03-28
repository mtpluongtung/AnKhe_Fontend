import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { CategoryService, Category } from '../../../services/category.service';
import { PagedResult } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  showModal = false;
  isEditMode = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';

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
    this.loading = true;
    this.categoryService.getCategories(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (result: PagedResult<Category>) => {
        console.log('Categories loaded:', result);
        this.categories = result.data;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Không thể tải danh mục: ' + (err.error?.message || err.message));
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadCategories();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCategories();
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
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
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
