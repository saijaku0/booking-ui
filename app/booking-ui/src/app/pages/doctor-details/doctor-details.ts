import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '@core/services/index';
import { DoctorInfo } from './components/doctor-info/doctor-info';
import { DoctorReviews } from './components/doctor-reviews/doctor-reviews';
import { DoctorBooking } from './components/doctor-booking/doctor-booking';
import { DoctorResponse } from '@core/models/doctor.model';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DoctorInfo, DoctorReviews, DoctorBooking],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.scss',
})
export class DoctorDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private doctorService = inject(DoctorService);

  doctor = signal<DoctorResponse | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDoctor(id);
    }
  }

  private loadDoctor(id: string) {
    this.isLoading.set(true);
    this.doctorService.getDoctorById(id).subscribe({
      next: (data) => {
        this.doctor.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading doctor', err);
        this.isLoading.set(false);
      },
    });
  }
}
