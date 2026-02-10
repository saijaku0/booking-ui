import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { AppointmentDto, CreateAppointmentRequest } from './appointmnet.models';

@Injectable({
  providedIn: 'root',
})
export class Appointment {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Appointments`;

  getDoctorSchedule() {
    return this.http.get<AppointmentDto[]>(`${this.apiUrl}/doctor-schedule`);
  }

  getPatientHistory() {
    return this.http.get<AppointmentDto[]>(`${this.apiUrl}/patient-history`);
  }

  createAppointment(request: CreateAppointmentRequest) {
    return this.http.post<void>(this.apiUrl, request);
  }

  completeAppointment(id: string, medicalNotes: string) {
    return this.http.post<void>(`${this.apiUrl}/${id}/complete`, { medicalNotes });
  }
}
