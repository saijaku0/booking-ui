import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, SimpleChanges, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreateReviewRequest, ReviewDto } from '@core/models/doctor.model';
import { AuthService } from '@core/services';
import { ReviewService } from '@core/services/reviews/reviews.service';

@Component({
  selector: 'app-doctor-reviews',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './doctor-reviews.html',
  styleUrl: './doctor-reviews.scss',
})
export class DoctorReviews implements OnChanges {
  private reviewService = inject(ReviewService);
  public authService = inject(AuthService);

  @Input({ required: true }) doctorId!: string;

  reviews = signal<ReviewDto[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);

  userRating = signal(0);
  hoverRating = signal(0);
  comment = signal('');
  stars = [1, 2, 3, 4, 5];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['doctorId'] && this.doctorId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.isLoading.set(true);
    this.reviewService.getDoctorReviews(this.doctorId).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading reviews', err);
        this.isLoading.set(false);
      },
    });
  }

  setRating(star: number) {
    this.userRating.set(star);
  }

  setHover(star: number) {
    this.hoverRating.set(star);
  }

  clearHover() {
    this.hoverRating.set(0);
  }

  sendReview() {
    const rating = this.userRating();
    const text = this.comment();

    if (rating > 0 && text.trim()) {
      this.isSubmitting.set(true);

      const request: CreateReviewRequest = {
        doctorId: this.doctorId,
        rating: rating,
        text: text,
      };

      this.reviewService.createReview(request).subscribe({
        next: () => {
          this.userRating.set(0);
          this.comment.set('');
          this.isSubmitting.set(false);
          this.loadReviews();
        },
        error: () => {
          alert('Failed to post review');
          this.isSubmitting.set(false);
        },
      });
    }
  }
}
