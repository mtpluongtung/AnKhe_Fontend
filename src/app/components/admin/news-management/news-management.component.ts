import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { NewsService, News } from '../../../services/news.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-news-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './news-management.component.html'
})
export class NewsManagementComponent implements OnInit {
  newsList: News[] = [];
  loading = true;
  showModal = false;
  isEditMode = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';

  currentNews: any = {
    id: 0,
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    isHot: false
  };

  constructor(
    private newsService: NewsService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading = true;
    this.newsService.getNews(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (result) => {
        this.newsList = result.data;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadNews();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadNews();
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentNews = {
      id: 0,
      title: '',
      description: '',
      content: '',
      imageUrl: '',
      isHot: false
    };
    this.showModal = true;
  }

  openEditModal(news: News) {
    this.isEditMode = true;
    this.currentNews = { ...news };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveNews() {
    if (this.isEditMode) {
      this.newsService.updateNews(this.currentNews.id, this.currentNews).subscribe({
        next: () => {
          this.toastService.success('Cập nhật tin tức thành công!');
          this.loadNews();
          this.closeModal();
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    } else {
      this.newsService.createNews(this.currentNews).subscribe({
        next: () => {
          this.toastService.success('Đăng tin tức mới thành công!');
          this.loadNews();
          this.closeModal();
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteNews(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa tin tức thành công!');
          this.loadNews();
        },
        error: (err) => this.toastService.error('Lỗi khi xóa: ' + (err.error?.message || err.message))
      });
    }
  }
}
