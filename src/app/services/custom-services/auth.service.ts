import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<any>(null);
  

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

  login(credentials: {email: string, password: string}): Observable<void> {
    return this.http.post(`${this.baseUrl}/auth/authenticate`, credentials, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap(() => this.checkAuthStatus().subscribe()),
      map(() => undefined)
    );
  }

  checkAuthStatus(): Observable<{email: string, role: string}> {
    return this.http.get<{email: string, role: string}>(`${this.baseUrl}/auth/status`, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return throwError(() => new Error('Not authenticated'));
      })
    );
  }

  getCurrentUser(): Observable<{email: string, role: string} | null> {
    return this.currentUserSubject.asObservable();
  }

}

