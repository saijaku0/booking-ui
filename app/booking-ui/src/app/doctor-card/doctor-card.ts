import { Component, Input } from '@angular/core';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

@Component({
  selector: 'app-doctor-card',
  imports: [],
  templateUrl: './doctor-card.html',
  styleUrl: './doctor-card.scss',
})
export class DoctorCard {
  @Input({ required: true }) doctor!: Doctor;
}
