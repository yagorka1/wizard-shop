import { Component, Input, forwardRef, inject } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ERROR_MESSAGES } from '../../core/constants/error-messages.constants';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-input-select',
  imports: [CommonModule, FormsModule, SelectModule, FloatLabel, MessageModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true,
    },
  ],
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';

  @Input() formControlName = '';

  @Input() placeholder: string = '';

  @Input() options: SelectOption[] = [];

  public id = crypto.randomUUID();

  public value: string | null = null;

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

  onSelectionChange(value: any): void {
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
