import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCompletionModal } from './appointment-completion-modal';

describe('AppointmentCompletionModal', () => {
  let component: AppointmentCompletionModal;
  let fixture: ComponentFixture<AppointmentCompletionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCompletionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCompletionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
