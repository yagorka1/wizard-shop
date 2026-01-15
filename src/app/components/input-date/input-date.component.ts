import { Component, forwardRef, inject, Input } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ERROR_MESSAGES } from '../../core/constants/error-messages.constants';

@Component({
  selector: 'app-input-date',
  imports: [FormsModule, DatePickerModule, FloatLabel, MessageModule],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
})
export class InputDateComponent {
  @Input() label: string = '';

  @Input() formControlName = '';

  @Input() id = crypto.randomUUID();

  public value = '';

  private controlContainer = inject(ControlContainer);

  public onTouched = () => {
    /* empty */
  };

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange = (value: any) => {
    /* empty */
  };

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.value = value;
    this.onChange(value);
  }

  public get formControl(): FormControl | null {
    return this.controlContainer.formDirective
      ? (((this.controlContainer.formDirective as FormGroupDirective).form as FormGroup)?.get(
        this.formControlName,
      ) as FormControl)
      : null;
  }

  public get isFormControlError(): boolean {
    if (this.formControl) {
      return !!this.formControl.errors;
    }

    return false;
  }

  public get isShowError(): boolean {
    return this.isFormControlError && !!this.formControl?.touched && this.formControl?.invalid;
  }

  public get errorMessage(): string {
    if (this.isFormControlError && this.formControl?.touched && this.formControl?.invalid) {
      let errors = '';

      const controlErrors = this.formControl.errors || {};

      for (const errorKey of Object.keys(controlErrors)) {
        errors += ERROR_MESSAGES[errorKey]?.(controlErrors[errorKey]) + '\n';
      }

      return errors;
    }

    return '';
  }
}
