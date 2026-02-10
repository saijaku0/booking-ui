import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDoctorRequest, DoctorDto } from '../../../core/models/doctor.model';
import { Doctor } from '../../../core/services/doctor';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Specialty } from '../../../core/services/specialty';
import { AuthService } from '../../../core/auth/auth';
import { SpecialtyDto } from '../../../core/models/specialty.model';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss',
})
export class Doctors implements OnInit {
  private doctorService = inject(Doctor);
  private specialtyService = inject(Specialty);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  doctors = signal<DoctorDto[]>([]);
  specialties = signal<SpecialtyDto[]>([]);

  isLoading = signal(false);
  isModalOpen = signal(false);

  doctorForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    specialtyId: ['', Validators.required],
  });

  ngOnInit() {
    this.loadDoctors();
    this.loadSpecialties();
  }

  loadDoctors() {
    this.isLoading.set(true);
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  loadSpecialties() {
    this.specialtyService.getAll().subscribe({
      next: (data) => this.specialties.set(data),
    });
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.doctorForm.reset();
  }

  onSubmit() {
    if (this.doctorForm.invalid) return;

    const formValue = this.doctorForm.value;

    const request: CreateDoctorRequest = {
      name: formValue.name,
      lastname: formValue.lastname,
      email: formValue.email,
      password: formValue.password,
      specialtyId: formValue.specialtyId,
      isActive: true,
    };

    this.doctorService.createDoctor(request).subscribe({
      next: () => {
        alert('Doctor created successfully!');
        this.closeModal();
        this.loadDoctors();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create doctor. Check console.');
      },
    });
  }

  // deleteDoctor(id: string) {
  //   if (confirm('Are you sure?')) {
  //     this.doctorService.delete(id).subscribe(() => this.loadDoctors());
  //   }
  // }
}
