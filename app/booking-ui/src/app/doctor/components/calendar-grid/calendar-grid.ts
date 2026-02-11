import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../../models/calendar.models'; // Наша новая модель
import { AppointmentDto } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-grid.html',
  styleUrl: './calendar-grid.scss',
})
export class CalendarGridComponent {
  @Input({ required: true }) days: CalendarDay[] = [];
  @Input() loading = false;
  @Input() selectedId: string | undefined;

  @Output() selectAppointment = new EventEmitter<AppointmentDto>();

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
}
