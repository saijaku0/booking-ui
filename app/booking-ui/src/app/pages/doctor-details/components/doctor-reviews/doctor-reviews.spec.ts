import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorReviews } from './doctor-reviews';

describe('DoctorReviews', () => {
  let component: DoctorReviews;
  let fixture: ComponentFixture<DoctorReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorReviews],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
