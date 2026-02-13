export interface DoctorDetailsDto {
  id: string;
  name: string;
  lastname: string;
  specialtyName: string;
  imageUrl?: string;
  averageRating: number;
  reviewCount: number;
  consultationFee: number;
  experienceYears: number;
  bio?: string;
}

export interface DoctorDto {
  id: string;
  userId: string;
  name: string;
  lastname: string;
  fullName: string;
  specialty: string;
  photoUrl: string;
  specialtyName: string;
  specialtyId: string;
  averageRating: number;
  reviewCount: number;
  totalReviews: number;
  imageUrl?: string;
  consultationFee: number;
  experienceYears: number;
  bio: string;
}

export interface CreateDoctorRequest {
  email: string;
  password: string;
  name: string;
  lastname: string;
  specialtyId: string;
  isActive: boolean;
  consultationFee: number;
  experienceYears: number;
  bio?: string | null;
  imageUrl?: string | null;
}

export interface DoctorStatsDto {
  totalPatients: number;
  completedAppointments: number;
  totalEarnings: number;
  period: string;
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
