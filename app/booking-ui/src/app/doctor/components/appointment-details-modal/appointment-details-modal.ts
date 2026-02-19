import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { AppointmentResponse } from '@core/models/appointmnet.models';
import { AppointmentService } from '@core/services';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-appointment-details-modal',
  imports: [CommonModule],
  templateUrl: './appointment-details-modal.html',
  styleUrl: './appointment-details-modal.scss',
})
export class AppointmentDetailsModal implements OnChanges {
  private appointmentService = inject(AppointmentService);

  @Input() appointmentId: string | null = null;
  @Input() isDetailsOpen = false;
  @Output() closeDetailsModal = new EventEmitter<void>();

  appointment = signal<AppointmentResponse | null>(null);
  isLoading = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentId'] && this.appointmentId && this.isDetailsOpen) {
      this.loadDetails(this.appointmentId);
    }
  }

  private loadDetails(id: string) {
    this.isLoading.set(true);
    this.appointmentService
      .getAppointmentById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.appointment.set(data),
        error: (err) => {
          console.error('Error fetching details:', err);
          this.appointment.set(null);
        },
      });
  }

  downloadAttachment(fileId: string) {
    console.log('Downloading file:', fileId);
  }

  onCloseDetailsModal() {
    this.closeDetailsModal.emit();
  }
}
