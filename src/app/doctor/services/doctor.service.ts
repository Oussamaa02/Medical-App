import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeSlotDto } from '../../models/time-slot-dto.model';
import { DoctorDto } from '../../models/doctor-dto.model';
import { DoctorAppointmentDto } from '../../models/appointment-dto.model';
import { EditDoctorProfile } from '../../models/edit-profile';

const BASE_URL = 'http://localhost:8080/doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  getDoctorProfile(): Observable<DoctorDto> {
    return this.http.get<DoctorDto>(`${BASE_URL}/info`, { withCredentials: true });
  }

  getAppointments(): Observable<DoctorAppointmentDto[]> {
    return this.http.get<DoctorAppointmentDto[]>(`${BASE_URL}/appointments`, { withCredentials: true });
  }

  getTimeSlots(): Observable<TimeSlotDto[]> {
    return this.http.get<TimeSlotDto[]>(`${BASE_URL}/availability`, { withCredentials: true });
  }

  addTimeSlot(startTime: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/availability`, JSON.stringify(startTime), {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteTimeSlot(startTime: string): Observable<void> {
    return this.http.request<void>('delete', `${BASE_URL}/availability`, {
      body: JSON.stringify(startTime),
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/appointments/${appointmentId}`, {}, {
      withCredentials: true,
    });
  }

  editDoctorProfile(payload: EditDoctorProfile) :Observable<any>{
      return this.http.put(`${BASE_URL}/profile`, payload, { withCredentials: true,  responseType: 'text'
      });
    }
}
