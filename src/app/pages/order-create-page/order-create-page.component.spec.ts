import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderCreatePage } from './order-create-page.component';

describe('OrderCreatePage', () => {
  let component: OrderCreatePage;
  let fixture: ComponentFixture<OrderCreatePage>;
  let orderServiceSpy: any;

  beforeEach(async () => {
    orderServiceSpy = {
      addOrder: vi.fn(),
      getOrders: vi.fn().mockReturnValue([]),
      updateOrder: vi.fn(),
      deleteOrder: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OrderCreatePage],
      providers: [
        provideRouter([]),
        { provide: OrderService, useValue: orderServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form on ngOnInit', () => {
      expect(component.form).toBeDefined();
    });

    it('should have all required form controls', () => {
      expect(component.form.get('name')).toBeDefined();
      expect(component.form.get('number')).toBeDefined();
      expect(component.form.get('date')).toBeDefined();
      expect(component.form.get('readyDate')).toBeDefined();
      expect(component.form.get('address')).toBeDefined();
      expect(component.form.get('delivery')).toBeDefined();
      expect(component.form.get('payment')).toBeDefined();
    });

    it('should have default delivery option as courier', () => {
      expect(component.form.get('delivery')?.value).toBe('courier');
    });

    it('should have default payment option as card', () => {
      expect(component.form.get('payment')?.value).toBe('card');
    });

    it('should start on ORDER step', () => {
      expect(component.step).toBe(component.steps.ORDER);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when name is empty', () => {
      component.form.patchValue({
        name: '',
        number: '12345',
        date: '2025-01-15',
        readyDate: '2025-01-20',
        address: 'Test Address',
      });

      expect(component.form.get('name')?.valid).toBe(false);
    });

    it('should be invalid when name is less than 2 characters', () => {
      component.form.get('name')?.setValue('A');
      expect(component.form.get('name')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid when name is more than 50 characters', () => {
      component.form.get('name')?.setValue('A'.repeat(51));
      expect(component.form.get('name')?.hasError('maxlength')).toBe(true);
    });

    it('should be invalid when number is empty', () => {
      component.form.get('number')?.setValue('');
      expect(component.form.get('number')?.valid).toBe(false);
    });

    it('should be invalid when address is empty', () => {
      component.form.get('address')?.setValue('');
      expect(component.form.get('address')?.valid).toBe(false);
    });

    it('should be invalid when ready date is before order date', () => {
      component.form.patchValue({
        date: '2025-01-20',
        readyDate: '2025-01-15',
      });
      component.form.updateValueAndValidity();
      
      expect(component.form.hasError('dateRange')).toBe(true);
    });

    it('should be valid with all correct values', () => {
      component.form.patchValue({
        name: 'Valid Name',
        number: '12345',
        date: '2025-01-15',
        readyDate: '2025-01-20',
        address: 'Valid Address',
        delivery: 'courier',
        payment: 'card',
      });

      expect(component.form.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should mark all controls as touched', () => {
      component.onSubmit();
      
      expect(component.form.get('name')?.touched).toBe(true);
      expect(component.form.get('number')?.touched).toBe(true);
    });

    it('should not change step if form is invalid', () => {
      component.form.patchValue({ name: '' });
      component.onSubmit();
      
      expect(component.step).toBe(component.steps.ORDER);
    });

    it('should change to INGREDIENTS step if form is valid', () => {
      component.form.patchValue({
        name: 'Valid Name',
        number: '12345',
        date: '2025-01-15',
        readyDate: '2025-01-20',
        address: 'Valid Address',
      });
      
      component.onSubmit();
      
      expect(component.step).toBe(component.steps.INGREDIENTS);
    });
  });

  describe('onBackFromIngredients', () => {
    it('should change step back to ORDER', () => {
      component.step = component.steps.INGREDIENTS;
      
      component.onBackFromIngredients();
      
      expect(component.step).toBe(component.steps.ORDER);
    });
  });

  describe('onSubmitIngredients', () => {
    it('should set isShowExplosion to true', () => {
      component.form.patchValue({
        name: 'Valid Name',
        number: '12345',
        date: '2025-01-15',
        readyDate: '2025-01-20',
        address: 'Valid Address',
      });
      
      const mockIngredients = [
        { id: '1', name: 'Ingredient 1', price: 10, percent: 50, rarity: 'common', effect: 'none' },
        { id: '2', name: 'Ingredient 2', price: 20, percent: 50, rarity: 'rare', effect: 'healing' },
      ];
      
      component.onSubmitIngredients({ ingredients: mockIngredients, totalPrice: 15 });
      
      expect(component.isShowExplosion).toBe(true);
    });
  });

  describe('Select Options', () => {
    it('should have delivery options', () => {
      expect(component.deliveryOptions.length).toBe(3);
    });

    it('should have payment options', () => {
      expect(component.paymentOptions.length).toBe(4);
    });
  });
});
