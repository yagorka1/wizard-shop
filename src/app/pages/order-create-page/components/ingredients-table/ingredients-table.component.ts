import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InputComponent } from '../../../../components/input/input.component';
import { magicalIngredients } from '../../../../core/constants/ingredients.constants';
import { IngredientInterface } from '../../../../core/interfaces/ingredient.interface';
import { minIngredientsValidator } from '../../../../core/validators/min-ingredients/min-ingredients.validator';
import { totalPercentValidator } from '../../../../core/validators/total-percent/total-percent.validator';

interface MagicalIngredient {
  id: number;
  name: string;
  rarity: string;
  effect: string;
  price: number;
}

@Component({
  selector: 'app-ingredients-table',
  imports: [CardModule, TableModule, InputTextModule, CommonModule, FormsModule,
     ReactiveFormsModule, ButtonModule, InputComponent, CheckboxModule],
  templateUrl: './ingredients-table.component.html',
  styleUrl: './ingredients-table.component.css',
})
export class IngredientsTable implements OnInit {
  @Output() public onSubmit: EventEmitter<{ ingredients: IngredientInterface[], totalPrice: number }> = new EventEmitter<{ ingredients: IngredientInterface[], totalPrice: number }>();

  @Output() public onBack: EventEmitter<void> = new EventEmitter<void>();

  @Input() public isDisableButton: boolean = false;

  private fb: FormBuilder = inject(FormBuilder);

  public magicalIngredients: MagicalIngredient[] = magicalIngredients;

  public form: FormGroup = this.fb.group({
    ingredients: this.fb.array([], [minIngredientsValidator(3), totalPercentValidator()])
  });

  public ngOnInit(): void {
    this.initializeIngredientForms();
  }

  private initializeIngredientForms(): void {
    this.magicalIngredients.forEach(ingredient => {
      const ingredientGroup = this.fb.group({
        id: [ingredient.id.toString()],
        name: [ingredient.name],
        price: [ingredient.price],
        rarity: [ingredient.rarity],
        effect: [ingredient.effect],
        selected: [false],
        percent: [
          null,
          [
            Validators.min(0.01),
            Validators.max(100),
            Validators.pattern(/^(?!0\d)\d{1,3}(\.\d+)?$/),
          ],
        ],
      });

      this.ingredientsArray.push(ingredientGroup);
    });
  }

  public get ingredientsArray(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  public get ingredientsControls(): FormGroup[] {
    return this.ingredientsArray.controls as FormGroup[];
  }

  public get selectedIngredients(): FormGroup[] {
    return this.ingredientsControls.filter(group => group.get('selected')?.value === true);
  }

  public onSelectionChange(index: number): void {
    const group = this.ingredientsControls[index];
    const isSelected = group.get('selected')?.value;

    if (!isSelected) {
      group.get('percent')?.setValue(null);
      group.get('percent')?.clearValidators();
    } else {
      group.get('percent')?.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(100),
        Validators.pattern(/^(?!0\d)\d{1,3}(\.\d+)?$/),
      ]);
    }
    group.get('percent')?.updateValueAndValidity();
  }

  public get totalPercent(): number {
    return this.selectedIngredients.reduce((sum, group) => {
      const val = group.get('percent')?.value;
      return sum + (Number(val) || 0);
    }, 0);
  }

  public get totalPrice(): number {
    return this.selectedIngredients.reduce((sum, group) => {
      const price = Number(group.get('price')?.value) || 0;
      const percent = Number(group.get('percent')?.value) || 0;
      return sum + (price * percent / 100);
    }, 0);
  }

  public get tableErrors(): string[] {
    const errors: string[] = [];
    const selectedCount = this.selectedIngredients.length;

    if (selectedCount < 3) {
      errors.push(`Должно быть минимум 3 ингредиента (выбрано ${selectedCount})`);
    }

    if (selectedCount > 0 && this.totalPercent !== 100) {
      errors.push(`Общий процент должен быть 100% (сейчас ${this.totalPercent}%)`);
    }

    return errors;
  }

  public get hasInvalidPercentages(): boolean {
    return this.selectedIngredients.some(group => {
      const percentControl = group.get('percent');
      return !percentControl?.value || percentControl?.invalid;
    });
  }

  public get canSaveOrder(): boolean {
    return this.tableErrors.length === 0 && 
           this.selectedIngredients.length >= 3 && 
           !this.hasInvalidPercentages;
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.canSaveOrder) {
      const ingredients: IngredientInterface[] = this.selectedIngredients.map(group => {
        const value = group.getRawValue();
        return {
          id: value.id,
          name: value.name,
          price: Number(value.price),
          percent: Number(value.percent),
        };
      });

      this.onSubmit.emit({ ingredients, totalPrice: this.totalPrice });
    }
  }

  public goBack(): void {
    this.onBack.emit();
  }
}
