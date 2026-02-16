export interface PatientDto {
  id: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  dateOfBirth: string;
  gender: string;
  address?: string | null;
}
