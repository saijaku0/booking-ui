import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsComponent } from './doctors';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { DoctorService, SpecialtyService } from '@core/services';

describe('DoctorsComponent', () => {
  let component: DoctorsComponent;
  let fixture: ComponentFixture<DoctorsComponent>;

  const mockDoctorService = {
    getDoctors: () => of([]),
    createDoctor: () => of({}),
    delete: () => of({}),
  };

  const mockSpecialtyService = {
    getAll: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsComponent],
      providers: [
        provideRouter([]),
        { provide: DoctorService, useValue: mockDoctorService },
        { provide: SpecialtyService, useValue: mockSpecialtyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
