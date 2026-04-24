import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole();

    if (authService.isLoggedIn() && userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Rediriger vers dashboard approprié si mauvais rôle
    if (userRole === 'client') {
      router.navigate(['/client/dashboard']);
    } else if (userRole === 'freelance') {
      router.navigate(['/freelance/dashboard']);
    } else {
      router.navigate(['/login']);
    }

    return false;
  };
};