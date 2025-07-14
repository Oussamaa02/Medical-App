import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

interface Doctor {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  licenseNumber: string;
  location: Location;
  isValidated: boolean;
}
interface Location {
  city: string;
  address: string;
  zipCode: string;
}

@Component({
  selector: 'app-doctor-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-validation.component.html',
})
export class DoctorValidationComponent implements OnInit {
  doctors: Doctor[] = [];
  pendingMap: { [email: string]: boolean } = {}; 

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDoctors();
    const saved = localStorage.getItem('pendingMap');
    this.pendingMap = saved ? JSON.parse(saved) : {};
  }

  loadDoctors(): void {
    this.adminService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => console.error('Error fetching doctors:', err),
    });
  }



  validateDoctor(email: string): void {
    this.pendingMap[email] = true;
    localStorage.setItem('pendingMap', JSON.stringify(this.pendingMap));

    this.adminService.validateUser(email).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Validation failed:', err);
        this.pendingMap[email] = false;
      }
    });
  }
  
}
