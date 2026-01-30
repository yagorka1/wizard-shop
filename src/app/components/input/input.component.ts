import { CommonModule } from '@angular/common';
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
import { TranslatePipe } from '@ngx-translate/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ERROR_MESSAGES } from '../../core/constants/error-messages.constants';

@Component({
  selector: 'app-input',
  imports: [FormsModule, InputTextModule, FloatLabel, MessageModule, CommonModule, TranslatePipe],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';

  @Input() formControlName = '';

  @Input() placeholder: string = '';

  public id = crypto.randomUUID();

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

  public get errorMessages(): { key: string, params?: any }[] {
    if (this.isFormControlError && this.formControl?.touched && this.formControl?.invalid) {
      const errors: { key: string, params?: any }[] = [];

      const controlErrors = this.formControl.errors || {};

      for (const errorKey of Object.keys(controlErrors)) {
        const errorFunc = ERROR_MESSAGES[errorKey];
        if (errorFunc) {
          errors.push(errorFunc(controlErrors[errorKey]));
        }
      }

      return errors;
    }

    return [];
  }
}
