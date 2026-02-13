import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PatientDto } from '@core/models/patient.models';
import { environment } from '@env/environment';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Patient`;

  getPatientProfile() {
    return this.http.get<PatientDto>(`${this.apiUrl}/profile`).pipe(
      map((data) => {
        return {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          photoUrl: data.photoUrl || 'assets/default-patient.png',
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
        } as PatientDto;
      }),
    );
  }
}
