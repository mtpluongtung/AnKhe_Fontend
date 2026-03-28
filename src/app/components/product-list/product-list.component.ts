import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy: string = 'newest';
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'] ? +params['id'] : undefined;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.productService.getProducts(1, 50, this.categoryId, this.minPrice, this.maxPrice, this.sortBy).subscribe(result => {
      this.products = result.data;
    });
  }

  applyFilters(): void {
    this.loadProducts();
  }

  resetFilters(): void {
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.sortBy = 'newest';
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.success(`Đã thêm "${product.name}" vào giỏ hàng!`, 'Giỏ hàng');
  }
}
