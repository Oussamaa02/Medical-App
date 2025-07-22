import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorDto } from '../../../models/doctor-dto.model';
import { PatientService } from '../../services/patient.service';
import { GeocodingService } from '../../services/geocoding.service';
import { CommonModule } from '@angular/common';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';

@Component({
  selector: 'app-doctor-info',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
  imports: [CommonModule, LeafletMapComponent], 
  standalone: true
})
export class DoctorInfoComponent implements OnInit {
  doctorId!: number;
  doctor: DoctorDto | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  isGeocodingComplete: boolean = false;
  geocodingError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private geoService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.doctorId = +this.route.snapshot.paramMap.get('doctorId')!;
    this.loadDoctor();
  }

  loadDoctor() {
    this.loading = true;
    this.patientService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.loading = false;

        this.geocodeAddress();
      },
      error: (err) => {
        this.error = 'Failed to load doctor information';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private geocodeAddress(): void {
    if (!this.doctor?.location) return;

    const location = this.doctor.location;
    const fullAddress = `${location.address}, ${location.zipCode} ${location.city}`;

    this.geoService.getCoordinates(fullAddress).subscribe({
      next: (coordinates) => {
        if (coordinates.length > 0) {
          const coords = coordinates[0];
          
          this.doctor!.location.lat = coords.lat;
          this.doctor!.location.lon = coords.lon;
          
          this.isGeocodingComplete = true;
          console.log('Geocoding successful:', coords);
        } else {
          this.handleGeocodingError('No coordinates found for address');
        }
      },
      error: (err) => {
        this.handleGeocodingError('Geocoding service failed');
        console.error('Geocoding failed:', err);
      }
    });
  }

  private handleGeocodingError(message: string): void {
    
    console.warn(message);
    this.geocodingError = true;
    this.isGeocodingComplete = true;
    
    //  Set default coordinates (e.g., city center) as fallback
    if (this.doctor?.location) {
      this.doctor.location.lat = 0;
      this.doctor.location.lon = 0;
    }
  }
  

  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) return 'DR';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  }

  goBack(): void {
    this.router.navigate(['/doctors']);
  }

  sendMessage(): void {
    console.log('Message button clicked');
  }

  bookAppointment(): void {
    if (this.doctor) {
      this.router.navigate(['patient/booking', this.doctor.id]);
    }
  }
}