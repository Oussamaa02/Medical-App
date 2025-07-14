import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DoctorValidationComponent } from './admin/pages/doctors/doctor-validation.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent, // 👈 contains <app-navbar> + <router-outlet>
    children: [
      { path: 'doctors', component: DoctorValidationComponent },
      // ...other admin routes
    ],
  },
  
    
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    
  
];
