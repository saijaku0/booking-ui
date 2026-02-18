import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleModal } from './reschedule-modal';

describe('RescheduleModal', () => {
  let component: RescheduleModal;
  let fixture: ComponentFixture<RescheduleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RescheduleModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
