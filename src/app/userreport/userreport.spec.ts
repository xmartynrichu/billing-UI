import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userreport } from './userreport';

describe('Userreport', () => {
  let component: Userreport;
  let fixture: ComponentFixture<Userreport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userreport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userreport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
