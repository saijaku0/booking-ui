import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DoctorCardDto {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-card.html',
  styleUrl: './doctor-card.scss',
})
export class DoctorCard {
  @Input({ required: true }) doctor!: DoctorCardDto;
}
