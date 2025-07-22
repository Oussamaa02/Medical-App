import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationControllerService } from '../../../services/services/authentication-controller.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationRequest } from '../../../services/models/authentication-request';
import { AuthService } from '../../../services/custom-services/auth.service';
import { switchMap, tap, catchError, of } from 'rxjs';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    this.error = null;
    
    const credentials = this.loginForm.value;

    this.authService.login(credentials).pipe(
      switchMap(() => this.authService.checkAuthStatus()),
      tap((user) => {
        this.redirectBasedOnRole(user.role);
      }),
      catchError((err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Login failed. Please check your credentials.';
        return of(null);
      })
    ).subscribe();
  }

  private redirectBasedOnRole(role: string): void {
    this.isLoading = false;
    
    switch(role) {
      case 'ADMIN':
        window.location.href = '/admin/doctors';
        break;
      case 'DOCTOR':
        window.location.href = '/doctor/home';
        break;
      case 'PATIENT':
        window.location.href = '/patient/home';
        break;
      default:
        this.authService.logout().subscribe(() => {
          this.router.navigate(['/login']);
          this.error = 'Your account is not properly configured. Please contact support.';
        });
    }
  }

  // this.authService.login( body ).subscribe({
  //   next: () => window.location.href = '/',
  //   error: (err) => this.error = err.error?.message || 'Login failed'
  // });

  navigateToSignup(): void {
    this.router.navigate(['/register']);
  }
}