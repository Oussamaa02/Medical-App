import { Component, OnInit } from '@angular/core';
import { AdminAppointmentDto } from '../../../models/appointment-dto.model';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './appointments.component.html'
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: AdminAppointmentDto[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllAppointments().subscribe({
      next: res => {
        this.appointments = res;
        this.loading = false;
      },
      error: () => {
        // this.error = 'Unable to load appointments';
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(dateString: string): string {
    // Implement your date formatting logic
    return new Date(dateString).toLocaleDateString();
  }
//   cancel(id: number) {
//     this.adminService.cancelAppointment(id).subscribe({
//       next: () => window.location.reload(),
//       error: () => alert('Could not cancel')
//     });
//   }
}
