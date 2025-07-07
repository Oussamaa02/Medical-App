import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationControllerService } from '../../../services/services/authentication-controller.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  doctorRegisterForm: FormGroup;
  patientRegisterForm: FormGroup;

  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationControllerService, private router: Router) {
    this.doctorRegisterForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      speciality: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required]
    });

    this.patientRegisterForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }
  selectedRole: 'doctor' | 'patient' = 'patient'; 

  onSubmitDoctor(): void {
    if (this.doctorRegisterForm.invalid) return;

    const body = this.doctorRegisterForm.value;

    this.authService.registerDoctor(body).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.error?.message || 'Registration failed'
    });
  }

  onSubmitPatient(): void {
    if (this.patientRegisterForm.invalid) return;

    const body = this.patientRegisterForm.value;

    this.authService.registerPatient(body).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.error?.message || 'Registration failed'
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  
}
