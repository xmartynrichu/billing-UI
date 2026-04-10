import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMaster } from './employee-master';

describe('EmployeeMaster', () => {
  let component: EmployeeMaster;
  let fixture: ComponentFixture<EmployeeMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
