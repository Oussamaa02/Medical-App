import { Routes } from '@angular/router';
import { HomeComponent } from './patient/pages/home/home.component';
// import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DoctorValidationComponent } from './admin/pages/doctors/doctor-validation.component';
import { AdminComponent } from './admin/admin.component';
import { PatientValidationComponent } from './admin/pages/patients/patient-validation.component';
import { PatientComponent } from './patient/patient.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';

export const routes: Routes = [    
    { 
      path: 'admin',
      canActivate: [AuthGuard], 
      data: { expectedRole: 'ADMIN' }, 
      component: AdminComponent, 
      children: [
        { path: 'doctors', component: DoctorValidationComponent },
        {path: 'patients', component: PatientValidationComponent },
      ]
    },
    { 
      path: 'patient', 
      canActivate: [AuthGuard], 
      data: { expectedRole: 'PATIENT' }, 
      component: PatientComponent, 
      children: [
        { path: 'home', component: HomeComponent },
      ]
    },
    {
      path: 'access-denied',
      component: AccessDeniedComponent,  
    }, 
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];