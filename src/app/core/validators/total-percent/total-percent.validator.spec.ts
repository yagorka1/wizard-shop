import { FormBuilder, FormControl } from '@angular/forms';
import { totalPercentValidator } from './total-percent.validator';

describe('totalPercentValidator', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should return null for non-FormArray controls', () => {
    const control = new FormControl('test');
    const validator = totalPercentValidator();

    expect(validator(control)).toBeNull();
  });

  it('should return null if total percent equals 100', () => {
    const formArray = fb.array([
      fb.group({ percent: 30 }),
      fb.group({ percent: 40 }),
      fb.group({ percent: 30 }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toBeNull();
  });

  it('should return null if total percent equals 100 with decimals', () => {
    const formArray = fb.array([
      fb.group({ percent: 33.33 }),
      fb.group({ percent: 33.33 }),
      fb.group({ percent: 33.34 }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toBeNull();
  });

  it('should return error if total percent is less than 100', () => {
    const formArray = fb.array([
      fb.group({ percent: 30 }),
      fb.group({ percent: 30 }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toEqual({
      totalPercent: { required: 100, actual: 60 },
    });
  });

  it('should return error if total percent is more than 100', () => {
    const formArray = fb.array([
      fb.group({ percent: 50 }),
      fb.group({ percent: 60 }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toEqual({
      totalPercent: { required: 100, actual: 110 },
    });
  });

  it('should handle null percent values as 0', () => {
    const formArray = fb.array([
      fb.group({ percent: null }),
      fb.group({ percent: 100 }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toBeNull();
  });

  it('should handle undefined percent values as 0', () => {
    const formArray = fb.array([
      fb.group({ name: 'no percent field' }),
      fb.group({ percent: 100 }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toBeNull();
  });

  it('should handle empty FormArray', () => {
    const formArray = fb.array([]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toEqual({
      totalPercent: { required: 100, actual: 0 },
    });
  });

  it('should handle string percent values', () => {
    const formArray = fb.array([
      fb.group({ percent: '50' }),
      fb.group({ percent: '50' }),
    ]);
    const validator = totalPercentValidator();

    expect(validator(formArray)).toBeNull();
  });
});
