import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map, Observable, of, catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/custom-services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean> = of(false);

  constructor(private authServiceCheck: AuthService, private router: Router, private auth : AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authServiceCheck.checkLoginStatus();
   
  }

  onLogout(): void {
    this.auth.logout().subscribe(() => {
      window.location.href = '/login';
    });
  }
  
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToDoctors(): void {
    this.router.navigate(['/admin/doctors']); 
  }

  navigateToPatients(): void {
    this.router.navigate(['/admin/patients']);
  }
  
  navigateToAppointments(): void {
    this.router.navigate(['/admin/appointments']); 
  }

  navigateToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  navigateToHome(): void {
    this.router.navigate(['/admin/home']);
  }
}