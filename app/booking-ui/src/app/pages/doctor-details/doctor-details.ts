import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorDetailsDto, ReviewDto } from '@core/models/doctor.model';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CreateAppointmentRequest,
  CreateReviewRequest,
  TimeSlot,
} from '@core/models/appointmnet.models';
import { DoctorService, AppointmentService, AuthService } from '@core/services/index';
import { DoctorInfo } from './components/doctor-info/doctor-info';
import { DoctorReviews } from './components/doctor-reviews/doctor-reviews';
import { DoctorBooking } from './components/doctor-booking/doctor-booking';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DoctorInfo, DoctorReviews, DoctorBooking],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.scss',
})
export class DoctorDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  userRating = signal(0);
  hoverRating = signal(0);
  reviewText = signal('');
  isSubmittingReview = signal(false);

  reviews = signal<ReviewDto[]>([]);
  isLoadingReviews = signal(false);

  isLoading = signal(true);
  isLoadingSlots = signal(false);
  isBooking = signal(false);

  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedSlot = signal<TimeSlot | null>(null);

  doctor = signal<DoctorDetailsDto | null>(null);
  availableSlots = signal<TimeSlot[]>([]);

  constructor() {
    effect(() => {
      const doc = this.doctor();
      const date = this.selectedDate();

      if (doc && date) {
        this.loadSlots(doc.id, date);
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDoctor(id);
  }

  setHoverRating(stars: number) {
    this.hoverRating.set(stars);
  }

  clearHoverRating() {
    this.hoverRating.set(0);
  }

  submitReview(event: { rating: number; text: string }) {
    const doc = this.doctor();
    if (!doc) return;

    this.isSubmittingReview.set(true);

    const request: CreateReviewRequest = {
      doctorId: doc.id,
      rating: event.rating,
      text: event.text,
    };

    this.doctorService.addReview(request).subscribe({
      next: () => {
        alert('Thank you for your review!');
        this.isSubmittingReview.set(false);
        this.loadReviews(doc.id);
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        console.error(err);
      },
    });
  }

  loadSlots(doctorId: string, date: string) {
    console.log('1. Запуск loadSlots для:', date);
    this.isLoadingSlots.set(true);
    this.selectedSlot.set(null);

    this.doctorService.getDoctorSlots(doctorId, date).subscribe({
      next: (slots) => {
        console.log('2. Ответ сервера (Слоты):', slots);
        this.availableSlots.set(slots);
        this.isLoadingSlots.set(false);
      },
      error: (err) => {
        console.error('Error loading slots', err);
        this.availableSlots.set([]);
        this.isLoadingSlots.set(false);
      },
    });
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDate.set(input.value);
  }

  loadDoctor(id: string) {
    this.doctorService.getDoctorProfile(id).subscribe({
      next: (data) => {
        this.doctor.set(data);
        this.isLoading.set(false);
        this.loadReviews(data.id);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadReviews(doctorId: string) {
    this.isLoadingReviews.set(true);
    this.doctorService.getDoctorReviews(doctorId).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        console.error('Ошибка загрузки отзывов', err);
        this.isLoadingReviews.set(false);
      },
    });
  }

  selectSlot(slot: TimeSlot) {
    if (slot.isAvailable) {
      this.selectedSlot.set(slot);
    }
  }

  bookAppointment(slot: TimeSlot) {
    const doc = this.doctor();
    if (!doc || !slot) return;

    if (!this.authService.currentUser()) {
      alert('Please login');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isBooking.set(true);

    const request: CreateAppointmentRequest = {
      doctorId: doc.id,
      startTime: slot.start,
      endTime: slot.end,
    };

    this.appointmentService.createAppointment(request).subscribe({
      next: () => {
        alert('Success!');
        this.isBooking.set(false);
        this.loadSlots(doc.id, this.selectedDate());
      },
      error: (err) => {
        alert('Error: ' + err.message);
        this.isBooking.set(false);
      },
    });
  }
}
