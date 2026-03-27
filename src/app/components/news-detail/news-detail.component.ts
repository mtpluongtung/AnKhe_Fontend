import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsService, News } from '../../services/news.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit {
  news: News | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadNewsDetail(id);
      }
    });
  }

  loadNewsDetail(id: number) {
    this.newsService.getSingleNews(id).subscribe({
      next: (data) => {
        this.news = data;
        this.loading = false;
        // Scroll to top when viewing a new article
        window.scrollTo(0, 0);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
