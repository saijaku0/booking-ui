import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CreateDoctorRequest, DoctorDetailsDto, DoctorDto } from '../models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class Doctor {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Doctors`;

  currentDoctorId = signal<string | null>(null);

  getDoctors() {
    return this.http.get<DoctorDto[]>(this.apiUrl);
  }

  getDoctorProfile(id: string) {
    return this.http.get<DoctorDto>(`${this.apiUrl}/${id}`).pipe(
      map((apiData) => {
        return {
          id: apiData.id,
          fullName: `${apiData.name} ${apiData.lastname}`,
          specialty: apiData.specialtyName || 'General Practice',
          photoUrl: apiData.imageUrl,
          averageRating: apiData.averageRating,
          experienceYears: apiData.experienceYears,
          totalReviews: apiData.reviewCount || 0,
          bio:
            apiData.bio ||
            `Dr. ${apiData.lastname} is an experienced specialist committed to providing excellent medical care.`,
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
        return found ? found.id : null;
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
}
