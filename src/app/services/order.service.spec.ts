import { TestBed } from '@angular/core/testing';
import { OrderInterface } from '../core/interfaces/order.interface';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return localStorageMock[key] || null;
    });
    
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete localStorageMock[key];
    });

    TestBed.configureTestingModule({
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockOrder = (id: string = '1'): OrderInterface => ({
    id,
    name: 'Test Order',
    number: '12345',
    date: '2025-01-15',
    readyDate: '2025-01-20',
    address: 'Test Address',
    delivery: 'courier',
    payment: 'card',
    ingredients: [],
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load orders from localStorage on initialization', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('orders');
  });

  it('should return empty array when no orders in localStorage', () => {
    expect(service.getOrders()).toEqual([]);
  });

  describe('addOrder', () => {
    it('should add an order and save to localStorage', () => {
      const order = createMockOrder();
      
      service.addOrder(order);
      
      expect(service.getOrders()).toContainEqual(order);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should add multiple orders', () => {
      const order1 = createMockOrder('1');
      const order2 = createMockOrder('2');
      
      service.addOrder(order1);
      service.addOrder(order2);
      
      expect(service.getOrders()).toHaveLength(2);
    });
  });

  describe('getOrders', () => {
    it('should return all orders', () => {
      const order1 = createMockOrder('1');
      const order2 = createMockOrder('2');
      
      service.addOrder(order1);
      service.addOrder(order2);
      
      const orders = service.getOrders();
      
      expect(orders).toHaveLength(2);
      expect(orders).toContainEqual(order1);
      expect(orders).toContainEqual(order2);
    });
  });

  describe('updateOrder', () => {
    it('should update an existing order', () => {
      const order = createMockOrder('1');
      service.addOrder(order);
      
      const updatedOrder: OrderInterface = {
        ...order,
        name: 'Updated Order Name',
      };
      
      service.updateOrder(updatedOrder);
      
      const orders = service.getOrders();
      expect(orders).toHaveLength(1);
      expect(orders[0].name).toBe('Updated Order Name');
    });

    it('should save to localStorage after update', () => {
      const order = createMockOrder('1');
      service.addOrder(order);
      
      vi.mocked(localStorage.setItem).mockClear();
      
      service.updateOrder({ ...order, name: 'New Name' });
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should not modify other orders when updating one', () => {
      const order1 = createMockOrder('1');
      const order2 = createMockOrder('2');
      service.addOrder(order1);
      service.addOrder(order2);
      
      service.updateOrder({ ...order1, name: 'Updated' });
      
      const orders = service.getOrders();
      expect(orders.find(o => o.id === '2')?.name).toBe('Test Order');
    });
  });

  describe('deleteOrder', () => {
    it('should delete an existing order', () => {
      const order = createMockOrder('1');
      service.addOrder(order);
      
      service.deleteOrder('1');
      
      expect(service.getOrders()).toHaveLength(0);
    });

    it('should save to localStorage after deletion', () => {
      const order = createMockOrder('1');
      service.addOrder(order);
      
      vi.mocked(localStorage.setItem).mockClear();
      
      service.deleteOrder('1');
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should only delete the specified order', () => {
      const order1 = createMockOrder('1');
      const order2 = createMockOrder('2');
      service.addOrder(order1);
      service.addOrder(order2);
      
      service.deleteOrder('1');
      
      const orders = service.getOrders();
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('2');
    });

    it('should do nothing if order id does not exist', () => {
      const order = createMockOrder('1');
      service.addOrder(order);
      
      service.deleteOrder('non-existent');
      
      expect(service.getOrders()).toHaveLength(1);
    });
  });
});
