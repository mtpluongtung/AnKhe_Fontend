import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
      if (categoryId) {
        this.productService.getProductsByCategory(categoryId).subscribe(data => {
          this.products = data;
        });
      } else {
        this.productService.getProducts(1, 20).subscribe(result => {
          this.products = result.data;
        });
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.success(`Đã thêm "${product.name}" vào giỏ hàng!`, 'Giỏ hàng');
  }
}
