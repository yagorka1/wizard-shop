import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IngredientsTable } from './ingredients-table.component';
import { IngredientInterface } from '../../../../core/interfaces/ingredient.interface';

describe('IngredientsTable', () => {
  let component: IngredientsTable;
  let fixture: ComponentFixture<IngredientsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsTable],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with ingredients FormArray', () => {
      expect(component.form).toBeDefined();
      expect(component.ingredientsArray).toBeDefined();
    });

    it('should populate FormArray with magical ingredients', () => {
      expect(component.ingredientsArray.length).toBeGreaterThan(0);
    });

    it('should have all ingredients unselected initially', () => {
      component.ingredientsControls.forEach(group => {
        expect(group.get('selected')?.value).toBe(false);
      });
    });

    it('should have percent as null initially', () => {
      component.ingredientsControls.forEach(group => {
        expect(group.get('percent')?.value).toBeNull();
      });
    });
  });

  describe('Selection Change', () => {
    it('should clear percent and validators when deselecting ingredient', () => {
      const group = component.ingredientsControls[0];
      group.get('selected')?.setValue(true);
      group.get('percent')?.setValue(50);

      group.get('selected')?.setValue(false);
      component.onSelectionChange(0);

      expect(group.get('percent')?.value).toBeNull();
    });

    it('should add required validator when selecting ingredient', () => {
      const group = component.ingredientsControls[0];
      group.get('selected')?.setValue(true);
      component.onSelectionChange(0);

      group.get('percent')?.setValue(null);
      group.get('percent')?.updateValueAndValidity();

      expect(group.get('percent')?.hasError('required')).toBe(true);
    });
  });

  describe('selectedIngredients', () => {
    it('should return empty array when no ingredients selected', () => {
      expect(component.selectedIngredients.length).toBe(0);
    });

    it('should return only selected ingredients', () => {
      component.ingredientsControls[0].get('selected')?.setValue(true);
      component.ingredientsControls[1].get('selected')?.setValue(true);

      expect(component.selectedIngredients.length).toBe(2);
    });
  });

  describe('totalPercent', () => {
    it('should return 0 when no ingredients selected', () => {
      expect(component.totalPercent).toBe(0);
    });

    it('should calculate total percent correctly', () => {
      component.ingredientsControls[0].get('selected')?.setValue(true);
      component.ingredientsControls[0].get('percent')?.setValue(30);

      component.ingredientsControls[1].get('selected')?.setValue(true);
      component.ingredientsControls[1].get('percent')?.setValue(70);

      expect(component.totalPercent).toBe(100);
    });

    it('should handle null percent values', () => {
      component.ingredientsControls[0].get('selected')?.setValue(true);
      component.ingredientsControls[0].get('percent')?.setValue(null);

      expect(component.totalPercent).toBe(0);
    });
  });

  describe('totalPrice', () => {
    it('should return 0 when no ingredients selected', () => {
      expect(component.totalPrice).toBe(0);
    });

    it('should calculate total price based on percent', () => {
      const group = component.ingredientsControls[0];
      const price = group.get('price')?.value;

      group.get('selected')?.setValue(true);
      group.get('percent')?.setValue(50);

      expect(component.totalPrice).toBe(price * 50 / 100);
    });
  });

  describe('tableErrors', () => {
    it('should show error when less than 3 ingredients selected', () => {
      component.ingredientsControls[0].get('selected')?.setValue(true);
      component.ingredientsControls[0].get('percent')?.setValue(100);

      expect(component.tableErrors.some(e => e.includes('минимум 3'))).toBe(true);
    });

    it('should show error when total percent is not 100', () => {
      for (let i = 0; i < 3; i++) {
        component.ingredientsControls[i].get('selected')?.setValue(true);
        component.ingredientsControls[i].get('percent')?.setValue(20);
      }

      expect(component.tableErrors.some(e => e.includes('100%'))).toBe(true);
    });

    it('should be empty when valid', () => {
      for (let i = 0; i < 3; i++) {
        component.ingredientsControls[i].get('selected')?.setValue(true);
        component.onSelectionChange(i);
      }
      component.ingredientsControls[0].get('percent')?.setValue(33.33);
      component.ingredientsControls[1].get('percent')?.setValue(33.33);
      component.ingredientsControls[2].get('percent')?.setValue(33.34);

      expect(component.tableErrors.length).toBe(0);
    });
  });

  describe('canSaveOrder', () => {
    it('should be false when less than 3 ingredients', () => {
      expect(component.canSaveOrder).toBe(false);
    });

    it('should be false when total percent is not 100', () => {
      for (let i = 0; i < 3; i++) {
        component.ingredientsControls[i].get('selected')?.setValue(true);
        component.onSelectionChange(i);
        component.ingredientsControls[i].get('percent')?.setValue(20);
      }

      expect(component.canSaveOrder).toBe(false);
    });

    it('should be true when all conditions are met', () => {
      for (let i = 0; i < 3; i++) {
        component.ingredientsControls[i].get('selected')?.setValue(true);
        component.onSelectionChange(i);
      }
      component.ingredientsControls[0].get('percent')?.setValue(33.33);
      component.ingredientsControls[1].get('percent')?.setValue(33.33);
      component.ingredientsControls[2].get('percent')?.setValue(33.34);

      expect(component.canSaveOrder).toBe(true);
    });
  });

  describe('save', () => {
    it('should emit onSubmit when canSaveOrder is true', () => {
      const emitSpy = vi.spyOn(component.onSubmit, 'emit');

      for (let i = 0; i < 3; i++) {
        component.ingredientsControls[i].get('selected')?.setValue(true);
        component.onSelectionChange(i);
      }
      component.ingredientsControls[0].get('percent')?.setValue(33.33);
      component.ingredientsControls[1].get('percent')?.setValue(33.33);
      component.ingredientsControls[2].get('percent')?.setValue(33.34);

      component.save();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should not emit onSubmit when canSaveOrder is false', () => {
      const emitSpy = vi.spyOn(component.onSubmit, 'emit');

      component.save();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit correct ingredient data', () => {
      const emitSpy = vi.spyOn(component.onSubmit, 'emit');

      for (let i = 0; i < 3; i++) {
        component.ingredientsControls[i].get('selected')?.setValue(true);
        component.onSelectionChange(i);
      }
      component.ingredientsControls[0].get('percent')?.setValue(33.33);
      component.ingredientsControls[1].get('percent')?.setValue(33.33);
      component.ingredientsControls[2].get('percent')?.setValue(33.34);

      component.save();

      const emittedData = emitSpy.mock.calls[0][0];
      expect(emittedData).toHaveProperty('ingredients');
      expect(emittedData).toHaveProperty('totalPrice');
      expect(emittedData?.ingredients).toHaveLength(3);
      emittedData?.ingredients?.forEach((item: IngredientInterface) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('percent');
      });
    });
  });

  describe('goBack', () => {
    it('should emit onBack event', () => {
      const emitSpy = vi.spyOn(component.onBack, 'emit');

      component.goBack();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('hasInvalidPercentages', () => {
    it('should return false when no ingredients selected', () => {
      expect(component.hasInvalidPercentages).toBe(false);
    });

    it('should return true when selected ingredient has empty percent', () => {
      component.ingredientsControls[0].get('selected')?.setValue(true);
      component.onSelectionChange(0);

      expect(component.hasInvalidPercentages).toBe(true);
    });

    it('should return false when all selected ingredients have valid percent', () => {
      component.ingredientsControls[0].get('selected')?.setValue(true);
      component.onSelectionChange(0);
      component.ingredientsControls[0].get('percent')?.setValue(50);

      expect(component.hasInvalidPercentages).toBe(false);
    });
  });
});
