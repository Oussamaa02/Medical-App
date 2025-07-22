import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component'; 


@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './doctor.component.html',
})
export class DoctorComponent {
  constructor() {
    console.log('DoctorComponent loaded');
  }
}
