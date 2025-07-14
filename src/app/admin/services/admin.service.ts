import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phoneNumber: string;
  gender: string;
}

export interface Doctor {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  location: Location;
  licenseNumber: string;
  isValidated: boolean;
}
export interface Location {
  city: string;
  address: string;
  zipCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all patients from the backend
   */
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.API_URL}/patients`, { withCredentials: true });
  }

  /**
   * Fetch all doctors from the backend
   */
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.API_URL}/doctors`, { withCredentials: true });
  }

  /**
   * Trigger user validation (send confirmation email)
   * @param email User email to validate
   */
  validateUser(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/validate?email=${email}`, {}, { withCredentials: true });
  }

  removeUser(email: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/delete?email=${email}`, { withCredentials: true });
  }

}
