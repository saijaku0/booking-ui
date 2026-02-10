import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment/appointment.service';
import { DoctorService } from '../../../core/services/doctor/doctor.service';
import { AppointmentDto, AppointmentStatus } from '../../../core/models/appointmnet.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);

  appointments = signal<AppointmentDto[]>([]);
  isLoading = signal(true);

  stats = {
    totalPatients: 0,
    appointmentsToday: 0,
    earnings: 0,
  };

  constructor() {
    effect(() => {
      const doctorId = this.doctorService.currentDoctorId();

      if (doctorId) {
        this.loadSchedule(doctorId);
      }
    });
  }

  loadSchedule(doctorId: string) {
    this.isLoading.set(true);
    this.appointmentService.getDoctorSchedule(doctorId).subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.calculateStats(data);
        this.isLoading.set(false);
      },
      error: () => {
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
