import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from './input-date.component';

@Component({
  template: `
    <form [formGroup]="form">
      <app-input-date formControlName="testDate" label="Test Date"></app-input-date>
    </form>
  `,
  imports: [ReactiveFormsModule, InputDateComponent],
})
class TestHostComponent {
  form = new FormGroup({
    testDate: new FormControl(''),
  });
}

describe('InputDateComponent', () => {
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

  it('should render input-date component within form', () => {
    const inputElement = fixture.nativeElement.querySelector('app-input-date');
    expect(inputElement).toBeTruthy();
  });

  it('should update form value when date changes', () => {
    hostComponent.form.get('testDate')?.setValue('2025-01-15');
    fixture.detectChanges();
    
    expect(hostComponent.form.get('testDate')?.value).toBe('2025-01-15');
  });
});
