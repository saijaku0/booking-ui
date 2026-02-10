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
  isProfileLoading = signal(true);
  isInitializing = signal(true);

  ngOnInit() {
    const user = this.authService.currentUser();

    if (!user || !user.id) {
      console.error('No user logged in');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.doctorService.resolveDoctorId(user.id).subscribe({
      next: (doctorId) => {
        if (doctorId) {
          this.loadProfile(doctorId);
        } else {
          console.error('This user is not a doctor!');
        }
        this.isInitializing.set(false);
      },
      error: () => this.isInitializing.set(false),
    });
  }

  initDoctorData() {
    const user = this.currentUser();

    if (user && user.id) {
      console.log('Auth UserId (Token):', user.id);

      this.doctorService.resolveDoctorId(user.id).subscribe({
        next: (realDoctorId) => {
          if (realDoctorId) {
            console.log('Real DoctorId (DB PK):', realDoctorId);

            this.loadProfile(realDoctorId);
          } else {
            console.error('Doctor entity not found for this User');
            this.isProfileLoading.set(false);
          }
        },
        error: (err) => {
          console.error('Error resolving doctor ID', err);
          this.isProfileLoading.set(false);
        },
      });
    }
  }

  loadProfile(doctorId: string) {
    this.doctorService.getDoctorProfile(doctorId).subscribe({
      next: (profile) => {
        this.doctorProfile.set(profile);
        this.isProfileLoading.set(false);
      },
      error: (err) => console.error(err),
    });
  }

  logout() {
    this.authService.logout();
  }

  get initial(): string {
    const name = this.doctorProfile()?.fullName || this.currentUser()?.email || '?';
    return name.charAt(0).toUpperCase();
  }
}
