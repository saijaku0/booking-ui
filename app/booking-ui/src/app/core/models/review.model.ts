export interface ReviewDto {
  id: string;
  patientName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  doctorId: string;
  rating: number;
  text: string;
}
