import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { AppointmentResponse } from '@core/models/appointmnet.models';

@Component({
  selector: 'app-appointments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-table.html',
  styleUrl: './appointments-table.scss',
})
export class AppointmentsTable {
  @Input({ required: true }) appointments: AppointmentResponse[] = [];
  @Input() isLoading = false;
  @Output() action = new EventEmitter<{ type: string; id: string }>();

  searchQuery = signal('');
  statusFilter = signal<string>('all');
  periodFilter = signal<string>('all');

  activeMenuId = signal<string | null>(null);

  filteredAppointments = computed(() => {
    let data = this.appointments;
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter().toLowerCase();
    const period = this.periodFilter();

    if (query) {
      data = data.filter((a) => a.patientName.toLowerCase().includes(query));
    }

    if (status !== 'all') {
      data = data.filter((a) => a.status.toLowerCase() === status);
    }

    if (period !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      data = data.filter((a) => {
        const appDate = new Date(a.startTime);
        appDate.setHours(0, 0, 0, 0);

        if (period === 'today') {
          return appDate.getTime() === now.getTime();
        }
        if (period === 'upcoming') {
          return appDate >= now;
        }
        return true;
      });
    }

    return data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  });

  setFilter(filterType: 'status' | 'period', value: string) {
    if (filterType === 'status') this.statusFilter.set(value);
    if (filterType === 'period') this.periodFilter.set(value);
    this.activeMenuId.set(null);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeMenuId() === id) {
      this.closeMenu();
    } else {
      this.activeMenuId.set(id);
    }
  }

  closeMenu() {
    this.activeMenuId.set(null);
  }

  emitAction(type: string, id: string) {
    this.action.emit({ type, id });
    this.closeMenu();
  }

  getInitials(name: string): string {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : '?';
  }

  generateColor(name: string): string {
    const colors = ['#BFDBFE', '#BBF7D0', '#FECACA', '#FED7AA', '#DDD6FE', '#FBCFE8'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
