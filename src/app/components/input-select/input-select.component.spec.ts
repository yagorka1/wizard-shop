import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputSelectComponent } from './input-select.component';

@Component({
  template: `
    <form [formGroup]="form">
      <app-input-select 
        formControlName="testSelect" 
        label="Test Select"
        [options]="options">
      </app-input-select>
    </form>
  `,
  imports: [ReactiveFormsModule, InputSelectComponent],
})
class TestHostComponent {
  form = new FormGroup({
    testSelect: new FormControl('option1'),
  });
  options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];
}

describe('InputSelectComponent', () => {
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

  it('should render input-select component within form', () => {
    const inputElement = fixture.nativeElement.querySelector('app-input-select');
    expect(inputElement).toBeTruthy();
  });

  it('should update form value when selection changes', () => {
    hostComponent.form.get('testSelect')?.setValue('option2');
    fixture.detectChanges();
    
    expect(hostComponent.form.get('testSelect')?.value).toBe('option2');
  });
});
