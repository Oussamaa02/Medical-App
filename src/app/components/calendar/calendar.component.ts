import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// import { AppointmentService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SmartAssessmentComponent } from '../smart-assessment/smart-assessment.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, SmartAssessmentComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

//⚠️ after adding the appointment services make it export class CalendarComponent implements OnInit 
export class CalendarComponent {
  @Input() onConfirm!: (date: string, time: string) => void;
  @Input() onCancel?: () => void;
  @Output() confirmEvent = new EventEmitter<{date: string, time: string}>();
  @Output() cancelEvent = new EventEmitter<void>();

  selectedDate: string | null = null;
  selectedTime: string | null = null;
  showSmartAssessment = false;
  bookedTimes: string[] = [];

  availableTimeSlots = [
    "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    editable: false,
    dateClick: this.handleDateClick.bind(this),
    events: '/api/calendar/slots',
    validRange: {
      start: new Date().toISOString().split('T')[0]
    }
  };

  // constructor(private appointmentService: AppointmentService) {}

  // ngOnInit(): void {
  //   this.fetchBookedTimes();
  // }

  // async fetchBookedTimes(): Promise<void> {
  //   try {
  //     this.appointmentService.getCalendarSlots().subscribe(events => {
  //       this.bookedTimes = events.map(event => 
  //         event.start.split('T')[1].slice(0, 5)
  //       );
  //     });
  //   } catch (error) {
  //     console.error('Error fetching booked times:', error);
  //   }
  // }

  handleDateClick(arg: any): void {
    const today = new Date().toISOString().split('T')[0];
    if (arg.dateStr < today) return;
    
    this.selectedDate = arg.dateStr;
    this.selectedTime = null;
  }

  selectTime(time: string): void {
    if (!this.bookedTimes.includes(time)) {
      this.selectedTime = time;
    }
  }

  handleConfirm(): void {
    if (this.selectedDate && this.selectedTime) {
      const fullDateTime = `${this.selectedDate}T${this.selectedTime}:00`;
      console.log('Booking appointment at:', fullDateTime);
      
      this.confirmEvent.emit({
        date: this.selectedDate,
        time: this.selectedTime
      });
      
      this.selectedDate = null;
      this.selectedTime = null;
      this.showSmartAssessment = true;
    }
  }

  handleCancel(): void {
    this.cancelEvent.emit();
    this.selectedDate = null;
  }

  isTimeBooked(time: string): boolean {
    return this.bookedTimes.includes(time);
  }

  isTimeSelected(time: string): boolean {
    return this.selectedTime === time;
  }
}