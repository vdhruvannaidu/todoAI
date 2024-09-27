import { Routes } from '@angular/router';
// import LoginComponent from './features/auth/login/login.component'
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './features/auth/auth.guard';
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.default),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
];
