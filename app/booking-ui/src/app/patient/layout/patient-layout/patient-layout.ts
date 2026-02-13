import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PatientDto } from '@core/models/patient.models';
import { AuthService } from '@core/services/auth/auth.service';
import { PatientService } from '@core/services/patient/patient.service';

@Component({
  selector: 'app-patient-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.scss',
})
export class PatientLayout implements OnInit {
  private authService = inject(AuthService);
  private patientService = inject(PatientService);

  currentUser = this.authService.currentUser;
  patientProfile = signal<PatientDto | null>(null);
  isSidebarOpen = signal(false);
  logout = signal(false);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.patientService.getPatientProfile().subscribe({
        next: (profile) => this.patientProfile.set(profile),
        error: (err) => console.error('Failed to load patient profile', err),
      });
    } else {
      console.error('No user logged in');
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update((val) => !val);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
