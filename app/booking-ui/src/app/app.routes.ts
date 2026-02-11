import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/services/auth/auth.guard';
import { RegisterComponent } from './pages/register/register';
import { Dashboard } from './doctor/pages/dashboard/dashboard';
import { DoctorsComponent } from './admin/pages/doctors/doctors';
import { DoctorDetails } from './pages/doctor-details/doctor-details';
import { AdminLayout } from './admin/layout/admin-layout/admin-layout';
import { DoctorLayout } from './doctor/layout/doctor-layout/doctor-layout';
import { SpecialtiesComponent } from './admin/pages/specialties/specialties';
import { AdminDashboard } from './admin/pages/admin-dashboard/admin-dashboard';
import { DoctorCalendarComponent } from './doctor/pages/doctor-calendar/doctor-calendar';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: 'doctors/:id', component: DoctorDetails },
  {
    path: 'doctor',
    component: DoctorLayout,
    canActivate: [authGuard],
    data: { roles: ['doctor'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'calendar', component: DoctorCalendarComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'specialties', component: SpecialtiesComponent },
      { path: 'doctors', component: DoctorsComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
