import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { DoctorDto } from '../../../models/doctor-dto.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-patient-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, FormsModule],
})
export class PatientHomeComponent implements OnInit {
  doctors: DoctorDto[] = [];
  filteredDoctors: DoctorDto[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';
  showFilters: boolean = false;
  
  // Filter variables
  selectedSpecialty: string = '';
  selectedLocation: string = '';
  
  // Updated data for filters
  specialties: string[] = [
    'Dentist',
    'Orthodontist',
    'Radiologist',
    'Psychiatrist',
    'Physiatrist',
    'Pediatrician',
    'Gynecologist',
    'Neurologist',
    'Dermatologist',
    'Cardiologist',
    'General Practitioner',
    'Plastic Surgeon',
    'General Surgeon'
  ];

  locations: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir', 
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.loading = true;
    this.patientService.findAvailableDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = [...doctors];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load doctors';
        this.loading = false;
      }
    });
  }

  searchDoctors(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let results = [...this.doctors];
    
    // Apply search query filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      results = results.filter(doctor => 
        doctor.firstName.toLowerCase().includes(query) ||
        doctor.lastName.toLowerCase().includes(query) ||
        doctor.speciality.toLowerCase().includes(query) ||
        doctor.location.city.toLowerCase().includes(query)
      );
    }
    
    // Apply specialty filter
    if (this.selectedSpecialty) {
      results = results.filter(doctor => 
        doctor.speciality === this.selectedSpecialty
      );
    }
    
    // Apply location filter
    if (this.selectedLocation) {
      results = results.filter(doctor => 
        doctor.location.city === this.selectedLocation
      );
    }
    
    this.filteredDoctors = results;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.selectedSpecialty = '';
    this.selectedLocation = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  bookAppointment(doctorId: number): void {
    this.router.navigate(['patient/booking', doctorId]);
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  viewProfile(doctorId: number): void {
    this.router.navigate(['patient/doctor', doctorId]);
  }
}