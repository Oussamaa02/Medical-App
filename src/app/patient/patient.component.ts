import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component'; 


@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './patient.component.html',
})
export class PatientComponent {
  constructor() {
    console.log('PatientComponent loaded');
  }
}
