import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth';
import { UserRole } from '../core/auth/auth.models';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Specialties {
  id: number;
  name: string;
  link: string;
}

const mokedSpecialties: Specialties[] = [
  { id: 1, name: 'Cardiology', link: '/specialties/cardiology' },
  { id: 2, name: 'Dermatology', link: '/specialties/dermatology' },
  { id: 3, name: 'Neurology', link: '/specialties/neurology' },
  { id: 4, name: 'Pediatrics', link: '/specialties/pediatrics' },
  { id: 5, name: 'Psychiatry', link: '/specialties/psychiatry' },
  { id: 6, name: 'Radiology', link: '/specialties/radiology' },
];

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuOpen = signal(false);
  isMobileMenu = signal(false);
  specialtiesOptions = signal<Specialties[]>(mokedSpecialties);

  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  crmLink = computed(() => {
    const user = this.currentUser();
    if (!user) return null;

    if (user.roles.includes(UserRole.Doctor)) return '/doctor';
    if (user.roles.includes(UserRole.Admin)) return '/admin';

    return null;
  });

  toggleMobileMenu() {
    this.isMobileMenu.update((v) => !v);
  }
  closeMobileNav() {
    this.isMobileMenu.set(false);
    this.menuOpen.set(false);
  }
  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.closeMobileNav();
  }
}
