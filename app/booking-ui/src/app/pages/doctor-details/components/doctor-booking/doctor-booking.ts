import { Component, effect, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAppointmentRequest } from '@core/models/appointmnet.models';
import { DoctorResponse, TimeSlot } from '@core/models/doctor.model';
import { AppointmentService, AuthService, DoctorService } from '@core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-booking.html',
  styleUrl: './doctor-booking.scss',
})
export class DoctorBooking {
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  public authService = inject(AuthService);
  private router = inject(Router);

  @Input({ required: true }) doctor!: DoctorResponse;

  selectedDate = signal(new Date().toISOString().split('T')[0]);
  minDate = new Date().toISOString().split('T')[0];

  availableSlots = signal<TimeSlot[]>([]);
  selectedSlot = signal<TimeSlot | null>(null);

  isLoadingSlots = signal(false);
  isBooking = signal(false);

  constructor() {
    effect(() => {
      this.loadSlots(this.selectedDate());
    });
  }

  onDateChange(newDate: string) {
    this.selectedDate.set(newDate);
    this.selectedSlot.set(null);
  }

  loadSlots(date: string) {
    this.isLoadingSlots.set(true);
    const utcDate = `${date}T00:00:00Z`;
    this.doctorService.getAvailableSlots(this.doctor.id, utcDate).subscribe({
      next: (slots) => {
        this.availableSlots.set(slots);
        this.isLoadingSlots.set(false);
      },
      error: () => {
        this.availableSlots.set([]);
        this.isLoadingSlots.set(false);
      },
    });
  }

  bookAppointment() {
    const slot = this.selectedSlot();
    if (!slot) return;

    if (!this.authService.currentUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isBooking.set(true);

    const formatToUtc = (dateStr: string): string => {
      if (!dateStr) return '';
      if (dateStr.includes('Z') || dateStr.includes('+')) {
        return new Date(dateStr).toISOString();
      }
      return new Date(dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`).toISOString();
    };

    const request: CreateAppointmentRequest = {
      doctorId: this.doctor.id,
      startTime: formatToUtc(slot.start),
      endTime: formatToUtc(slot.end),
    };

    console.log('Sending to Backend:', request);

    this.appointmentService.createAppointment(request).subscribe({
      next: () => {
        alert('Appointment booked successfully!');
        this.isBooking.set(false);
        this.selectedSlot.set(null);
        this.loadSlots(this.selectedDate());
      },
      error: () => {
        this.isBooking.set(false);
        alert('Booking failed. Check Network tab for details.');
      },
    });
  }
}
