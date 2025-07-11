import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, Observable, of, catchError } from 'rxjs';
import { AuthenticationControllerService } from '../../services/services/authentication-controller.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/custom-services/auth.service';
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean> = of(false);
  currentRoute: string = '';

  constructor(private authServiceCheck: AuthService, private router: Router, private auth : AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authServiceCheck.checkLoginStatus();
    this.currentRoute = this.router.url;
  }
    

  onLogout(): void {
    this.auth.logout().subscribe(() => {
      window.location.reload(); // Full refresh to clear state
    });
  }
  
  isActiveRoute(route: string): boolean {
    return this.currentRoute === route;
  }

getNavItemClass(route: string): string {
    return this.isActiveRoute(route)
      ? 'text-blue-600 font-bold'
      : 'text-black hover:text-blue-600';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }
}