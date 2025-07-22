import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../../models/doctor-dto'
import { EditDoctorProfile } from '../../../models/edit-profile';

@Component({
standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule],
})
export class DoctorProfileComponent implements OnInit {
  doctor: EditDoctorProfile | null = null;
  profileForm!: FormGroup;
  isEditing = false;
  

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.doctorService.getDoctorProfile().subscribe({
        next: res => {
            this.doctor = res;
            this.profileForm.patchValue({
              firstName: res.firstName,
              lastName: res.lastName,
              // email: res.email,
              password: '', 
              phoneNumber: res.phoneNumber,
              licenseNumber: res.licenseNumber,
              speciality: res.speciality,
              address: res.location.address,
              city: res.location.city,
              zipCode: res.location.zipCode
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
    if (!this.doctor) return '';
    return `${this.doctor?.firstName?.charAt(0) ?? ''}${this.doctor?.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [ Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      // email: ['', [ Validators.email]],
      password: ['', [Validators.minLength(6)]],
      phoneNumber: ['', [ Validators.minLength(8), Validators.maxLength(8)]],
      licenseNumber: ['', [ Validators.maxLength(20)]],
      speciality: ['', [ Validators.maxLength(50)]],
      address: ['', [ Validators.maxLength(100)]],
      city: ['', [ Validators.maxLength(50)]],
      zipCode: ['', [ Validators.maxLength(4)]]
    });
  }


  onSubmit(): void {
    const current = this.profileForm.value;
    const updatedFields: EditDoctorProfile = {};
    let hasValidChanges = false;
  
    if (current.firstName && current.firstName !== this.doctor?.firstName && this.profileForm.get('firstName')?.valid) {
      updatedFields.firstName = current.firstName;
      hasValidChanges = true;
    }
    
    if (current.lastName && current.lastName !== this.doctor?.lastName && this.profileForm.get('lastName')?.valid) {
      updatedFields.lastName = current.lastName;
      hasValidChanges = true;
    }
    
    // if (current.email && current.email !== this.doctor?.email && this.profileForm.get('email')?.valid) {
    //   updatedFields.email = current.email;
    //   hasValidChanges = true;
    // }
    
    if (current.password && this.profileForm.get('password')?.valid) {
      updatedFields.password = current.password;
      hasValidChanges = true;
    }
    
    if (current.phoneNumber && current.phoneNumber !== this.doctor?.phoneNumber && this.profileForm.get('phoneNumber')?.valid) {
      updatedFields.phoneNumber = current.phoneNumber;
      hasValidChanges = true;
    }
    
    if (current.licenseNumber && current.licenseNumber !== this.doctor?.licenseNumber && this.profileForm.get('licenseNumber')?.valid) {
      updatedFields.licenseNumber = current.licenseNumber;
      hasValidChanges = true;
    }
    
    if (current.speciality && current.speciality !== this.doctor?.speciality && this.profileForm.get('speciality')?.valid) {
      updatedFields.speciality = current.speciality;
      hasValidChanges = true;
    }

    if (current.address && current.address !== this.doctor?.address && this.profileForm.get('address')?.valid) {
      updatedFields.address = current.address;
      hasValidChanges = true;
    }

    if (current.city && current.city !== this.doctor?.city && this.profileForm.get('city')?.valid) {
      updatedFields.city = current.city;
      hasValidChanges = true;
    }

    if (current.zipCode && current.zipCode !== this.doctor?.zipCode && this.profileForm.get('zipCode')?.valid) {
      updatedFields.zipCode = current.zipCode;
      hasValidChanges = true;
    }
  
    if (!hasValidChanges) {
      console.log('No valid changes to submit');
      return;
    }
  
    this.doctorService.editDoctorProfile(updatedFields).subscribe({
      next: () => {
        window.location.reload(); 
        console.log('Profile updated successfully');
        if (this.doctor) {
          Object.assign(this.doctor, updatedFields);
        }
        
      },
      error: err => console.error('Failed to update profile', err)
    });
  }
  

  cancelEdit(): void {
    if (this.doctor) {
      this.profileForm.reset();
    }
  }
}