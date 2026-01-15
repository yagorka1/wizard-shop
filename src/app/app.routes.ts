import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { OrderCreatePage } from './pages/order-create-page/order-create-page.component';
import { OrdersPage } from './pages/orders-page/orders-page';

export const routes: Routes = [
    {
        path: '',
        component: Landing
    },
    {
        path: 'orders',
        component: OrdersPage
    },
    {
        path: 'order-create',
        component: OrderCreatePage
    }
];
