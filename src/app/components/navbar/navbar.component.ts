import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CategoryService, Category } from '../../services/category.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  getCategoryIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('laptop')) return 'bi-laptop';
    if (n.includes('pc')) return 'bi-pc-display';
    if (n.includes('linh kiện')) return 'bi-cpu';
    if (n.includes('phụ kiện')) return 'bi-mouse3';
    return 'bi-tag';
  }

  logout() {
    this.authService.logout();
  }
}
