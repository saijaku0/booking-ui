import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reschedule-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './reschedule-modal.html',
  styleUrl: './reschedule-modal.scss',
})
export class RescheduleModal {
  @Input() isOpen = false;
  @Output() closeRescheduleModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  newDate = '';
  minDate = new Date().toISOString().slice(0, 16);

  onCloseRescheduleModal() {
    this.newDate = '';
    this.closeRescheduleModal.emit();
  }

  onConfirm() {
    if (!this.newDate) return;

    const dateObj = new Date(this.newDate);
    const isoString = dateObj.toISOString();

    this.confirm.emit(isoString);
    this.onCloseRescheduleModal();
  }
}
