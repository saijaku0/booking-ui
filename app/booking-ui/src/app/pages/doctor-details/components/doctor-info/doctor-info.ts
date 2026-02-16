import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DoctorResponse } from '@core/models/doctor.model';

@Component({
  selector: 'app-doctor-info',
  imports: [CommonModule],
  templateUrl: './doctor-info.html',
  styleUrl: './doctor-info.scss',
})
export class DoctorInfo {
  @Input({ required: true }) doctor!: DoctorResponse;
}
