export enum AppointmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export interface AppointmentDto {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  startTime: string; // Date ISO
  endTime: string; // Date ISO
  status: AppointmentStatus;
  medicalNotes?: string;
}

export interface CreateReviewRequest {
  doctorId: string;
  rating: number;
  text: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  startTime: string; // UTC
  endTime: string;
}
