import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthserverService } from '../../core/service/auth/authserver.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserverService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn(); // Check login status

  if (!isLoggedIn) {
    router.navigate(['/auth/login'], {
      queryParams: { message: 'You are not logged in' }, // Optional toaster message
    });
    return false;
  }

  return true;
};
