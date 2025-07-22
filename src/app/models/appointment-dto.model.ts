import { DoctorDto } from "./doctor-dto.model";
import { Patient } from "./patient-dto";

export type Status = 'BOOKED' | 'CANCELED' | 'RESCHEDULED';

export interface DoctorAppointmentDto {
  id: number;          // Unique identifier for the appointment
  date: string;        // ISO date string, e.g., "2025-07-16"
  time: string;        // ISO time string, e.g., "10:00:00"
  patient: Patient;
  status: Status;
}

export interface PatientAppointmentDto {
  id: number;         
  date: string;        
  time: string;       
  doctor: DoctorDto;
  status: Status;
}

export interface AdminAppointmentDto {
  id: number;          
  date: string;       
  time: string;       
  patient: Patient;    
  doctor: DoctorDto;   
  status: Status;      
}