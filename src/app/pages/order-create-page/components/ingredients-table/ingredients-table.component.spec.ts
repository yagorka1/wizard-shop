import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsTable } from './ingredients-table.component';

describe('IngredientsTable', () => {
  let component: IngredientsTable;
  let fixture: ComponentFixture<IngredientsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsTable]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IngredientsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
