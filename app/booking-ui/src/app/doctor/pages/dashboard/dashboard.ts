import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { AppointmentService, DoctorService } from '@core/services/index';
import { AppointmentDto, AppointmentStatus } from '@core/models/appointmnet.models';

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

  doctorFullName = computed(() => {
    const doc = this.doctorService.currentDoctor();
    if (doc) {
      return `${doc.name} ${doc.lastname}`;
    }
    return 'Doctor';
  });

  constructor() {
    effect(() => {
      const doctorId = this.doctorService.currentDoctorId();

      if (doctorId) {
        this.loadSchedule(doctorId);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  generateColor(name: string | undefined): string {
    if (!name) return '#e0e0e0';

    const colors = [
      '#FFCDD2',
      '#F8BBD0',
      '#E1BEE7',
      '#D1C4E9',
      '#C5CAE9',
      '#BBDEFB',
      '#B3E5FC',
      '#B2EBF2',
      '#B2DFDB',
      '#C8E6C9',
      '#DCEDC8',
      '#F0F4C3',
      '#FFECB3',
      '#FFE0B2',
      '#FFCCBC',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash % colors.length);

    return colors[index];
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
