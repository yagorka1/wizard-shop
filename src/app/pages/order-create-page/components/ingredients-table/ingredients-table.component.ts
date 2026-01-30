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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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

@Component({
  selector: 'app-ingredients-table',
  imports: [CardModule, TableModule, InputTextModule, CommonModule, FormsModule,
     ReactiveFormsModule, ButtonModule, InputComponent, CheckboxModule, TranslatePipe],
  templateUrl: './ingredients-table.component.html',
  styleUrl: './ingredients-table.component.css',
})
export class IngredientsTable implements OnInit {
  @Output() public onSubmit: EventEmitter<{ ingredients: IngredientInterface[], totalPrice: number }> =
    new EventEmitter<{ ingredients: IngredientInterface[], totalPrice: number }>();

  @Output() public onBack: EventEmitter<void> = new EventEmitter<void>();

  @Input() public isDisableButton: boolean = false;

  private fb: FormBuilder = inject(FormBuilder);
  private translateService = inject(TranslateService);

  public magicalIngredients: IngredientInterface[] = magicalIngredients;

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

  public getRarityClass(rarity: string): Record<string, boolean> {
    const key = rarity || 'common';
    return {
      'bg-gray-200 text-gray-700': key === 'common',
      'bg-green-200 text-green-700': key === 'uncommon',
      'bg-blue-200 text-blue-700': key === 'rare',
      'bg-purple-200 text-purple-700': key === 'veryRare',
      'bg-orange-200 text-orange-700': key === 'legendary'
    };
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
      errors.push(this.translateService.instant('ingredientsTable.errors.minIngredients', { count: selectedCount }));
    }

    if (selectedCount > 0 && this.totalPercent !== 100) {
      errors.push(this.translateService.instant('ingredientsTable.errors.totalPercent', { percent: this.totalPercent }));
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
          name: this.translateService.instant('ingredients.' + value.id + '.name'),
          price: Number(value.price),
          percent: Number(value.percent),
          rarity: this.translateService.instant('rarity.' + value.rarity),
          effect: this.translateService.instant('ingredients.' + value.id + '.effect'),
        };
      });

      this.onSubmit.emit({ ingredients, totalPrice: this.totalPrice });
    }
  }

  public goBack(): void {
    this.onBack.emit();
  }
}
