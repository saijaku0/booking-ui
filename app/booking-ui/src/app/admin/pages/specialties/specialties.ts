import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialtyDto } from '../../../core/models/specialty.model';
import { SpecialtyService } from '../../../core/services/specialty/specialty.service';

@Component({
  selector: 'app-specialties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './specialties.html',
  styleUrl: './specialties.scss',
})
export class Specialties implements OnInit {
  private specialtyService = inject(SpecialtyService);

  specialties = signal<SpecialtyDto[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.isLoading.set(true);
    this.specialtyService.getAll().subscribe({
      next: (data) => {
        this.specialties.set(data);
        this.isLoading.set(false);
      },
      error: (err) => console.error(err),
    });
  }

  addSpecialty() {
    const name = prompt('Enter specialty name (e.g. Cardiologist):');
    if (name) {
      this.specialtyService.create(name).subscribe({
        next: () => this.loadSpecialties(),
        error: () => alert('Failed to create specialty'),
      });
    }
  }

  deleteSpecialty(id: string) {
    this.specialtyService.delete(id).subscribe({
      next: () => this.loadSpecialties(),
      error: () => alert('Error deleting specialty'),
    });
  }
}
