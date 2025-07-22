import { Routes } from '@angular/router';
import { BookingComponent } from './patient/pages/booking/booking.component';
import { DoctorHomeComponent } from './doctor/pages/home/home.component';
// import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DoctorValidationComponent } from './admin/pages/doctors/doctor-validation.component';
import { AdminComponent } from './admin/admin.component';
import { PatientValidationComponent } from './admin/pages/patients/patient-validation.component';
import { PatientComponent } from './patient/patient.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { DoctorAppointmentsComponent } from './doctor/pages/appointments/appointments.component';
import { DoctorTimeslotsComponent } from './doctor/pages/timeSlots/timeSlots.component';
import { AppointmentsComponent } from './patient/pages/appointments/appointments.component';
import { PatientHomeComponent } from './patient/pages/home/home.component';
import { AdminAppointmentsComponent } from './admin/pages/appointments/appointments.component';
import { PatientProfileComponent } from './patient/pages/profile/profile.component';
import { DoctorProfileComponent } from './doctor/pages/profile/profile.component';
import { PatientAboutComponent } from './patient/pages/about/about.component';
import { ReschedulingComponent } from './patient/pages/rescheduling/rescheduling.component';
import { DoctorInfoComponent } from './patient/pages/doctor-profile/doctor-profile.component';
import { AdminProfileComponent } from './admin/pages/profile/profile.component';
import { AdminHomeComponent } from './admin/pages/home/home.component';
import { DoctorStatsComponent } from './doctor/pages/stats/stats.component';

export const routes: Routes = [   
    { 
      path: 'admin',
      canActivate: [AuthGuard], 
      data: { expectedRole: 'ADMIN' }, 
      component: AdminComponent, 
      children: [
        { path: 'home', component: AdminHomeComponent },
        { path: 'doctors', component: DoctorValidationComponent },
        {path: 'patients', component: PatientValidationComponent },
        { path: 'appointments', component: AdminAppointmentsComponent },
        { path: 'profile', component:AdminProfileComponent  },
      ]
    },
    { 
      path: 'patient', 
      canActivate: [AuthGuard], 
      data: { expectedRole: 'PATIENT' }, 
      component: PatientComponent, 
      children: [
        { path: 'home', component: PatientHomeComponent },
        { path: 'booking/:doctorId', component: BookingComponent }, 
        { path: 'rescheduling/:doctorId/:appointmentId', component: ReschedulingComponent },
        { path: 'appointments', component: AppointmentsComponent },
        { path: 'profile', component: PatientProfileComponent },
        { path: 'about', component: PatientAboutComponent },
        { path: 'doctor/:doctorId', component: DoctorInfoComponent },
      ]
    },
    { 
      path: 'doctor', 
      canActivate: [AuthGuard], 
      data: { expectedRole: 'DOCTOR' }, 
      component: DoctorComponent, 
      children: [
        { path: 'home', component: DoctorHomeComponent },
        { path: 'appointments', component: DoctorAppointmentsComponent },
        {path: 'time-slots', component: DoctorTimeslotsComponent }, 
        { path: 'profile', component: DoctorProfileComponent },
        { path: 'stats', component: DoctorStatsComponent }, 
      ]
    },
    {
      path: 'access-denied',
      component: AccessDeniedComponent,  
    }, 
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];