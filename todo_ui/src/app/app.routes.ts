import { Routes } from '@angular/router';
// import LoginComponent from './features/auth/login/login.component'
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './features/auth/auth.guard';
export const routes: Routes = [  
    // {
    //   path: "",
    //   component: LoginComponent
    // },
    // {
    //     path: 'auth',
    //     loadChildren: () => import("./features/auth/auth.routes"),
    // },
    // {
    //     path: 'task',
    //     loadChildren: () => import("./features/auth/auth.routes"),
    // },
    // { 
    //     path: 'dashboard', 
    //     component: DashboardComponent, 
    //     canActivate: [AuthGuard]
    // }
    {
        path: "",
        redirectTo: '/auth/login',
        pathMatch: 'full'
      },
      {
          path: 'auth',
          loadChildren: () => import("./features/auth/auth.routes").then(m => m.default)
      },
    //   {
    //       path: 'task',
    //       loadChildren: () => import("./features/task/task.routes").then(m => m.default),
    //       canActivate: [AuthGuard]
    //   },
      { 
          path: 'dashboard', 
          component: DashboardComponent, 
          canActivate: [AuthGuard]
      }
];
