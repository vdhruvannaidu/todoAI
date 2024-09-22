import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthserverService } from '../../core/service/auth/authserver.service';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthserverService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn(); // Implement this method in your service
    if (!isLoggedIn) {
      this.router.navigate(['/auth/login']); // Redirect to login
    }
    return isLoggedIn;
  }
}
