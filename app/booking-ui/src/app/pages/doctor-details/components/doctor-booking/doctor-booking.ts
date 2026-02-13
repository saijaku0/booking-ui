import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSlot } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-doctor-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-booking.html',
  styleUrl: './doctor-booking.scss',
})
export class DoctorBooking {
  @Input({ required: true }) slots: TimeSlot[] = [];
  @Input() selectedDate = '';
  @Input() isLoadingSlots = false;
  @Input() isBooking = false;

  @Output() dateChange = new EventEmitter<string>();
  @Output() confirmBooking = new EventEmitter<TimeSlot>();

  selectedSlot = signal<TimeSlot | null>(null);

  onDateChange(newDate: string) {
    this.selectedSlot.set(null);
    this.dateChange.emit(newDate);
  }

  onSelectSlot(slot: TimeSlot) {
    if (slot.isAvailable) {
      this.selectedSlot.set(slot);
    }
  }

  onBook() {
    const slot = this.selectedSlot();
    if (slot) {
      this.confirmBooking.emit(slot);
    }
  }
}
