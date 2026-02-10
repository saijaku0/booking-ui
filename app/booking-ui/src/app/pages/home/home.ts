import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorCard, DoctorCardDto } from '../../components/doctor-card/doctor-card';
import { DoctorService } from '../../core/services/doctor/doctor.service';
import { DoctorDto } from '../../core/models/doctor.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DoctorCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private doctorService = inject(DoctorService);

  doctors = signal<DoctorCardDto[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data: DoctorDto[]) => {
        const mappedDoctors: DoctorCardDto[] = data.slice(0, 4).map((dto) => ({
          id: dto.id,
          name: `Dr. ${dto.name} ${dto.lastname}`,
          specialty: dto.specialtyName || 'General Practice',
          rating: dto.averageRating,
          image:
            dto.imageUrl ||
            `https://ui-avatars.com/api/?name=${dto.name}+${dto.lastname}&background=random`,
        }));

        this.doctors.set(mappedDoctors);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading top doctors', err);
        this.isLoading.set(false);
      },
    });
  }
}
