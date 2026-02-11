import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-completion-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-completion-modal.html',
  styleUrl: './appointment-completion-modal.scss',
})
export class AppointmentCompletionModal {
  @Input({ required: true }) isOpen = false;
  @Input() patientName!: string;

  @Output() confirm = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  notes = '';

  onCancel() {
    this.notes = '';
    this.closeModal.emit();
  }

  onConfirm() {
    if (!this.notes.trim()) {
      alert('Please enter medical notes.');
      return;
    }
    this.confirm.emit(this.notes);
    this.notes = '';
  }

  generatePdf(type: 'prescription' | 'referral') {
    console.log(`Generating ${type} for ${this.patientName}...`);
  }
}
