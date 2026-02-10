import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor/doctor.service';
import { AppointmentService } from '../../core/services/appointment/appointment.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { DoctorDetailsDto } from '../../core/models/doctor.model';
import { CreateAppointmentRequest } from '../../core/models/appointmnet.models';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.scss',
})
export class DoctorDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  doctor = signal<DoctorDetailsDto | null>(null);
  isLoading = signal(true);
  isBooking = signal(false);

  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedTime = signal<string | null>(null);

  timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDoctor(id);
  }

  loadDoctor(id: string) {
    this.doctorService.getDoctorProfile(id).subscribe({
      next: (data) => {
        this.doctor.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
  }

  bookAppointment() {
    if (!this.authService.currentUser()) {
      alert('Please login to book an appointment');
      this.router.navigate(['/login']);
      return;
    }

    const doc = this.doctor();
    const date = this.selectedDate();
    const time = this.selectedTime();

    if (!doc || !date || !time) return;

    this.isBooking.set(true);

    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const request: CreateAppointmentRequest = {
      doctorId: doc.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };

    this.appointmentService.createAppointment(request).subscribe({
      next: () => {
        alert('Appointment booked successfully!');
        this.isBooking.set(false);
        this.selectedTime.set(null);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to book. ' + (err.error?.message || 'Unknown error'));
        this.isBooking.set(false);
      },
    });
  }
}
