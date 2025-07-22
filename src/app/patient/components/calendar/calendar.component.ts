import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PatientService } from '../../services/patient.service';
import { TimeSlotDto } from '../../../models/time-slot-dto.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
})
export class CalendarComponent implements OnInit {
  @Input() doctorId!: number;
  @Output() confirmEvent = new EventEmitter<{ date: string; time: string }>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<string>();
  @Output() timeSelected = new EventEmitter<string>();

  selectedDate: string | null = null;
  selectedTime: string | null = null;
  availableTimeSlots: TimeSlotDto[] = [];
  bookedTimes: string[] = [];
  error: string | null = null;
  loading = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    editable: false,
    dateClick: this.handleDateClick.bind(this),
    validRange: {
      start: new Date().toISOString().split('T')[0],
    }
  };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
  
    const booked$ = this.patientService.getBookedAppointments();
    const rescheduled$ = this.patientService.getRescheduledAppointments();
  
    forkJoin([booked$, rescheduled$]).subscribe({
      next: ([booked, rescheduled]) => {
        const all = [...booked, ...rescheduled];
        this.bookedTimes = all.map(a => `${a.date}T${a.time}`);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load booked appointments.';
        this.loading = false;
      }
    });
  }
  

  handleCancel(): void {
    this.cancelEvent.emit();
    this.selectedDate = null;
    this.selectedTime = null;
    this.dateSelected.emit('');
    this.timeSelected.emit('');
  }

  handleDateClick(arg: any): void {
    const today = new Date().toISOString().split('T')[0];
    if (arg.dateStr < today) return;

    this.selectedDate = arg.dateStr;
    this.selectedTime = null;
    
    this.dateSelected.emit(this.selectedDate || '');
    this.timeSelected.emit('');
    
    this.fetchAvailableTimes();
  }

  fetchAvailableTimes(): void {
    if (!this.selectedDate) return;

    this.loading = true;
    this.error = null;
    this.patientService.findDoctorAvailableTimes(this.doctorId, this.selectedDate).subscribe({
      next: slots => {
        this.availableTimeSlots = slots.sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load available time slots';
        this.loading = false;
      }
    });
  }
 

  selectTime(time: string): void {
    const key = `${this.selectedDate}T${time}`;
    if (!this.bookedTimes.includes(key)) {
      this.selectedTime = time;
      this.timeSelected.emit(time);
      console.log('Time selected:', time); 
    }
  }

  handleConfirm(): void {
    if (this.selectedDate && this.selectedTime) {
      this.confirmEvent.emit({ date: this.selectedDate, time: this.selectedTime });
    }
  }

  isTimeBooked(time: string): boolean {
    const key = `${this.selectedDate}T${time}`;
    return this.bookedTimes.includes(key);
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}