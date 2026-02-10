import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDetails } from './doctor-details';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('DoctorDetails', () => {
  let component: DoctorDetails;
  let fixture: ComponentFixture<DoctorDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDetails],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
