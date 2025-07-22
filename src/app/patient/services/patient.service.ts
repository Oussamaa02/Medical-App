import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientAppointmentDto } from '../../models/appointment-dto.model';
import { TimeSlotDto } from '../../models/time-slot-dto.model';
import { DoctorDto } from '../../models/doctor-dto.model';
import { BookAppointmentRequest } from '../../models/book-appointment-request.model';
import { EditPatientProfile } from '../../models/edit-profile';
import { Patient } from '../../models/patient-dto';

const BASE_URL = 'http://localhost:8080/patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}

  getPatientProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${BASE_URL}/info`, { withCredentials: true });
  }

  getDoctorById(id: number): Observable<DoctorDto> {
    return this.http.get<DoctorDto>(`${BASE_URL}/doctor/${id}`, { withCredentials: true });
  }

  findAvailableDoctors(): Observable<DoctorDto[]> {
    return this.http.get<DoctorDto[]>(`${BASE_URL}/doctors`, { withCredentials: true });
  }

  findDoctorAvailableTimes(doctorId: number, date: string): Observable<TimeSlotDto[]> {
    return this.http.get<TimeSlotDto[]>(`${BASE_URL}/doctors/${doctorId}?date=${encodeURIComponent(date)}`, {
      withCredentials: true,
    });
  }

  getAllAppointments(): Observable<PatientAppointmentDto[]> {
    return this.http.get<PatientAppointmentDto[]>(`${BASE_URL}/appointments`, { withCredentials: true });
  }

  getBookedAppointments(): Observable<PatientAppointmentDto[]> {
    return this.http.get<PatientAppointmentDto[]>(`${BASE_URL}/appointments/booked`, { withCredentials: true });
  }

  getCanceledAppointments(): Observable<PatientAppointmentDto[]> {
    return this.http.get<PatientAppointmentDto[]>(`${BASE_URL}/appointments/canceled`, { withCredentials: true });
  }

  getRescheduledAppointments(): Observable<PatientAppointmentDto[]> {
    return this.http.get<PatientAppointmentDto[]>(`${BASE_URL}/appointments/rescheduled`, { withCredentials: true });
  }

  bookAppointment(doctorId: number, payload: BookAppointmentRequest): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/doctors/${doctorId}`, payload, {
      withCredentials: true,
    });
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/appointments/${appointmentId}/cancel`, {}, {
      withCredentials: true,
    });
  }

  rescheduleAppointment(
    appointmentId: number,
    doctorId: number,
    payload: BookAppointmentRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${BASE_URL}/appointments/${appointmentId}/reschedule?doctorId=${doctorId}`,
      payload,
      { withCredentials: true }
    );
  }

  editPatientProfile(payload: EditPatientProfile) :Observable<any>{
    return this.http.put(`${BASE_URL}/profile`, payload, { withCredentials: true,  responseType: 'text'
    });
  }

  
}
