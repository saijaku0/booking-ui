export interface DoctorResponse {
  id: string;
  userId?: string | null;
  name: string;
  lastname: string;
  specialtyId: string;
  specialtyName: string;
  phoneNumber: string;
  imageUrl?: string | null;
  averageRating: number;
  reviewCount: number;
  consultationFee: number;
  experienceYears: number;
  bio?: string | null;
}

export interface CreateDoctorRequest {
  email: string;
  password: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  specialtyId: string;
  consultationFee: number;
  experienceYears: number;
  bio?: string;
  imageUrl?: string;
}

export interface UpdateDoctorRequest {
  userId: string;
  name: string;
  lastname: string;
  specialty: string;
  phoneNumber: string;
  bio?: string;
  experienceYears: number;
  imageUrl?: string;
  consultationFee: number;
  isActive: boolean;
}

export interface ScheduleConfig {
  dayStart: string;
  dayEnd: string;
  lunchStart: string;
  lunchEnd: string;
  workingDays: number[];
  slotDurationMinutes: number;
  bufferMinutes: number;
}

export interface CreateReviewRequest {
  doctorId: string;
  rating: number;
  text: string;
}

export interface ReviewDto {
  id: string;
  patientName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface TimeSlot {
  start: string; // "2026-02-12T11:30:00Z"
  end: string; // "2026-02-12T12:00:00Z"
  isAvailable: boolean;
}

export interface DoctorStatsDto {
  totalPatients: number;
  completedAppointments: number;
  totalEarnings: number;
  period: string;
}
