import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppointmentDto, CreateAppointmentRequest } from '@core/models/appointmnet.models';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Appointments`;

  getDoctorSchedule(doctorId?: string) {
    let params = new HttpParams();
    if (doctorId) {
      params = params.set('doctorId', doctorId);
    }

    return this.http.get<AppointmentDto[]>(`${this.apiUrl}/doctor-schedule`, { params });
  }

  getPatientHistory() {
    return this.http.get<AppointmentDto[]>(`${this.apiUrl}/patient-history`);
  }

  createAppointment(request: CreateAppointmentRequest) {
    return this.http.post<void>(this.apiUrl, request);
  }

  completeAppointment(id: string, medicalNotes: string) {
    return this.http.post<void>(`${this.apiUrl}/${id}/complete`, JSON.stringify(medicalNotes), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  confirmAppointment(id: string) {
    return this.http.post<void>(`${this.apiUrl}/${id}/confirm`, {});
  }

  cancelAppointment(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAppointmentList(doctorId?: string, start?: string, end?: string) {
    let params = new HttpParams();
    if (doctorId) {
      params = params.set('doctorId', doctorId);
    }
    if (start) {
      params = params.set('start', start);
    }
    if (end) {
      params = params.set('end', end);
    }

    return this.http.get<AppointmentDto[]>(`${this.apiUrl}`, { params });
  }
}
