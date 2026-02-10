export interface DoctorDetailsDto {
  id: string;
  fullName: string;
  specialty: string;
  photoUrl?: string;
  experienceYears: number;
  description: string;
  averageRating: number;
  totalReviews: number;
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
  name: string;
  lastname: string;
  email: string;
  password: string;
  specialtyId: string;
  isActive: boolean;
}
