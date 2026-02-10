import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminLayout } from './admin/layout/admin-layout/admin-layout';
import { Specialties } from './admin/pages/specialties/specialties';
import { authGuard } from './core/services/auth/auth.guard';
import { Doctors } from './admin/pages/doctors/doctors';
import { AdminDashboard } from './admin/pages/admin-dashboard/admin-dashboard';
import { RegisterComponent } from './pages/register/register';
import { DoctorDetails } from './pages/doctor-details/doctor-details';
import { Home } from './pages/home/home';
import { DoctorLayout } from './doctor/layout/doctor-layout/doctor-layout';
import { Dashboard } from './doctor/pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'doctors/:id', component: DoctorDetails },
  {
    path: 'doctor',
    component: DoctorLayout,
    canActivate: [authGuard],
    data: { roles: ['doctor'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
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
      { path: 'specialties', component: Specialties },
      { path: 'doctors', component: Doctors },
    ],
  },
  { path: '**', redirectTo: '' },
];
