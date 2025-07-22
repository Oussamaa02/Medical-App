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
      password: ['', Validators.required, Validators.minLength(6)],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
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
      password: ['', Validators.required, Validators.minLength(6)],
      phoneNumber: ['', Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      age: ['', [Validators.required, Validators.min(0), Validators.max(110)]],
      gender: ['', Validators.required],
    

    });
  }
  selectedRole: 'doctor' | 'patient' = 'patient'; 

  showNotification = false;
  showError = false;


  onSubmitDoctor(): void {
    if (this.doctorRegisterForm.invalid) {
      this.error = 'Please fill all required fields correctly.';
      this.doctorRegisterForm.markAllAsTouched(); 
      return;
    }

    const body = this.doctorRegisterForm.value;

    this.authService.registerDoctor({body}).subscribe({
      next: () => {this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 4000);
      },
      error: (err) => {
        if (err.status === 403 || err.error?.message?.includes('Email')) {
          this.showError = true;
          this.error = 'This email is already registered.';
          setTimeout(() => {
            this.showError = false;
          }, 4000)
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    });
    
  }

  onSubmitPatient(): void {
    if (this.patientRegisterForm.invalid) {
      this.error = 'Please fill all required fields correctly.';
      this.patientRegisterForm.markAllAsTouched();

      return;
    }
    const body = this.patientRegisterForm.value;

    this.authService.registerPatient({body}).subscribe({
      next: () => {this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 4000);},
        error: (err) => {
          if (err.status === 403 || err.error?.message?.includes('Email')) {
            this.showError = true;
            this.error = 'This email is already registered.';
            setTimeout(() => {
              this.showError = false;
            }, 4000)
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  
}
