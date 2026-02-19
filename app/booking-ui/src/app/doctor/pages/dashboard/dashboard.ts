import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AppointmentService, DoctorService } from '@core/services/index';
import {
  AppointmentResponse,
  AppointmentStatus,
  CompleteAppointmentRequest,
} from '@core/models/appointmnet.models';

import { StatsCards } from '../../components/stats-cards/stats-cards';
import { AppointmentsTable } from '../../components/appointments-table/appointments-table';
import { AppointmentCompletionModal } from '../../components/appointment-completion-modal/appointment-completion-modal';
import { CompletionFormData } from '../../components/appointment-completion-modal/model/completion-model';
import { RescheduleModal } from '../../components/reschedule-modal/reschedule-modal';
import { AppointmentDetailsModal } from '../../components/appointment-details-modal/appointment-details-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsCards,
    AppointmentsTable,
    AppointmentCompletionModal,
    RescheduleModal,
    AppointmentDetailsModal,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  public doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);

  appointments = signal<AppointmentResponse[]>([]);
  isLoading = signal(true);

  isCompleteModalOpen = signal(false);
  selectedAppointmentId = signal<string | null>(null);
  selectedPatientName = signal<string>('');

  isRescheduleModalOpen = signal(false);
  rescheduleAppointmentId = signal<string | null>(null);

  selectedDetailsId = signal<string | null>(null);
  isDetailsOpen = signal(false);

  doctorFullName = computed(() => {
    const doc = this.doctorService.currentDoctor();
    return doc ? `${doc.name} ${doc.lastname}` : 'Doctor';
  });

  constructor() {
    effect(() => {
      const doctorId = this.doctorService.currentDoctorId();
      if (doctorId) {
        this.loadSchedule(doctorId);
      }
    });
  }

  loadSchedule(idOrNull?: string) {
    const doctorId = idOrNull || this.doctorService.currentDoctorId();
    if (!doctorId) return;

    this.isLoading.set(true);

    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(now.getDate() + 30);

    this.appointmentService
      .getDoctorAppointments(doctorId, now.toISOString(), nextMonth.toISOString())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.appointments.set(data);
        },
        error: (err) => {
          console.error('Ошибка загрузки:', err);
          this.appointments.set([]);
        },
      });
  }

  handleTableAction(event: { type: string; id: string }) {
    const { type, id } = event;

    switch (type) {
      case 'view':
        this.selectedDetailsId.set(id);
        this.isDetailsOpen.set(true);
        break;

      case 'reschedule':
        this.rescheduleAppointmentId.set(id);
        this.isRescheduleModalOpen.set(true);
        break;

      case 'confirm':
        this.changeStatus(id, AppointmentStatus.Confirmed);
        break;

      case 'cancel':
        if (confirm('Are you sure you want to cancel this appointment?')) {
          this.changeStatus(id, AppointmentStatus.Canceled);
        }
        break;

      case 'complete': {
        const appt = this.appointments().find((a) => a.id === id);
        if (appt) {
          this.selectedAppointmentId.set(id);
          this.selectedPatientName.set(appt.patientName);
          this.isCompleteModalOpen.set(true);
        }
        break;
      }
    }
  }

  onRescheduleConfirm(newDateIso: string) {
    const id = this.rescheduleAppointmentId();
    if (!id) return;

    const originalAppt = this.appointments().find((a) => a.id === id);
    if (!originalAppt) return;

    const start = new Date(originalAppt.startTime).getTime();
    const end = new Date(originalAppt.endTime).getTime();
    const durationMs = end - start;

    const newStart = new Date(newDateIso).getTime();
    const newEndIso = new Date(newStart + durationMs).toISOString();

    this.appointmentService.rescheduleAppointment(id, newDateIso, newEndIso).subscribe({
      next: () => {
        this.appointments.update((list) =>
          list.map((a) =>
            a.id === id
              ? {
                  ...a,
                  startTime: newDateIso,
                  endTime: newEndIso,
                  status: AppointmentStatus.Confirmed,
                }
              : a,
          ),
        );
        alert('Appointment rescheduled successfully');
        this.isRescheduleModalOpen.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to reschedule. Probably slot is taken.');
        this.isRescheduleModalOpen.set(false);
      },
    });
  }

  private changeStatus(id: string, status: AppointmentStatus) {
    const request$ =
      status === AppointmentStatus.Confirmed
        ? this.appointmentService.confirmAppointment(id)
        : this.appointmentService.cancelAppointment(id);

    request$.subscribe({
      next: () => {
        this.appointments.update((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
      },
      error: () => alert('Failed to update status'),
    });
  }

  onCompleteConfirm(formData: CompletionFormData) {
    const id = this.selectedAppointmentId();
    if (!id) return;

    const req: CompleteAppointmentRequest = {
      appointmentId: id,
      diagnosis: formData.diagnosis,
      medicalNotes: formData.medicalNotes,
      treatmentPlan: formData.treatmentPlan,
      prescribedMedications: formData.prescribedMedications,
    };

    this.appointmentService.completeAppointment(id, req).subscribe({
      next: () => {
        this.appointments.update((list) =>
          list.map((a) => (a.id === id ? { ...a, status: AppointmentStatus.Completed } : a)),
        );
        this.closeCompleteModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error completing appointment');
      },
    });
  }

  closeCompleteModal() {
    this.isCompleteModalOpen.set(false);
    this.selectedAppointmentId.set(null);
  }

  closeRescheduleModal() {
    this.isRescheduleModalOpen.set(false);
    this.rescheduleAppointmentId.set(null);
  }

  closeDetailsModal() {
    this.isDetailsOpen.set(false);
    this.selectedDetailsId.set(null);
  }
}
