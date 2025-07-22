import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
})
export class AdminHomeComponent implements OnInit {
  doctorCount: number = 0;
  patientCount: number = 0;
  appointmentCount: number = 0;

  constructor(
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getAllDoctors().subscribe(doctors => {
      this.doctorCount = doctors.length;
    });

    this.adminService.getAllPatients().subscribe(patients => {
      this.patientCount = patients.length;
    });

    this.adminService.getAllAppointments().subscribe(appointments => {
      // Filter for today's appointments
      const today = new Date().toISOString().split('T')[0];
      this.appointmentCount = appointments.filter(a => 
        a.date.split('T')[0] === today
      ).length;
    });
  }

  navigateToDoctors(): void {
    this.router.navigate(['/admin/doctors']);
  }

  navigateToPatients(): void {
    this.router.navigate(['/admin/patients']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/admin/appointments']);
  }
}