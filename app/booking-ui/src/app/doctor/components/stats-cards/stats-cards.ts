import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-cards',
  imports: [CommonModule],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards {
  @Input({ required: true }) stats!: {
    totalPatients: number;
    completedAppointments: number;
    totalEarnings: number;
    appointmentsToday?: number;
  };
}
