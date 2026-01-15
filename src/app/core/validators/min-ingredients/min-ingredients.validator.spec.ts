import { FormBuilder, FormControl } from '@angular/forms';
import { minIngredientsValidator } from './min-ingredients.validator';

describe('minIngredientsValidator', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should return null for non-FormArray controls', () => {
    const control = new FormControl('test');
    const validator = minIngredientsValidator(3);
    
    expect(validator(control)).toBeNull();
  });

  it('should return null if FormArray has exactly minimum items', () => {
    const formArray = fb.array([
      fb.group({ name: 'Item 1' }),
      fb.group({ name: 'Item 2' }),
      fb.group({ name: 'Item 3' }),
    ]);
    const validator = minIngredientsValidator(3);

    expect(validator(formArray)).toBeNull();
  });

  it('should return null if FormArray has more than minimum items', () => {
    const formArray = fb.array([
      fb.group({ name: 'Item 1' }),
      fb.group({ name: 'Item 2' }),
      fb.group({ name: 'Item 3' }),
      fb.group({ name: 'Item 4' }),
    ]);
    const validator = minIngredientsValidator(3);

    expect(validator(formArray)).toBeNull();
  });

  it('should return error if FormArray has less than minimum items', () => {
    const formArray = fb.array([
      fb.group({ name: 'Item 1' }),
      fb.group({ name: 'Item 2' }),
    ]);
    const validator = minIngredientsValidator(3);

    expect(validator(formArray)).toEqual({
      minIngredients: { required: 3, actual: 2 },
    });
  });

  it('should return error for empty FormArray', () => {
    const formArray = fb.array([]);
    const validator = minIngredientsValidator(3);

    expect(validator(formArray)).toEqual({
      minIngredients: { required: 3, actual: 0 },
    });
  });

  it('should work with different minimum values', () => {
    const formArray = fb.array([
      fb.group({ name: 'Item 1' }),
    ]);
    
    expect(minIngredientsValidator(1)(formArray)).toBeNull();
    expect(minIngredientsValidator(2)(formArray)).toEqual({
      minIngredients: { required: 2, actual: 1 },
    });
  });
});
