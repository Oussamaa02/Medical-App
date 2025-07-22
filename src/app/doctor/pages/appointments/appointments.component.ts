import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { DoctorAppointmentDto } from '../../../models/appointment-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
    imports: [CommonModule,FormsModule],
  templateUrl: './appointments.component.html'
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: DoctorAppointmentDto[] = [];
  filteredAppointments: DoctorAppointmentDto[] = [];
  loading = true;
  error = '';
  statusFilter: string = 'ALL'; // Default to show all appointments
  statusOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'BOOKED', label: 'Booked' },
    { value: 'RESCHEDULED', label: 'Rescheduled' },
    { value: 'CANCELED', label: 'Canceled' }
  ];

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.doctorService.getAppointments().subscribe({
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(dateString: string): string {
    // Implement your date formatting logic
    return new Date(dateString).toLocaleDateString();
  }
  cancel(id: number) {
    this.doctorService.cancelAppointment(id).subscribe({
      next: () => window.location.reload(),
      error: () => alert('Could not cancel')
    });
  }
}
