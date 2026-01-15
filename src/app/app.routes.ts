import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { OrderCreatePage } from './pages/order-create-page/order-create-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';

export const routes: Routes = [
    {
        path: '',
        component: Landing,
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
