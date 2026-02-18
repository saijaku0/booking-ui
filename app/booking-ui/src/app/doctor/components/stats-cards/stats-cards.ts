import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { DoctorService } from '@core/services/index';
import { DoctorStatsDto } from '@core/models/doctor.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards implements OnChanges {
  private doctorService = inject(DoctorService);

  @Input({ required: true }) doctorId!: string;

  readonly periods = ['Day', 'Week', 'Month'];

  stats = signal<DoctorStatsDto | null>(null);
  selectedPeriod = signal<string>('Day');
  isLoading = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctorId'] && this.doctorId) {
      this.loadStats(this.selectedPeriod());
    }
  }

  loadStats(period: string): void {
    this.selectedPeriod.set(period);
    this.isLoading.set(true);

    if (!this.doctorId) return;

    this.doctorService
      .getDoctorStats(this.doctorId, period)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.stats.set(data);
        },
        error: (err) => {
          console.error('Stats loading failed:', err);
        },
      });
  }
}
