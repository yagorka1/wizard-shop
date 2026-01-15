import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  template: `
    <form [formGroup]="form">
      <app-input formControlName="testField" label="Test Label"></app-input>
    </form>
  `,
  imports: [ReactiveFormsModule, InputComponent],
})
class TestHostComponent {
  form = new FormGroup({
    testField: new FormControl(''),
  });
}

describe('InputComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render input component within form', () => {
    const inputElement = fixture.nativeElement.querySelector('app-input');
    expect(inputElement).toBeTruthy();
  });

  it('should update form value when input changes', () => {
    hostComponent.form.get('testField')?.setValue('test value');
    fixture.detectChanges();
    
    expect(hostComponent.form.get('testField')?.value).toBe('test value');
  });
});
