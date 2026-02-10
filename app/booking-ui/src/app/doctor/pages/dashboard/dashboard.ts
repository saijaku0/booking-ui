import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../core/services/appointment';
import { AppointmentDto, AppointmentStatus } from '../../../core/services/appointmnet.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private appointmentService = inject(Appointment);

  appointments = signal<AppointmentDto[]>([]);
  isLoading = signal(true);

  stats = {
    totalPatients: 0,
    appointmentsToday: 0,
    earnings: 0,
  };

  ngOnInit() {
    this.loadSchedule();
  }

  loadSchedule() {
    this.isLoading.set(true);

    this.appointmentService.getDoctorSchedule().subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.calculateStats(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load schedule', err);
        this.isLoading.set(false);
      },
    });
  }

  private calculateStats(data: AppointmentDto[]) {
    const today = new Date().toISOString().split('T')[0];

    this.stats.appointmentsToday = data.filter((a) => a.startTime.startsWith(today)).length;
    this.stats.totalPatients = data.length;
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.Confirmed:
        return 'confirmed';
      case AppointmentStatus.Scheduled:
        return 'pending';
      case AppointmentStatus.Canceled:
        return 'cancelled';
      case AppointmentStatus.Completed:
        return 'completed';
      default:
        return '';
    }
  }
}
