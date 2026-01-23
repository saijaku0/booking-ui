import { Component } from '@angular/core';
import { DoctorCard, Doctor } from '../doctor-card/doctor-card';

@Component({
  selector: 'app-home',
  imports: [DoctorCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      rating: 4.9,
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 2,
      name: 'Dr. James Carter',
      specialty: 'Dermatologist',
      rating: 4.8,
      image: 'https://i.pravatar.cc/150?img=11',
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      specialty: 'Pediatrician',
      rating: 5.0,
      image: 'https://i.pravatar.cc/150?img=9',
    },
    {
      id: 4,
      name: 'Dr. Michael Brown',
      specialty: 'Neurologist',
      rating: 4.7,
      image: 'https://i.pravatar.cc/150?img=3',
    },
  ];
}
