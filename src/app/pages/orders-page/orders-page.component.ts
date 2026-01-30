import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { OrderInterface } from '../../core/interfaces/order.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders-page',
  imports: [TagModule, TableModule, RatingModule, CommonModule, FormsModule, ButtonModule, ToastModule, Card, RouterLink, TranslatePipe],
  templateUrl: './orders-page.component.html',
  providers: [MessageService],
  styleUrl: './orders-page.component.css',
})
export class OrdersPageComponent {
  private orderService = inject(OrderService);

  public orders: OrderInterface[] = [];

  public ngOnInit(): void {
    this.orders = this.orderService.getOrders();
  }
}
