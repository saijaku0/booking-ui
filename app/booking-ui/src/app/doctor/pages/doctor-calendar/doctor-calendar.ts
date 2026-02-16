import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AppointmentService, AuthService, DoctorService } from '@core/services';
import { CalendarDay } from '../../models/calendar.models';
import { AppointmentDetailsComponent } from '../../components/appointment-details/appointment-details';
import { CalendarHeaderComponent } from '../../components/calendar-header.component/calendar-header.component';
import { CalendarGridComponent } from '../../components/calendar-grid/calendar-grid';
import { AppointmentResponse } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarHeaderComponent,
    CalendarGridComponent,
    AppointmentDetailsComponent,
  ],
  templateUrl: './doctor-calendar.html',
  styleUrl: './doctor-calendar.scss',
})
export class DoctorCalendarComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  selectedAppointment = signal<AppointmentResponse | null>(null);
  viewDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  loading = false;

  ngOnInit(): void {
    this.generateCalendar();
    this.loadAppointments();
  }

  generateCalendar() {
    this.calendarDays = [];
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);

    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      this.calendarDays.push({
        date: date,
        isCurrentMonth: date.getMonth() === month,
        appointments: [],
      });
    }
  }

  loadAppointments() {
    this.loading = true;

    if (this.calendarDays.length === 0) this.generateCalendar();

    if (!this.calendarDays.length) return;

    const startIso = this.calendarDays[0].date.toISOString();
    const endIso = this.calendarDays[this.calendarDays.length - 1].date.toISOString();

    const doctorId = this.authService.currentUser()?.id;

    if (!doctorId) {
      this.loading = false;
      return;
    }

    this.appointmentService
      .getDoctorSchedule(startIso, endIso)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data: AppointmentResponse[]) => {
          this.mapAppointmentsToDays(data);
        },
        error: (err: string) => {
          console.error('ERROR:', err);
        },
      });
  }

  private mapAppointmentsToDays(appointments: AppointmentResponse[]) {
    if (!appointments || !Array.isArray(appointments)) return;

    this.calendarDays.forEach((day) => (day.appointments = []));

    appointments.forEach((appt) => {
      if (!appt.startTime) return;

      const apptDate = new Date(appt.startTime);

      const dayCell = this.calendarDays.find(
        (day) =>
          day.date.getDate() === apptDate.getDate() &&
          day.date.getMonth() === apptDate.getMonth() &&
          day.date.getFullYear() === apptDate.getFullYear(),
      );

      if (dayCell) {
        dayCell.appointments.push(appt);
      }
    });
  }

  changeMonth(step: number) {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + step);
    this.viewDate = newDate;

    this.generateCalendar();
    this.loadAppointments();
  }

  onAppointmentSelect(appt: AppointmentResponse) {
    if (this.selectedAppointment()?.id === appt.id) {
      this.selectedAppointment.set(null);
    } else {
      this.selectedAppointment.set(appt);

      setTimeout(() => {
        const detailsEl = document.getElementById('appointment-details');
        if (detailsEl) detailsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  closeDetails() {
    this.selectedAppointment.set(null);
  }
}
