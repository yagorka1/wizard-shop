import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputDateComponent } from '../../components/input-date/input-date.component';
import { InputSelectComponent, SelectOption } from '../../components/input-select/input-select.component';
import { InputComponent } from '../../components/input/input.component';
import { IngredientInterface } from '../../core/interfaces/ingredient.interface';
import { dateRangeValidator } from '../../core/validators/date-range/date-range.validator';
import { OrderService } from '../../services/order.service';
import { IngredientsTable } from './components/ingredients-table/ingredients-table.component';

enum Steps {
  ORDER,
  INGREDIENTS,
}

@Component({
  imports: [CardModule, InputComponent, InputDateComponent, InputSelectComponent,
    ReactiveFormsModule, ButtonModule, IngredientsTable, RouterLink],
  templateUrl: './order-create-page.component.html',
  styleUrl: './order-create-page.component.css',
})
export class OrderCreatePage implements OnInit {
  public form!: FormGroup;

  public isShowExplosion: boolean = false;

  public step: Steps = Steps.ORDER;

  public steps: typeof Steps = Steps;

  public fb: FormBuilder = inject(FormBuilder);
  public router: Router = inject(Router);

  private orderService: OrderService = inject(OrderService);

  public deliveryOptions: SelectOption[] = [
    { label: 'Курьером', value: 'courier' },
    { label: 'Самовывоз', value: 'pickup' },
    { label: 'Почта', value: 'post' },
  ];

  public paymentOptions: SelectOption[] = [
    { label: 'Наличными', value: 'cash' },
    { label: 'Картой', value: 'card' },
    { label: 'Онлайн', value: 'online' },
    { label: 'Криптовалютой', value: 'crypto' },
  ];

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      number: ['', [Validators.required]],
      date: ['', [Validators.required]],
      readyDate: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      delivery: ['courier', [Validators.required]],
      payment: ['card', [Validators.required]],
    }, {
      validators: [dateRangeValidator('date', 'readyDate')]
    });
  }

  public onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.step = Steps.INGREDIENTS;
    }
  }

  public onSubmitIngredients(data: { ingredients: IngredientInterface[], totalPrice: number }): void {
    this.isShowExplosion = true;

    setTimeout(() => {
      this.isShowExplosion = false;

      this.orderService.addOrder({
        ...this.form.value,
        id: crypto.randomUUID(),
        ingredients: data.ingredients,
        totalPrice: data.totalPrice,
      });

      this.router.navigate(['/orders']);
    }, 2500);

  }

  public onBackFromIngredients(): void {
    this.step = Steps.ORDER;
  }
}
