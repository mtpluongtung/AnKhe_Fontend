import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductManagementComponent } from './components/admin/product-management/product-management.component';
import { CategoryManagementComponent } from './components/admin/category-management/category-management.component';
import { NewsManagementComponent } from './components/admin/news-management/news-management.component';
import { BannerManagementComponent } from './components/admin/banner-management/banner-management.component';
import { OrderManagementComponent } from './components/admin/order-management/order-management.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'products/category/:id', component: ProductListComponent },
    { path: 'laptop', component: ProductListComponent },
    { path: 'pc', component: ProductListComponent },
    { path: 'linh-kien', component: ProductListComponent },
    { path: 'tin-tuc', component: NewsListComponent },
    { path: 'tin-tuc/:id', component: NewsDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'cart', component: CartComponent },
    { path: 'orders', component: OrdersComponent },
    { 
        path: 'admin', 
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: ProductManagementComponent },
            { path: 'categories', component: CategoryManagementComponent },
            { path: 'news', component: NewsManagementComponent },
            { path: 'orders', component: OrderManagementComponent },
            { path: 'banners', component: BannerManagementComponent }
        ]
    }
];
