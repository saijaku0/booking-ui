export interface DoctorDetailsDto {
  id: string;
  fullName: string;
  specialty: string;
  photoUrl?: string;
  experienceYears: number;
  description: string;
  averageRating: number;
  totalReviews: number;
  bio: string;
}

export interface DoctorDto {
  id: string;
  userId: string;
  name: string;
  lastname: string;
  fullName: string;
  specialtyName: string;
  specialtyId: string;
  averageRating: number;
  reviewCount: number;
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
