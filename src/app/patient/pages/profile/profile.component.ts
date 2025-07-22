import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient-dto'
import { EditPatientProfile } from '../../../models/edit-profile';

@Component({
standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule],
})
export class PatientProfileComponent implements OnInit {
  patient: Patient | null = null;
  profileForm!: FormGroup;
  isEditing = false;
  

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.patientService.getPatientProfile().subscribe({
        next: res => {
            this.patient = res;
            this.profileForm.patchValue({
              firstName: res.firstName,
              lastName: res.lastName,
              // email: res.email,
              password: '', 
              phoneNumber: res.phoneNumber,
              age: res.age,
              gender: res.gender
            });
        },
        error: () => {
          // this.error = 'Unable to load appointments';
        }
      });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get userInitials(): string {
    if (!this.patient) return '';
    return `${this.patient.firstName.charAt(0)}${this.patient.lastName.charAt(0)}`.toUpperCase();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [ Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      // email: ['', [ Validators.email]],
      password: ['', [Validators.minLength(6)]],
      phoneNumber: ['', [ Validators.minLength(8), Validators.maxLength(8)]],
      age: ['', [ Validators.min(0), Validators.max(110)]],
      gender: ['']
    });
  }


  onSubmit(): void {
    const current = this.profileForm.value;
    const updatedFields: EditPatientProfile = {};
    let hasValidChanges = false;
  
    if (current.firstName && current.firstName !== this.patient?.firstName && this.profileForm.get('firstName')?.valid) {
      updatedFields.firstName = current.firstName;
      hasValidChanges = true;
    }
    
    if (current.lastName && current.lastName !== this.patient?.lastName && this.profileForm.get('lastName')?.valid) {
      updatedFields.lastName = current.lastName;
      hasValidChanges = true;
    }
    
    // if (current.email && current.email !== this.patient?.email && this.profileForm.get('email')?.valid) {
    //   updatedFields.email = current.email;
    //   hasValidChanges = true;
    // }
    
    if (current.password && this.profileForm.get('password')?.valid) {
      updatedFields.password = current.password;
      hasValidChanges = true;
    }
    
    if (current.phoneNumber && current.phoneNumber !== this.patient?.phoneNumber && this.profileForm.get('phoneNumber')?.valid) {
      updatedFields.phoneNumber = current.phoneNumber;
      hasValidChanges = true;
    }
    
    if (current.age && current.age !== this.patient?.age && this.profileForm.get('age')?.valid) {
      updatedFields.age = current.age;
      hasValidChanges = true;
    }
    
    if (current.gender && current.gender !== this.patient?.gender) {
      updatedFields.gender = current.gender;
      hasValidChanges = true;
    }
  
    if (!hasValidChanges) {
      console.log('No valid changes to submit');
      return;
    }
  
    this.patientService.editPatientProfile(updatedFields).subscribe({
      next: () => {
        window.location.reload(); 
        console.log('Profile updated successfully');
        if (this.patient) {
          Object.assign(this.patient, updatedFields);
        }
        
      },
      error: err => console.error('Failed to update profile', err)
    });
  }
  

  cancelEdit(): void {
    if (this.patient) {
      this.profileForm.reset();
    }
  }
}