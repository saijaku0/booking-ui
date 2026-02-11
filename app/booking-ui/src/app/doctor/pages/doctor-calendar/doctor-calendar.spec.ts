import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCalendar } from './doctor-calendar';

describe('DoctorCalendar', () => {
  let component: DoctorCalendar;
  let fixture: ComponentFixture<DoctorCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
