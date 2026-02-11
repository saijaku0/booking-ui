import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap, catchError, of } from 'rxjs';
import { CreateDoctorRequest, DoctorDetailsDto, DoctorDto } from '@core/models/doctor.model';

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
}
