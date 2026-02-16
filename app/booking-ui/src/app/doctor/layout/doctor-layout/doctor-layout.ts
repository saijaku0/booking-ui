import { CommonModule } from '@angular/common';
import { DoctorResponse } from '@core/models/doctor.model';
import { AuthService, DoctorService } from '@core/services/index';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MainLayout } from '@shared/components/main-layout/main-layout';

@Component({
  selector: 'app-doctor-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MainLayout],
  templateUrl: './doctor-layout.html',
  styleUrl: './doctor-layout.scss',
})
export class DoctorLayout implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  doctorProfile = signal<DoctorResponse | null>(null);
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
      next: (doctorId: string | null) => {
        if (doctorId) {
          this.loadProfile(doctorId);
        } else {
          console.error('This user is not a doctor!');
          this.isProfileLoading.set(false);
        }
        this.isInitializing.set(false);
      },
      error: (err: string) => {
        console.error(err);
        this.isInitializing.set(false);
        this.isProfileLoading.set(false);
      },
    });
  }

  loadProfile(doctorId: string) {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (profile: DoctorResponse) => {
        this.doctorProfile.set(profile);
        this.isProfileLoading.set(false);
      },
      error: (err: string) => {
        console.error('Failed to load doctor profile', err);
        this.isProfileLoading.set(false);
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  get initial(): string {
    const name = this.doctorProfile()?.name || this.currentUser()?.email || '?';
    return name.charAt(0).toUpperCase();
  }
}
