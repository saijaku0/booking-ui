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
  customerId: string;
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

export interface TimeSlot {
  start: string; // "2026-02-12T11:30:00Z"
  end: string; // "2026-02-12T12:00:00Z"
  isAvailable: boolean;
}
