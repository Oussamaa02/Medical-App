import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [    
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent },
//   { path: 'appointments', component: AppointmentsComponent }
];
