import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function totalPercentValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      const total = control.controls.reduce((sum, group) => {
        const val = group.get('percent')?.value;
        return sum + (Number(val) || 0);
      }, 0);
      return Math.abs(total - 100) < 0.01 ? null : { totalPercent: { required: 100, actual: total } };
    }
    return null;
  };
}
