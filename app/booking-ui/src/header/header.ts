import { Component, inject, signal } from '@angular/core';
import { BasicComponentInjection } from '../app/component-injection.service';

interface Specialties {
  id: number;
  name: string;
  link: string;
}

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuOpen = signal(false);
  specialtiesOptions = signal<Specialties[]>([
    { id: 1, name: 'Cardiology', link: '/specialties/cardiology' },
    { id: 2, name: 'Dermatology', link: '/specialties/dermatology' },
    { id: 3, name: 'Neurology', link: '/specialties/neurology' },
    { id: 4, name: 'Pediatrics', link: '/specialties/pediatrics' },
    { id: 5, name: 'Psychiatry', link: '/specialties/psychiatry' },
    { id: 6, name: 'Radiology', link: '/specialties/radiology' },
  ]);
  private componentInjection = inject(BasicComponentInjection);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }
}
