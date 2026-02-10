import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserRole } from '@core/models/auth.model';
import { SpecialtyDto } from '@core/models/specialty.model';
import { AuthService, SpecialtyService } from '@core/services/index';
import { Component, computed, inject, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  menuOpen = signal(false);
  isMobileMenu = signal(false);
  specialtyService = inject(SpecialtyService);

  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  specialties = signal<SpecialtyDto[]>([]);

  navLinks = signal([
    { path: '/', label: 'Home' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/contact', label: 'Contact' },
  ]);

  crmLink = computed(() => {
    const user = this.currentUser();
    if (!user) return null;

    if (user.roles.includes(UserRole.Doctor)) return '/doctor';
    if (user.roles.includes(UserRole.Admin)) return '/admin';

    return null;
  });

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.specialtyService.getAll().subscribe({
      next: (data) => {
        this.specialties.set(data.slice(0, 10));
      },
      error: (err) => console.error('Failed to load menu specialties', err),
    });
  }

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
