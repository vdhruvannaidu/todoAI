import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
// import LoginComponent from './features/auth/login/login.component'
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { authGuard } from './features/auth/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
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
    path: '**', 
    redirectTo: '/auth/login' // Redirect any unknown paths to login
  }
];

export const appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
