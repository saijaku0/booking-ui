import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCard } from './doctor-card';
import { provideRouter } from '@angular/router';

describe('DoctorCard', () => {
  let component: DoctorCard;
  let fixture: ComponentFixture<DoctorCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorCard);
    component = fixture.componentInstance;
    component.doctor = {
      id: 'test-id',
      name: 'Dr. Test',
      specialty: 'Testing',
      rating: 5.0,
      image: 'https://via.placeholder.com/150',
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
