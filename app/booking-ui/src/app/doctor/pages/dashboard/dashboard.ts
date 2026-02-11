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

  readonly filterOptions = signal(['all', 'Pending', 'Confirmed', 'Canceled', 'Completed']);

  appointments = signal<AppointmentDto[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  statusFilter = signal('all');
  activeMenuId = signal<string | null>(null);

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

  filteredAppointments = computed(() => {
    const all = this.appointments();
    const query = this.searchQuery().toLowerCase();
    const filter = this.statusFilter();

    return all.filter((a) => {
      const matchesName = (a.patientName || '').toLowerCase().includes(query);
      const matchesStatus = filter === 'all' ? true : a.status === filter;
      return matchesName && matchesStatus;
    });
  });

  constructor() {
    effect(() => {
      const doctorId = this.doctorService.currentDoctorId();

      if (doctorId) {
        this.loadSchedule(doctorId);
      }
    });
  }

  setFilter(filter: string) {
    this.statusFilter.set(filter);
    this.activeMenuId.set(null);
  }

  updateFilter(filter: string, event: Event) {
    event.stopPropagation();
    this.setFilter(filter);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeMenuId() === id) {
      this.activeMenuId.set(null);
    } else {
      this.activeMenuId.set(id);
    }
  }

  closeMenu() {
    this.activeMenuId.set(null);
  }

  performAction(action: string, id: string) {
    this.closeMenu();

    if (action === 'view') {
      console.log('Open details for', id);
    }
    if (action === 'cancel') {
      this.cancelAppointment(id);
    }
    if (action === 'confirm') {
      this.confirmAppointment(id);
    }
    if (action === 'complete') {
      this.completeAppointment(id);
    }
  }

  confirmAppointment(id: string) {
    this.appointmentService.confirmAppointment(id).subscribe({
      next: () => {
        this.appointments.update((list) =>
          list.map((a) => {
            if (a.id === id) {
              return { ...a, status: AppointmentStatus.Confirmed };
            }
            return a;
          }),
        );
      },
      error: (err) => {
        console.error('Failed to confirm', err);
        alert('Could not confirm appointment');
      },
    });
  }

  cancelAppointment(id: string) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.appointments.update((currentList) =>
          currentList.map((appt) => {
            if (appt.id === id) {
              return { ...appt, status: AppointmentStatus.Canceled };
            }
            return appt;
          }),
        );
      },
      error: (err) => {
        console.error('Failed to cancel', err);
        alert('Error cancelling appointment');
      },
    });
  }

  completeAppointment(id: string) {
    const appt = this.appointments().find((a) => a.id === id);
    if (!appt) return;

    const notes = prompt('Enter medical notes for completion:');
    if (notes === null) return;

    this.appointmentService.completeAppointment(id, notes).subscribe({
      next: () => {
        this.appointments.update((currentList) =>
          currentList.map((a) => {
            if (a.id === id) {
              return { ...a, status: AppointmentStatus.Completed };
            }
            return a;
          }),
        );
      },
      error: (err) => {
        console.error('Failed to complete appointment', err);
        alert('Error completing appointment');
      },
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
      case AppointmentStatus.Pending:
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
