import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startDateField: string, endDateField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDateControl = control.get(startDateField);
    const endDateControl = control.get(endDateField);

    if (!startDateControl || !endDateControl) {
      return null;
    }

    const startDate = startDateControl.value;
    const endDate = endDateControl.value;

    if (!startDate || !endDate) {
      if (endDateControl.hasError('dateRange')) {
        const errors = { ...endDateControl.errors };
        delete errors['dateRange'];
        endDateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      endDateControl.setErrors({ ...endDateControl.errors, dateRange: true });
      return { dateRange: { startDate: startDateField, endDate: endDateField } };
    } else {
      if (endDateControl.hasError('dateRange')) {
        const errors = { ...endDateControl.errors };
        delete errors['dateRange'];
        endDateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null;
  };
}
