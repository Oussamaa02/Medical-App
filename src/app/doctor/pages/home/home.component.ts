import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorDto } from '../../../models/doctor-dto.model';
import { DoctorAppointmentDto } from '../../../models/appointment-dto.model';
import { TimeSlotDto } from '../../../models/time-slot-dto.model';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html'
})
export class DoctorHomeComponent implements OnInit {
    appointments: DoctorAppointmentDto[] = [];
    timeSlots: TimeSlotDto[] = [];
  doctor?: DoctorDto;
  error: any;
  constructor(private router: Router,  private doctorService: DoctorService) {}

 
  ngOnInit(): void {
    this.doctorService.getDoctorProfile().subscribe({
      next: (data) => this.doctor = data,
      error: () => this.doctor = undefined
    });

    this.doctorService.getAppointments().subscribe({
      next: res => {
        this.appointments = res;
      },
      error: () => {
        this.error = 'Unable to load appointments';
      }
    });

    this.doctorService.getTimeSlots().subscribe({
      next: res => {
        this.timeSlots = res;
      },
      error: () => {
        this.error = 'Unable to load time slots';
      }
    });
  }

  navigateTo(slot: string) {
    this.router.navigate([`/doctor/${slot}`]);
  }

  getDoctorName(): string {
    return this.doctor ? `Dr. ${this.doctor.firstName}` : 'Doctor';
  }

  getTodayAppointments(): DoctorAppointmentDto[] {
    const today = new Date();
    return this.appointments.filter(appointment => {
      const appointmentStatus = appointment.status.toUpperCase();
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getDate() === today.getDate() &&
             appointmentDate.getMonth() === today.getMonth() &&
             appointmentDate.getFullYear() === today.getFullYear() &&
             (appointmentStatus === 'BOOKED' || appointmentStatus === 'RESCHEDULED');
    });
  }
}
