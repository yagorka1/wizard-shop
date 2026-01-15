import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function minIngredientsValidator(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { minIngredients: { required: min, actual: control.length } };
    }
    return null;
  };
}
