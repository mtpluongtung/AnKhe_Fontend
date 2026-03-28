import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  loading = true;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cartService: CartService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        if (this.product.categoryId) {
          this.loadRelatedProducts(this.product.categoryId, id);
        }
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.loading = false;
        this.toastService.error('Không thể tải thông tin sản phẩm', 'Lỗi');
      }
    });
  }

  loadRelatedProducts(categoryId: number, currentId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe(products => {
      this.relatedProducts = products.filter(p => p.id !== currentId).slice(0, 5);
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.toastService.success(`Đã thêm "${this.product.name}" vào giỏ hàng!`, 'Giỏ hàng');
    }
  }
}
