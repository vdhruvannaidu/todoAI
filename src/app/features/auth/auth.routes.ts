import { Routes } from "@angular/router";
export default [
    // {
    //     path: 'login',
    //     loadComponent: () => import('./login/login.component')
    // },
    // {
    //     path: 'register',
    //     loadComponent: () => import('./register/register.component')
    // },
    // {
    //     path: 'forgot-password',
    //     loadComponent: () => import('./forgot-password/forgot-password.component')
    // },
    // {
    //     path: 'reset-password',
    //     loadComponent: () => import('./reset-password/reset-password.component')
    // }

    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    }
] as Routes


