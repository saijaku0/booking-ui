import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap, catchError, of } from 'rxjs';
import {
  CreateDoctorRequest,
  CreateReviewRequest,
  DoctorDetailsDto,
  DoctorDto,
  DoctorStatsDto,
  ReviewDto,
} from '@core/models/doctor.model';
import { TimeSlot } from '@core/models/appointmnet.models';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Doctors`;

  currentDoctor = signal<DoctorDto | null>(null);
  currentDoctorId = signal<string | null>(null);

  getDoctors() {
    return this.http.get<DoctorDto[]>(this.apiUrl);
  }

  getDoctorProfile(id: string) {
    return this.http.get<DoctorDto>(`${this.apiUrl}/${id}`).pipe(
      map((data) => {
        return {
          id: data.id,
          name: data.name,
          lastname: data.lastname,
          specialtyName: data.specialtyName || data.specialty,
          imageUrl: data.imageUrl || data.photoUrl || 'assets/default-doctor.png',
          averageRating: data.averageRating || 0,
          reviewCount: data.reviewCount || data.totalReviews || 0,
          consultationFee: data.consultationFee || 50,
          experienceYears: data.experienceYears || 0,
          bio: data.bio || '',
        } as DoctorDetailsDto;
      }),
    );
  }

  createDoctor(request: CreateDoctorRequest) {
    return this.http.post<void>(this.apiUrl, request);
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

  addReview(review: CreateReviewRequest) {
    return this.http.post<void>(`${environment.apiUrl}/Reviews`, review);
  }

  getDoctorStats(doctorId: string, period: string) {
    return this.http.get<DoctorStatsDto>(`${this.apiUrl}/${doctorId}/stats?period=${period}`);
  }

  getDoctorSlots(doctorId: string, date: string) {
    const isoDate = `${date}T00:00:00Z`;
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/${doctorId}/slots?date=${isoDate}`);
  }

  getDoctorReviews(doctorId: string) {
    return this.http.get<ReviewDto[]>(`${environment.apiUrl}/Reviews?doctorId=${doctorId}`);
  }
}
