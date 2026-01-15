import { Injectable, signal } from '@angular/core';
import { OrderInterface } from '../core/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private localStorageKey = 'orders';

  private orders:  OrderInterface[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const ordersJson = localStorage.getItem(this.localStorageKey);
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    this.orders = orders;
  }

  private saveToStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.orders));
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
