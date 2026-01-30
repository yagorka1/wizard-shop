import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { OrderCreatePage } from './pages/order-create-page/order-create-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'orders',
    component: OrdersPageComponent,
  },
  {
    path: 'order-create',
    component: OrderCreatePage,
  }
];
