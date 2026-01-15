import { Injectable } from '@angular/core';
import { OrderInterface } from '../core/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: OrderInterface[] = [];

  public addOrder(order: OrderInterface): void {
    this.orders.push(order);
  }

  public getOrders(): OrderInterface[] {
    return this.orders;
  }

  public deleteOrder(id: string): void {
    this.orders = this.orders.filter((item: OrderInterface) => id !== item.id);
  }
}
