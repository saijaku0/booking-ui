import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, delay } from 'rxjs';

export interface AdminStats {
  totalDoctors: number;
  totalPatients: number;
  appointmentsToday: number;
  totalRevenue: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  // private apiUrl = ...

  // Пока имитируем данные. Позже заменишь на this.http.get<AdminStats>(...)
  getStats() {
    const mockStats: AdminStats = {
      totalDoctors: 12,
      totalPatients: 145,
      appointmentsToday: 24,
      totalRevenue: 15400,
    };
    return of(mockStats).pipe(delay(500)); // Имитация задержки сети
  }
}
