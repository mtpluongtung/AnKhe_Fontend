import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  showModal = false;
  isEditMode = false;

  currentProduct: any = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: 1,
    isHot: false,
    stockQuantity: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts(1, 100).subscribe({
      next: (result) => {
        this.products = result.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: this.categories.length > 0 ? this.categories[0].id : 1,
      isHot: false,
      stockQuantity: 0
    };
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.isEditMode = true;
    this.currentProduct = { ...product };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    if (this.isEditMode) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.toastService.success('Cập nhật sản phẩm thành công!');
        },
        error: (err) => this.toastService.error('Lỗi khi cập nhật: ' + (err.error?.message || err.message))
      });
    } else {
      this.productService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.toastService.success('Thêm sản phẩm thành công!');
        },
        error: (err) => this.toastService.error('Lỗi khi thêm: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.toastService.success('Đã xóa sản phẩm thành công!');
        },
        error: (err) => this.toastService.error('Lỗi khi xóa: ' + (err.error?.message || err.message))
      });
    }
  }
}
