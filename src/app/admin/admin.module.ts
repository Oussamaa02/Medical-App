import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';


import { ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';

// Services

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { AdminComponent } from './admin.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule ,
    NavbarComponent,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

  ],
})
export class AdminModule { }