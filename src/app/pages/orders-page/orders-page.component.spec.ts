import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OrderInterface } from '../../core/interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { OrdersPageComponent } from './orders-page.component';

describe('OrdersPageComponent', () => {
  let component: OrdersPageComponent;
  let fixture: ComponentFixture<OrdersPageComponent>;
  let orderServiceSpy: any;

  const mockOrders: OrderInterface[] = [
    {
      id: '1',
      name: 'Test Order 1',
      number: '12345',
      date: '2025-01-15',
      readyDate: '2025-01-20',
      address: 'Test Address 1',
      delivery: 'courier',
      payment: 'card',
      ingredients: [],
    },
    {
      id: '2',
      name: 'Test Order 2',
      number: '67890',
      date: '2025-01-16',
      readyDate: '2025-01-21',
      address: 'Test Address 2',
      delivery: 'pickup',
      payment: 'cash',
      ingredients: [],
    },
  ];

  beforeEach(async () => {
    orderServiceSpy = {
      getOrders: vi.fn().mockReturnValue(mockOrders),
      addOrder: vi.fn(),
      updateOrder: vi.fn(),
      deleteOrder: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OrdersPageComponent],
      providers: [
        provideRouter([]),
        { provide: OrderService, useValue: orderServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load orders on initialization', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(orderServiceSpy.getOrders).toHaveBeenCalled();
      expect(component.orders).toEqual(mockOrders);
    });

    it('should have empty orders initially before ngOnInit', () => {
      expect(component.orders).toEqual([]);
    });
  });

  describe('Delivery Labels', () => {
    it('should have correct delivery labels', () => {
      expect(component.deliveryLabels['courier']).toBe('Курьером');
      expect(component.deliveryLabels['pickup']).toBe('Самовывоз');
      expect(component.deliveryLabels['post']).toBe('Почта');
    });

    it('should return correct label for order delivery type', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const order = component.orders[0];
      expect(component.deliveryLabels[order.delivery]).toBe('Курьером');
    });
  });

  describe('Payment Labels', () => {
    it('should have correct payment labels', () => {
      expect(component.paymentLabels['cash']).toBe('Наличными');
      expect(component.paymentLabels['card']).toBe('Картой');
      expect(component.paymentLabels['online']).toBe('Онлайн');
      expect(component.paymentLabels['crypto']).toBe('Криптовалютой');
    });

    it('should return correct label for order payment type', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const order = component.orders[1];
      expect(component.paymentLabels[order.payment]).toBe('Наличными');
    });
  });

  describe('Empty State', () => {
    it('should handle empty orders array', () => {
      orderServiceSpy.getOrders.mockReturnValue([]);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.orders).toEqual([]);
      expect(component.orders.length).toBe(0);
    });
  });
});
