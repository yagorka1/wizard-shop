import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InputComponent } from '../../../../components/input/input.component';
import { IngredientFormValue, IngredientInterface } from '../../../../core/interfaces/ingredient.interface';
import { minIngredientsValidator } from '../../../../core/validators/min-ingredients.validator';
import { totalPercentValidator } from '../../../../core/validators/total-percent.validator';

@Component({
  selector: 'app-ingredients-table',
  imports: [CardModule, TableModule, InputTextModule, CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputComponent],
  templateUrl: './ingredients-table.component.html',
  styleUrl: './ingredients-table.component.css',
})
export class IngredientsTable implements OnInit {
  @Output() public onSubmit: EventEmitter<IngredientInterface[]> = new EventEmitter<IngredientInterface[]>();

  @Output() public onBack: EventEmitter<void> = new EventEmitter<void>();

  @Input() public isDisableButton: boolean = false;

  private fb: FormBuilder = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    ingredients: this.fb.array([], [minIngredientsValidator(3), totalPercentValidator()])
  });

  private originalValues: Map<number, IngredientFormValue> = new Map();

  public ngOnInit(): void {
    this.addIngredient();
  }

  public get ingredientsArray(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  public get ingredientsControls() {
    return this.ingredientsArray.controls as FormGroup[];
  }

  public addIngredient() {
    const ingredientGroup = this.fb.group({
      id: [crypto.randomUUID()],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      price: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^(?!0\d)\d{1,6}(\.\d+)?$/),
        ],
      ],
      percent: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(100),
          Validators.pattern(/^(?!0\d)\d{1,3}(\.\d+)?$/),
        ],
      ],
      edit: [true],
    });

    this.ingredientsArray.push(ingredientGroup);
  }

  public isEditing(index: number): boolean {
    return !!this.ingredientsControls[index]?.get('edit')?.value;
  }

  public startEdit(index: number) {
    const group = this.ingredientsControls[index];
    this.originalValues.set(index, group.getRawValue());
    this.updateEditByIndex(index, true);
  }

  public saveEdit(index: number) {
    const group = this.ingredientsControls[index];
    if (group.valid) {
      this.updateEditByIndex(index, false);
      this.originalValues.delete(index);
    } else {
      group.markAllAsTouched();
    }
  }

  private updateEditByIndex(index: number, value: boolean): void {
    this.ingredientsControls[index]?.get('edit')?.setValue(value);
  }

  public cancelEdit(index: number) {
    const group = this.ingredientsControls[index];

    if (!this.originalValues.has(index)) {
      this.ingredientsArray.removeAt(index);
      return;
    }

    const original = this.originalValues.get(index);
    if (original) {
      group.setValue({ ...original, edit: false });
    }
    this.originalValues.delete(index);
    this.updateEditByIndex(index, false);
  }

  public deleteIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  public get totalPercent(): number {
    return this.ingredientsArray.controls.reduce((sum, group) => {
      const val = group.get('percent')?.value;
      return sum + (Number(val) || 0);
    }, 0);
  }

  public get tableErrors(): string[] {
    const errors: string[] = [];

    if (this.ingredientsArray.errors?.['minIngredients']) {
      errors.push(`Должно быть минимум ${this.ingredientsArray.errors['minIngredients'].required} ингредиента`);
    }

    if (this.ingredientsArray.errors?.['totalPercent']) {
      errors.push(`Общий процент должен быть 100% (сейчас ${this.totalPercent}%)`);
    }

    return errors;
  }

  public get hasEditingIngredients(): boolean {
    return this.ingredientsControls.some((group, index) => this.isEditing(index));
  }

  public get canSaveOrder(): boolean {
    return this.tableErrors.length === 0 && !this.hasEditingIngredients && this.ingredientsArray.length > 0;
  }

  public save() {
    this.form.markAllAsTouched();

    const hasEditingIngredients = this.ingredientsControls.some((group, index) =>
      this.isEditing(index)
    );

    if (hasEditingIngredients) {
      this.ingredientsControls.forEach(group => {
        group.markAllAsTouched();
      });
      return;
    }

    if (this.form.valid) {
      const ingredients: IngredientInterface[] = this.ingredientsControls.map(group => {
        const value = group.getRawValue();
        return {
          id: value.id,
          name: value.name,
          price: Number(value.price),
          percent: Number(value.percent),
        };
      });

      this.onSubmit.emit(ingredients);
    }
  }

  public goBack(): void {
    this.onBack.emit();
  }
}
