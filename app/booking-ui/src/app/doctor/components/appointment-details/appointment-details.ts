import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentResponse } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss',
})
export class AppointmentDetailsComponent {
  @Input({ required: true }) appointment!: AppointmentResponse;
  @Output() closeDetails = new EventEmitter<void>();
  @Output() isDetailsOpen = new EventEmitter<string>();

  onViewHistory() {
    if (this.appointment.patientId) {
      this.isDetailsOpen.emit(this.appointment.patientId);
    }
  }
}
