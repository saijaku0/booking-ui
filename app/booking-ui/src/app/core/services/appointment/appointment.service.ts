import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  AppointmentResponse,
  AttachmentType,
  CompleteAppointmentRequest,
  CreateAppointmentRequest,
  RescheduleRequest,
} from '@core/models/appointmnet.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Appointments`;

  // --- Patient + Doctor ---

  createAppointment(request: CreateAppointmentRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, request);
  }

  getAppointmentById(id: string): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(`${this.apiUrl}/${id}`);
  }

  cancelAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- DOCTORS METHODS ---

  getDoctorSchedule(start?: string, end?: string): Observable<AppointmentResponse[]> {
    let params = new HttpParams();
    if (start) params = params.set('start', start);
    if (end) params = params.set('end', end);

    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/doctor-schedule`, { params });
  }

  confirmAppointment(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/confirm`, {});
  }

  getDoctorAppointments(doctorId: string, start: string, end: string) {
    const params = new HttpParams().set('doctorId', doctorId).set('start', start).set('end', end);

    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/`, { params });
  }

  rescheduleAppointment(
    id: string,
    startTime: string,
    endTime: string,
  ): Observable<RescheduleRequest[]> {
    return this.http.put<RescheduleRequest[]>(`${this.apiUrl}/${id}/reschedule`, {
      startTime: startTime,
      endTime: endTime,
    });
  }

  completeAppointment(id: string, data: CompleteAppointmentRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/complete`, data);
  }

  // --- PATIENTS METHODS ---

  getPatientHistory(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/patient-history`);
  }

  // --- Attachments ---

  uploadAttachment(appointmentId: string, file: File, type: AttachmentType): Observable<void> {
    const formData = new FormData();
    formData.append('file', file); // Имя поля должно совпадать с IFormFile в контроллере
    formData.append('type', type.toString());

    return this.http.post<void>(`${this.apiUrl}/${appointmentId}/attachments`, formData);
  }

  // DELETE:
  deleteAttachment(appointmentId: string, attachmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}/attachments/${attachmentId}`);
  }

  // GET: Report
  downloadReport(appointmentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${appointmentId}/report`, {
      responseType: 'blob',
    });
  }
}
