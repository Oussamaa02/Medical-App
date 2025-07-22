import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient-dto';
import { Doctor } from '../../models/doctor-dto';
import { AdminAppointmentDto } from '../../models/appointment-dto.model';
import { EditAdminProfile } from '../../models/edit-profile';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getAdminProfile(): Observable<EditAdminProfile> {
      return this.http.get<EditAdminProfile>(`${this.API_URL}/info`, { withCredentials: true });
    }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.API_URL}/patients`, { withCredentials: true });
  }

  getAllAppointments(): Observable<AdminAppointmentDto[]> {
    return this.http.get<AdminAppointmentDto[]>(`${this.API_URL}/appointments`, { withCredentials: true });
  }

  
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.API_URL}/doctors`, { withCredentials: true });
  }

  /**
   * Trigger user validation (send confirmation email)
   * @param email User email to validate
   */
  validateDoctor(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/validate?email=${email}`, {}, { withCredentials: true });
  }

  removeDoctor(email: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/remove-doctor?email=${email}`, { withCredentials: true });
  }

  removePatient(email: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/remove-patient?email=${email}`, { withCredentials: true });
  }

  editAdminProfile(payload: EditAdminProfile): Observable<any> {
    return this.http.put(`${this.API_URL}/profile`, payload, { withCredentials: true ,responseType: 'text'});
  }

}

