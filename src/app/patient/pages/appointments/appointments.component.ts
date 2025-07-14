// import { OnInit } from '@angular/core';
// import { Component } from '@angular/core';
// import { CalendarComponent } from '../../components/calendar/calendar.component';
// import { CommonModule } from '@angular/common'; // Needed for *ngIf, *ngFor, etc.
// import { Observable } from 'rxjs';
// import { Appointment } from '../../models/appointment.model';
// import { AppointmentService } from '../../services/appointment.service';
// import { SmartAssessmentComponent } from '../../components/smart-assessment/smart-assessment.component';

// @Component({
//   selector: 'app-appointments',
//   standalone: true,
//   imports: [CommonModule, CalendarComponent],
//   templateUrl: './appointments.component.html',
// //   styleUrls: ['./appointments.component.css']
// })
// export class AppointmentsComponent implements OnInit  {
//     appointments$: Observable<Appointment[]>;
//     reschedulingId: string | null = null;
  
//     constructor(private appointmentService: AppointmentService) {
//       this.appointments$ = this.appointmentService.appointments$;
//     }
  
//     ngOnInit(): void {}
  
//     handleCancel(id: string): void {
//       this.appointmentService.cancelAppointment(id);
//     }
  
//     handleRescheduleConfirm(event: {date: string, time: string}): void {
//       if (this.reschedulingId) {
//         this.appointmentService.rescheduleAppointment(
//           this.reschedulingId, 
//           event.date, 
//           event.time
//         );
//         this.reschedulingId = null;
//       }
//     }
  
//     setReschedulingId(id: string): void {
//       this.reschedulingId = id;
//     }
  
//     cancelReschedule(): void {
//       this.reschedulingId = null;
//     }
  
//     getStatusClass(status: string): string {
//       switch (status) {
//         case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
//         case 'CANCELLED': return 'bg-red-100 text-red-600';
//         case 'COMPLETED': return 'bg-green-100 text-green-700';
//         default: return 'bg-gray-100 text-gray-700';
//       }
//     }
// }
