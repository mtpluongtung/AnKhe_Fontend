import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService, OrderDto } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  showOrderModal = false;
  orderInfo = {
    shippingAddress: '',
    receiverName: '',
    receiverPhoneNumber: ''
  };

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: string) {
    this.cartService.updateQuantity(productId, parseInt(quantity));
  }

  openOrderModal() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Vui lòng đăng nhập để đặt hàng!', 'Yêu cầu đăng nhập');
      return;
    }
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
  }

  confirmOrder() {
    const order: OrderDto = {
      totalAmount: this.totalAmount,
      shippingAddress: this.orderInfo.shippingAddress,
      receiverName: this.orderInfo.receiverName,
      receiverPhoneNumber: this.orderInfo.receiverPhoneNumber,
      orderDetails: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    this.orderService.placeOrder(order).subscribe({
      next: () => {
        this.toastService.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', 'Chúc mừng');
        this.cartService.clearCart();
        this.closeOrderModal();
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Có lỗi xảy ra khi đặt hàng';
        this.toastService.error(errorMsg, 'Lỗi đặt hàng');
      }
    });
  }
}
