import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  imports: [CommonModule],
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.scss',
})
export class CalendarHeaderComponent {
  @Input({ required: true }) viewDate!: Date;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
}
