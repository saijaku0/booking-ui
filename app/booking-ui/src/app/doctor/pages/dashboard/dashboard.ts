import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { AppointmentService, DoctorService } from '@core/services/index';
import { AppointmentDto, AppointmentStatus } from '@core/models/appointmnet.models';
import { StatsCards } from '../../components/stats-cards/stats-cards';
import { AppointmentsTable } from '../../components/appointments-table/appointments-table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCards, AppointmentsTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  readonly filterOptions = signal(['all', 'pending', 'confirmed', 'canceled', 'completed']);
  @ViewChild(AppointmentsTable) appointmentsTable!: AppointmentsTable;

  appointments = signal<AppointmentDto[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  statusFilter = signal('all');

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
    const filter = this.statusFilter().toLowerCase();

    return all.filter((a) => {
      const matchesName = (a.patientName || '').toLowerCase().includes(query);
      const matchesStatus = filter === 'all' ? true : a.status.toLowerCase() === filter;
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
  }

  closeAllMenus() {
    if (this.appointmentsTable) {
      this.appointmentsTable.closeMenu();
    }
  }

  updateFilter(filter: string, event: Event) {
    event.stopPropagation();
    this.setFilter(filter);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  handleTableAction(event: { type: string; id: string }) {
    const { type, id } = event;

    if (type === 'view') {
      console.log('Open details for', id);
    }
    if (type === 'cancel') {
      this.cancelAppointment(id);
    }
    if (type === 'confirm') {
      this.confirmAppointment(id);
    }
    if (type === 'complete') {
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
}
