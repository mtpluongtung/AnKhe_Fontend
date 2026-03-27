import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Banner, BannerService } from '../../../services/banner.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-banner-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banner-management.component.html',
  styleUrl: './banner-management.component.css'
})
export class BannerManagementComponent implements OnInit {
  banners: Banner[] = [];
  loading = true;
  showModal = false;
  isEditMode = false;
  
  editingBanner: Banner = this.getEmptyBanner();

  constructor(
    private bannerService: BannerService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadBanners();
  }

  getEmptyBanner(): Banner {
    return {
      id: 0,
      name: '',
      imageUrl: '',
      linkUrl: '',
      position: 'Home',
      info: '',
      status: 'Active'
    };
  }

  loadBanners() {
    this.loading = true;
    this.bannerService.getBanners().subscribe({
      next: (data) => {
        this.banners = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingBanner = this.getEmptyBanner();
    this.showModal = true;
  }

  openEditModal(banner: Banner) {
    this.isEditMode = true;
    this.editingBanner = { ...banner };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveBanner() {
    this.toastService.info('Đang gửi yêu cầu lưu banner...');
    if (!this.editingBanner.name || !this.editingBanner.imageUrl) {
      this.toastService.warning('Vui lòng nhập tên và đường dẫn ảnh');
      return;
    }

    if (this.isEditMode) {
      this.bannerService.updateBanner(this.editingBanner.id, this.editingBanner).subscribe({
        next: () => {
          this.toastService.success('Cập nhật banner thành công');
          this.loadBanners();
          this.closeModal();
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    } else {
      this.bannerService.addBanner(this.editingBanner).subscribe({
        next: () => {
          this.toastService.success('Thêm banner thành công');
          this.loadBanners();
          this.closeModal();
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteBanner(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      this.bannerService.deleteBanner(id).subscribe({
        next: () => {
          this.toastService.success('Xóa banner thành công');
          this.loadBanners();
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    }
  }
}
