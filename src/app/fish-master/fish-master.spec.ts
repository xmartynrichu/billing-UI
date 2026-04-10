import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FishMaster } from './fish-master';

describe('FishMaster', () => {
  let component: FishMaster;
  let fixture: ComponentFixture<FishMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FishMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FishMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
