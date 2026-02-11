import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDto } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss',
})
export class AppointmentDetailsComponent {
  @Input({ required: true }) appointment!: AppointmentDto;
  @Output() closeDetails = new EventEmitter<void>();
}
