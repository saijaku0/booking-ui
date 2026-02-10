import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDoctorRequest, DoctorDto } from '../../../core/models/doctor.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SpecialtyDto } from '../../../core/models/specialty.model';
import { SpecialtyService } from '../../../core/services/specialty/specialty.service';
import { DoctorService } from '../../../core/services/doctor/doctor.service';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss',
})
export class Doctors implements OnInit {
  private doctorService = inject(DoctorService);
  private specialtyService = inject(SpecialtyService);
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
    consultationFee: [50, [Validators.required, Validators.min(1)]],
    experienceYears: [1, [Validators.required, Validators.min(0)]],
    bio: [''],
    imageUrl: [''],
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files === null) {
      console.error('file cannot be empty');
      return;
    }

    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large! Max size is 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setTimeout(() => {
        this.doctorForm.patchValue({
          imageUrl: reader.result as string,
        });
      }, 0);
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.doctorForm.patchValue({ imageUrl: null });
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
      consultationFee: Number(formValue.consultationFee),
      experienceYears: Number(formValue.experienceYears),
      bio: formValue.bio || null,
      imageUrl: formValue.imageUrl || null,
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

  deleteDoctor() {
    if (confirm('Are you sure?')) {
      // this.doctorService.delete(id).subscribe(() => this.loadDoctors());
    }
  }
}
