import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorInfo } from './doctor-info';

describe('DoctorInfo', () => {
  let component: DoctorInfo;
  let fixture: ComponentFixture<DoctorInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
