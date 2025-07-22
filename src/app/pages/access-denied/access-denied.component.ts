import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/custom-services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-access-denied',
  standalone: true,
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent {
  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {}

  goBack(): void {
  
      this.authService.checkAuthStatus().subscribe({
        next: (user) => {
          switch (user.role) {
            case 'ADMIN':
              this.router.navigate(['/admin/doctors']);
              break;
            case 'DOCTOR':
              this.router.navigate(['/doctor/home']);
              break;
            case 'PATIENT':
              this.router.navigate(['/patient/home']);
              break;
            default:
              this.router.navigate(['/login']);
              break;
          }
        },
        error: () => this.router.navigate(['/login'])
      });
    }
  }

