import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Brain, Clock, LucideAngularModule } from 'lucide-angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { ReactiveFormsModule } from '@angular/forms';


// import { AppointmentsComponent } from './pages/appointments/appointments.component';


// Services
import { AuthenticationControllerService } from './services/services/authentication-controller.service';
// import { AppointmentService } from './services/appointment.service';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
  ],
  imports: [
    NgChartsModule ,
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