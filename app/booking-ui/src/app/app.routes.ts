import { Routes } from '@angular/router';
import { Home } from './home/home';
import { DoctorLayout } from './doctor/layout/doctor-layout/doctor-layout';
import { Dashboard } from './doctor/pages/dashboard/dashboard';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  {
    path: 'doctor',
    component: DoctorLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
    ],
  },

  { path: '**', redirectTo: '' },
];
