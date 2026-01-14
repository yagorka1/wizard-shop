import { Routes } from '@angular/router';
import { OrdersPage } from './pages/orders-page/orders-page';
import { OrderCreatePage } from './pages/order-create-page/order-create-page';
import { Landing } from './pages/landing/landing';

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
