import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { AppointmentDto, AppointmentStatus } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-appointments-table',
  imports: [CommonModule],
  templateUrl: './appointments-table.html',
  styleUrl: './appointments-table.scss',
})
export class AppointmentsTable {
  @Input({ required: true }) appointments: AppointmentDto[] = [];
  @Input() isLoading = false;

  @Output() action = new EventEmitter<{ type: string; id: string }>();

  activeMenuId = signal<string | null>(null);

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

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeMenuId() === id) {
      this.activeMenuId.set(null);
    } else {
      this.activeMenuId.set(id);
    }
  }

  onActionClick(type: string, id: string) {
    this.activeMenuId.set(null);
    this.action.emit({ type, id });
  }

  closeMenu() {
    this.activeMenuId.set(null);
  }
}
