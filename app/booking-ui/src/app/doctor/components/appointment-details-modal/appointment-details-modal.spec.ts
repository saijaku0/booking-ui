import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsModal } from './appointment-details-modal';

describe('AppointmentDetailsModal', () => {
  let component: AppointmentDetailsModal;
  let fixture: ComponentFixture<AppointmentDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
