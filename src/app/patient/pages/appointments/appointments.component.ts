import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { PatientAppointmentDto } from '../../../models/appointment-dto.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: PatientAppointmentDto[] = [];
  filteredAppointments: PatientAppointmentDto[] = [];
  error: string | null = null;
  loading = false;
  statusFilter: string = 'ALL'; // Default to show all appointments
  statusOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'BOOKED', label: 'Booked' },
    { value: 'RESCHEDULED', label: 'Rescheduled' },
    { value: 'CANCELED', label: 'Canceled' }
  ];

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.patientService.getAllAppointments().subscribe({
      next: (res) => {
        this.appointments = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load appointments.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    if (this.statusFilter === 'ALL') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(
        appt => appt.status.toUpperCase() === this.statusFilter
      );
    }
  }

  onFilterChange() {
    this.applyFilter();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  formatTime(timeStr: string): string {
    const [hour, minute] = timeStr.split(':');
    return `${hour}:${minute}`;
  }

  cancelAppointment(id: number) {
    this.patientService.cancelAppointment(id).subscribe({
      next: () => window.location.reload(),
      error: () => alert('Could not cancel')
    });
  }  
  
  rescheduleAppointment(appointmentId: number, doctorId: number):void {
    this.router.navigate(['patient/rescheduling', doctorId, appointmentId]);
  }


  getStatusClasses(status: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch(status.toUpperCase()) {
      case 'BOOKED':
        return `${base} bg-green-100 text-green-800`;
      case 'CANCELED':
        return `${base} bg-red-100 text-red-800`;
      case 'RESCHEDULED':
        return `${base} bg-blue-100 text-blue-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/patient/home']); 
  }
  
  canCancel(status: string): boolean {
    return ['BOOKED', 'RESCHEDULED'].includes(status.toUpperCase());
  }
  
  canReschedule(status: string): boolean {
    return ['BOOKED', 'RESCHEDULED'].includes(status.toUpperCase());
  }
}