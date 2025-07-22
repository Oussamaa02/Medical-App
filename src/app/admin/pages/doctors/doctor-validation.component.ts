import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../../models/doctor-dto';



@Component({
  selector: 'app-doctor-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-validation.component.html',
})
export class DoctorValidationComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDoctors();
    
  }

  loadDoctors(): void {
    this.adminService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => console.error('Error fetching doctors:', err),
    });
  }

  removeDoctor(email: string): void {
    this.adminService.removeDoctor(email).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => console.error('Error removing doctor:', err),
    });
  }

  validateDoctor(email: string): void {
    this.adminService.validateDoctor(email).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Validation failed:', err);
      }
    });
  }
  
}
