import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap, catchError, of } from 'rxjs';
import {
  CreateDoctorRequest,
  DoctorResponse,
  DoctorStatsDto,
  ScheduleConfig,
  UpdateDoctorRequest,
} from '@core/models/doctor.model';
import { TimeSlot } from '@core/models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Doctors`;

  currentDoctor = signal<DoctorResponse | null>(null);
  currentDoctorId = signal<string | null>(null);

  getDoctors(searchTerm = '', specialtyId = ''): Observable<DoctorResponse[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('SearchTerm', searchTerm);
    if (specialtyId) params = params.set('SpecialtyId', specialtyId);

    return this.http.get<DoctorResponse[]>(this.apiUrl, { params });
  }

  getDoctorById(id: string): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(`${this.apiUrl}/${id}`);
  }

  createDoctor(doctor: CreateDoctorRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, doctor);
  }

  updateDoctor(id: string, doctor: UpdateDoctorRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  resolveDoctorId(authUserId: string): Observable<string | null> {
    return this.getDoctors().pipe(
      map((doctors) => {
        const found = doctors.find((d) => d.userId?.toLowerCase() === authUserId.toLowerCase());

        if (found) {
          this.currentDoctor.set(found);
          return found.id;
        }

        return null;
      }),
      tap((id) => {
        if (id) {
          this.currentDoctorId.set(id);
        }
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }

  uploadProfilePhoto(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/profile-photo`, formData);
  }

  getDoctorStats(id: string, period = 'month'): Observable<DoctorStatsDto> {
    const params = new HttpParams().set('period', period);
    return this.http.get<DoctorStatsDto>(`${this.apiUrl}/${id}/stats`, { params });
  }

  updateSchedule(id: string, config: ScheduleConfig): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/schedule`, config);
  }

  getAvailableSlots(id: string, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/${id}/slots`, { params });
  }
}
