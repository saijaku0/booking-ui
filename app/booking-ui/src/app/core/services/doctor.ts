import { inject, Injectable } from '@angular/core';
import { DoctorDetailsDto } from '../models/doctor.model';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Doctor {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/Doctors`;

  getDoctorProfile(id: string) {
    return this.http.get<DoctorDetailsDto>(`${this.apiUrl}/${id}`);
  }
}
