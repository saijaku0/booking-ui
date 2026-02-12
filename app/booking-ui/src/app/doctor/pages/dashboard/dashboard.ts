import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { AppointmentService, DoctorService } from '@core/services/index';
import { AppointmentDto, AppointmentStatus } from '@core/models/appointmnet.models';
import { StatsCards } from '../../components/stats-cards/stats-cards';
import { AppointmentsTable } from '../../components/appointments-table/appointments-table';
import { AppointmentCompletionModal } from '../../components/appointment-completion-modal/appointment-completion-modal';
import { DoctorStatsDto } from '@core/models/doctor.model';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCards, AppointmentsTable, AppointmentCompletionModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  readonly filterOptions = signal(['all', 'pending', 'confirmed', 'canceled', 'completed']);
  readonly periods = ['Day', 'Week', 'Month'];
  @ViewChild(AppointmentsTable) appointmentsTable!: AppointmentsTable;
  isCompleteModalOpen = signal(false);
  selectedAppointmentForCompletion = signal<{ id: string; name: string } | null>(null);

  appointments = signal<AppointmentDto[]>([]);
  selectedPeriod = signal<string>('Day');
  stats = signal<DoctorStatsDto | null>(null);
  isLoadingStats = signal<boolean>(false);
  isLoading = signal(true);
  searchQuery = signal('');
  statusFilter = signal('all');

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
        this.loadStats(this.selectedPeriod());
      }
    });
  }

  loadStats(period: string): void {
    this.selectedPeriod.set(period);
    this.isLoadingStats.set(true);

    const doctorId = this.doctorService.currentDoctorId();

    if (!doctorId) return;

    this.doctorService
      .getDoctorStats(doctorId, period)
      .pipe(finalize(() => this.isLoadingStats.set(false)))
      .subscribe({
        next: (data) => {
          this.stats.set(data);
          console.log('Статистика загружена:', data);
        },
        error: (err) => {
          console.error('Статистика не загрузилась:', err);
        },
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

    this.selectedAppointmentForCompletion.set({ id: appt.id, name: appt.patientName });

    this.isCompleteModalOpen.set(true);
  }

  onModalConfirm(notes: string) {
    const selected = this.selectedAppointmentForCompletion();
    if (!selected) return;

    this.appointmentService.completeAppointment(selected.id, notes).subscribe({
      next: () => {
        this.appointments.update((list) =>
          list.map((a) =>
            a.id === selected.id ? { ...a, status: AppointmentStatus.Completed } : a,
          ),
        );
        this.closeCompleteModal();
      },
      error: (err) => {
        console.error('Error', err);
        alert('Error completing appointment');
      },
    });
  }

  closeCompleteModal() {
    this.isCompleteModalOpen.set(false);
    this.selectedAppointmentForCompletion.set(null);
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
    const today = new Date().toLocaleDateString('en-CA');
    const todayCount = data.filter((a) => a.startTime.startsWith(today)).length;

    this.stats.update(
      (current) =>
        ({
          ...(current || {
            totalPatients: 0,
            completedAppointments: 0,
            totalEarnings: 0,
            period: 'Day',
          }),
          totalPatients: data.length,
          appointmentsToday: todayCount,
        }) as DoctorStatsDto,
    );
  }
}
