import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewDto } from '@core/models/doctor.model';

@Component({
  selector: 'app-doctor-reviews',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './doctor-reviews.html',
  styleUrl: './doctor-reviews.scss',
})
export class DoctorReviews {
  @Input({ required: true }) reviews: ReviewDto[] = [];
  @Input() user!: { id: number; name: string };
  @Input() isSubmitting = false;

  @Output() submitReview = new EventEmitter<{ rating: number; text: string }>();

  userRating = signal(0);
  hoverRating = signal(0);
  comment = signal('');

  stars = [1, 2, 3, 4, 5];

  setRating(star: number) {
    this.userRating.set(star);
  }

  sendReview() {
    const rating = this.userRating();
    const text = this.comment();

    if (rating > 0) {
      this.submitReview.emit({ rating, text });

      this.userRating.set(0);
      this.comment.set('');
    }
  }
}
