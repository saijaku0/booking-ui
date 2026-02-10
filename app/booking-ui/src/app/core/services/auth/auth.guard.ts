import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const expectedRoles = route.data['roles'] as string[];

  if (expectedRoles && expectedRoles.length > 0) {
    const userRole = authService.currentUser()?.roles;

    if (userRole && userRole.some((role) => expectedRoles.includes(role))) {
      return true;
    } else {
      return router.createUrlTree(['/']);
    }
  }
  return true;
};
