import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CreateReviewRequest, ReviewDto } from '@core/models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Reviews`;

  getDoctorReviews(doctorId: string): Observable<ReviewDto[]> {
    const params = new HttpParams().set('doctorId', doctorId);
    return this.http.get<ReviewDto[]>(this.apiUrl, { params });
  }

  createReview(review: CreateReviewRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, review);
  }
}
