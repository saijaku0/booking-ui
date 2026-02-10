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
