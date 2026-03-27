import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Banner, BannerService } from '../../services/banner.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  hotProducts: Product[] = [];
  banners: Banner[] = [];
  currentBannerIndex = 0;
  bannerSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private bannerService: BannerService
  ) { }

  ngOnInit(): void {
    this.productService.getHotProducts().subscribe(data => {
      this.hotProducts = data;
    });

    this.bannerService.getBanners().subscribe(data => {
      this.banners = data.filter(b => b.status === 'Active');
      if (this.banners.length > 1) {
        this.startBannerTimer();
      }
    });
  }

  startBannerTimer() {
    this.bannerSubscription = interval(3000).subscribe(() => {
      this.nextBanner();
    });
  }

  nextBanner() {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  prevBanner() {
    this.currentBannerIndex = (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }

  ngOnDestroy() {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.success(`Đã thêm "${product.name}" vào giỏ hàng!`, 'Giỏ hàng');
  }
}
