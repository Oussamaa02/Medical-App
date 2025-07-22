import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CalendarComponent } from "../../components/calendar/calendar.component";
import { CommonModule } from '@angular/common';
import { DoctorDto } from '../../../models/doctor-dto.model';

@Component({
  selector: 'app-rescheduling',
  templateUrl: './rescheduling.component.html',
  standalone: true,
  imports: [CalendarComponent, CommonModule],
})
export class ReschedulingComponent implements OnInit {
  doctors: DoctorDto[] = [];
  doctorId!: number;
appointmentId!: number;
  doctorName: string | null = null;
  selectedDate: string | null = null;
  selectedTime: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.doctorId = +this.route.snapshot.paramMap.get('doctorId')!;
    this.appointmentId = +this.route.snapshot.paramMap.get('appointmentId')!;
    this.patientService.findAvailableDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.setDoctorName();
    });
  }

  private setDoctorName(): void {
    const foundDoctor = this.doctors.find(doc => doc.id === this.doctorId);
    if (foundDoctor) {
      this.doctorName = `${foundDoctor.firstName} ${foundDoctor.lastName}`;
    } else {
      console.error(`No doctor found with ID: ${this.doctorId}`);
      this.doctorName = 'Unknown Doctor';
    }
  }

  onDateSelected(date: string): void {
    this.selectedDate = date || null;
  }

  onTimeSelected(time: string): void {
    this.selectedTime = time || null;
    console.log('Rescheduling component received time:', time); 
  }

  handleConfirm(event: { date: string; time: string }): void {
    this.selectedDate = event.date;
    this.selectedTime = event.time;
    
    this.patientService
      .rescheduleAppointment(this.appointmentId,this.doctorId, { startTime: event.time, date: event.date })
      .subscribe({
        next: () => this.router.navigate(['/patient/appointments']),
        error: err => alert('Rescheduling failed: ' + err.message)
      });
  }

}