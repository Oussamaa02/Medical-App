import { Component } from '@angular/core';
import { Calendar } from 'lucide-angular';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CalendarComponent,CommonModule],
})
export class HomeComponent {
  
  handleConfirm(event: {date: string, time: string}): void {
    console.log('Confirmed appointment on', event.date, 'at', event.time);
  }

  handleCancel(): void {
    console.log('Cancelled appointment');
  }

}