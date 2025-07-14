import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Brain, Clock, LucideAngularModule } from 'lucide-angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './patient/pages/home/home.component';
// import { AppointmentsComponent } from './pages/appointments/appointments.component';


// Services
import { AuthenticationControllerService } from './services/services/authentication-controller.service';
// import { AppointmentService } from './services/appointment.service';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [
  ],
  imports: [
    MatSnackBarModule,
    RegisterComponent,
    LoginComponent,
    // AppointmentsComponent,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LucideAngularModule.pick({ Brain, Clock }),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationControllerService,
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // AppointmentService,
    // AuthGuard
  ],
//   bootstrap: [AppComponent]
})
export class AppModule { }