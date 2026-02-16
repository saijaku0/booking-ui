export enum AppointmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export enum AttachmentType {
  General = 0,
  LabResult = 1,
  XRay = 2,
  Prescription = 3,
}

// --- DTOs ---
export interface AppointmentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  createdAt: string;
}

export interface AppointmentResponse {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  doctorPhotoUrl?: string | null;
  doctorPhoneNumber?: string | null;
  patientId: string;
  patientName: string;
  startTime: string; // ISO Date
  endTime: string; // ISO Date
  price: number;
  status: AppointmentStatus;
  medicalNotes?: string | null;
  attachments: AppointmentAttachment[];
}

export interface CreateAppointmentRequest {
  doctorId: string;
  startTime: string;
  endTime: string;
}

export interface RescheduleRequest {
  startTime: string;
  endTime: string;
}

export interface CompleteAppointmentRequest {
  appointmentId: string;
  diagnosis: string;
  medicalNotes?: string;
  treatmentPlan?: string;
  prescribedMedications?: string;
}

export interface FileDownloadResponse {
  fileContents: string;
  contentType: string;
  fileDownloadName: string;
}
