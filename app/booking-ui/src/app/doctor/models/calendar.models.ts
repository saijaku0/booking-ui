import { AppointmentDto } from '@core/models/appointmnet.models';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: AppointmentDto[];
}
