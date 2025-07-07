import { Component, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
    standalone: true,
  selector: 'app-smart-assessment',
  templateUrl: './smart-assessment.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   styleUrls: ['./smart-assessment.component.css']
})
export class SmartAssessmentComponent {
  @Output() cancelEvent = new EventEmitter<void>();

  onCancel(): void {
    this.cancelEvent.emit();
  }

  onStart(): void {
    // Implement smart assessment logic
    console.log('Starting smart assessment');
  }
}