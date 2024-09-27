import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserverService } from '../../core/service/auth/authserver.service';

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthserverService);
  const router = inject(Router);
  
  const isLoggedIn = authService.isLoggedIn(); // Check if the user is logged in

  if (await isLoggedIn) {
    // If the user is logged in, redirect to the dashboard
    router.navigate(['/dashboard']);
    return false; // Prevent access to login/register pages
  }

  // Allow access to login/register pages if the user is not logged in
  return true;
};


