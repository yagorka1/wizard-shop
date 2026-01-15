import { FormBuilder, FormGroup } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';

describe('dateRangeValidator', () => {
  let fb: FormBuilder;
  let form: FormGroup;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should return null if start date field does not exist', () => {
    form = fb.group({
      endDate: ['2025-01-15'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return null if end date field does not exist', () => {
    form = fb.group({
      startDate: ['2025-01-10'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return null if both dates are empty', () => {
    form = fb.group({
      startDate: [''],
      endDate: [''],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return null if only start date is empty', () => {
    form = fb.group({
      startDate: [''],
      endDate: ['2025-01-15'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return null if only end date is empty', () => {
    form = fb.group({
      startDate: ['2025-01-10'],
      endDate: [''],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return error if end date is before start date', () => {
    form = fb.group({
      startDate: ['2025-01-15'],
      endDate: ['2025-01-10'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toEqual({
      dateRange: { startDate: 'startDate', endDate: 'endDate' },
    });
    expect(form.get('endDate')?.hasError('dateRange')).toBe(true);
  });

  it('should return null if end date equals start date', () => {
    form = fb.group({
      startDate: ['2025-01-15'],
      endDate: ['2025-01-15'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return null if end date is after start date', () => {
    form = fb.group({
      startDate: ['2025-01-10'],
      endDate: ['2025-01-15'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should clear dateRange error when dates become valid', () => {
    form = fb.group({
      startDate: ['2025-01-15'],
      endDate: ['2025-01-10'],
    });
    form.setValidators(dateRangeValidator('startDate', 'endDate'));
    form.updateValueAndValidity();

    expect(form.get('endDate')?.hasError('dateRange')).toBe(true);

    form.get('endDate')?.setValue('2025-01-20');
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
    expect(form.get('endDate')?.hasError('dateRange')).toBe(false);
  });
});
