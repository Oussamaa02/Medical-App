import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

interface Patient {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phoneNumber: string;
  gender: string;
}

@Component({
      imports:[CommonModule],
  standalone: true,
  selector: 'app-patient-validation',
  templateUrl: './patient-validation.component.html',
})
export class PatientValidationComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.adminService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => console.error('Error fetching patients:', err)
    });
  }

  removePatient(email: string): void {
    this.adminService.removePatient(email).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => console.error('Cannot delete patient', err)
    });
  }

}
