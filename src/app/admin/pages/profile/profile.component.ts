import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { EditAdminProfile } from '../../../models/edit-profile';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/custom-services/auth.service';

@Component({
standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule],
})
export class AdminProfileComponent implements OnInit {
  admin: EditAdminProfile | null = null;
  profileForm!: FormGroup;
  isEditing = false;
  

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.adminService.getAdminProfile().subscribe({
        next: res => {
            this.admin = res;
            this.profileForm.patchValue({
              email: res.email,
              password: ''
            });
        },
        error: () => {
          // this.error = 'Unable to load appointments';
        }
      });
  }


  private initializeForm(): void {
    this.profileForm = this.fb.group({
      email: ['', [ Validators.email]],
      password: ['', [Validators.minLength(5)]],
    });
  }

  onSubmit(): void {
    const current = this.profileForm.value;
    const updatedFields: EditAdminProfile = {};
    let hasValidChanges = false;
  
    if (current.email && current.email !== this.admin?.email && this.profileForm.get('email')?.valid) {
      updatedFields.email = current.email;
      hasValidChanges = true;
    }
    
    if (current.password && this.profileForm.get('password')?.valid) {
      updatedFields.password = current.password;
      hasValidChanges = true;
    }
  
    if (!hasValidChanges) {
      console.log('No valid changes to submit');
      return;
    }
  
    this.adminService.editAdminProfile(updatedFields).subscribe({
      next: () => {
        
 
        console.log('Profile updated successfully');
        if (this.admin) {
          Object.assign(this.admin, updatedFields);
        }
        this.auth.logout().subscribe(() => {
          window.location.href = '/login';
        });      },
      error: err => console.error('Failed to update profile', err)
    });
  }
  

  cancelEdit(): void {
    if (this.admin) {
      this.profileForm.reset();
    }
  }
}