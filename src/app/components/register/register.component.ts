import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() { }

  register() {
    this.loading = true;
    this.authService.register(this.model)
      .subscribe({
        next: (data) => {
          this.toastService.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'Thành công');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastService.error('Đăng ký thất bại: ' + (err.error?.message || 'Có lỗi xảy ra'), 'Lỗi');
          this.loading = false;
        }
      });
  }
}
