import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  checkLoginStatus(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/auth/status`, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      map(res => res.status === 200)
    );
  }

  registerPatient(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register/patient`, data, {
      withCredentials: true
    });
  }
  
  logout() {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  login(credentials: { email: string, password: string }) {
    return this.http.post(`${this.baseUrl}/auth/authenticate`, credentials, {
      withCredentials: true
    });
  }}
