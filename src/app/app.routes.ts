import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
// import { noAuthGuard } from './core/guards/no-auth.guard';
export const routes: Routes = [

  {
    path: '', 
    pathMatch: 'full', 
    canActivate: [authGuard], // Protect root route
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) // Lazy load dashboard component
  },
  {
    path: 'dashboard',
    canActivate: [authGuard], // Protect dashboard route
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'auth/login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '**', 
    redirectTo: '/auth/login' // Redirect any unknown paths to login
  }
];

export const appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
