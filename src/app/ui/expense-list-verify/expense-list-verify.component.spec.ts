import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListVerifyComponent } from './expense-list-verify.component';

describe('ExpenseListVerifyComponent', () => {
  let component: ExpenseListVerifyComponent;
  let fixture: ComponentFixture<ExpenseListVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseListVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
