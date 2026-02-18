import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompletionFormData } from './model/completion-model';

@Component({
  selector: 'app-completion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-completion-modal.html',
  styleUrl: './appointment-completion-modal.scss',
})
export class AppointmentCompletionModal {
  @Input({ required: true }) isOpen = false;
  @Input() patientName = '';

  @Output() confirm = new EventEmitter<CompletionFormData>();
  @Output() closeModal = new EventEmitter<void>();

  formData: CompletionFormData = {
    diagnosis: '',
    medicalNotes: '',
    treatmentPlan: '',
    prescribedMedications: '',
  };

  onCancel() {
    this.resetForm();
    this.closeModal.emit();
  }

  onConfirm() {
    if (!this.formData.diagnosis.trim()) {
      alert('Diagnosis is required to complete the appointment.');
      return;
    }

    this.confirm.emit({ ...this.formData });
    this.resetForm();
  }

  private resetForm() {
    this.formData = {
      diagnosis: '',
      medicalNotes: '',
      treatmentPlan: '',
      prescribedMedications: '',
    };
  }
}
