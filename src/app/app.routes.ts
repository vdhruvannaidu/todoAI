import { Routes } from '@angular/router';
// import LoginComponent from './features/auth/login/login.component'
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { authGuard } from './features/auth/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protect dashboard with the authGuard
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
];
