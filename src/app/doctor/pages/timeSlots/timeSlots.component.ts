import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { TimeSlotDto } from '../../../models/time-slot-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-timeslots',
  standalone: true,
    imports: [CommonModule,FormsModule],
  templateUrl: './timeslots.component.html'
})
export class DoctorTimeslotsComponent implements OnInit {
  slots: TimeSlotDto[] = [];
  newTime = '';
  loading = true;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.reload();
  }
  
  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  }

  reload() {
    this.loading = true;
    this.doctorService.getTimeSlots().subscribe({
      next: data => {
        this.slots = data.sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        });
        this.loading = false;
      },
      error: () => {
        // this.error = 'Failed to load slots';
        this.loading = false;
      }
    });
  }

  add() {
    if (!this.newTime) return;
    this.doctorService.addTimeSlot(this.newTime).subscribe({
      next: () => { this.newTime = ''; this.reload(); },
      error: () => alert('Could not add slot')
    });
  }

  remove(startTime: string) {
    this.doctorService.deleteTimeSlot(startTime).subscribe({
      next: () => this.reload(),
      error: () => alert('Could not remove slot')
    });
  }
}
