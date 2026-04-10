import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseLabelMaster } from './expense-label-master';

describe('ExpenseLabelMaster', () => {
  let component: ExpenseLabelMaster;
  let fixture: ComponentFixture<ExpenseLabelMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseLabelMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseLabelMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
