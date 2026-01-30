import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { OrderInterface } from '../core/interfaces/order.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private localStorageKey = 'orders';

  private orders: OrderInterface[] = [];

  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    let ordersJson = null;

    if (isPlatformBrowser(this.platformId)) {
      ordersJson = localStorage.getItem(this.localStorageKey);
    }

    this.orders = ordersJson ? JSON.parse(ordersJson) : [];
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.orders));
    }
  }

  public addOrder(order: OrderInterface): void {
    this.orders.push(order);
    this.saveToStorage();
  }

  public getOrders(): OrderInterface[] {
    return this.orders;
  }

  public updateOrder(order: OrderInterface): void {
    this.orders = this.orders.map((o: OrderInterface) => (o.id === order.id ? order : o));
    this.saveToStorage();
  }

  public deleteOrder(id: string): void {
    this.orders = this.orders.filter((o: OrderInterface) => o.id !== id);
    this.saveToStorage();
  }
}
