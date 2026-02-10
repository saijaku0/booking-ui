import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';
import { Doctor } from '../../../core/services/doctor';
import { DoctorDetailsDto } from '../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './doctor-layout.html',
  styleUrl: './doctor-layout.scss',
})
export class DoctorLayout implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(Doctor);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  doctorProfile = signal<DoctorDetailsDto | null>(null);

  ngOnInit() {
    this.loadDoctorProfile();
  }

  loadDoctorProfile() {
    const user = this.currentUser();
    if (user && user.id) {
      this.doctorService.getDoctorProfile(user.id).subscribe({
        next: (profile) => {
          this.doctorProfile.set(profile);
        },
        error: (err) => {
          console.error('Failed to load doctor profile', err);
        },
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  get initial(): string {
    const name = this.doctorProfile()?.fullName || this.currentUser()?.email || '?';
    return name.charAt(0).toUpperCase();
  }
}
