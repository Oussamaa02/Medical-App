import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthenticationControllerService } from '../../services/services/authentication-controller.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // ✅ Import this


@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
    imports: [CommonModule] // ✅ Add CommonModule to imports
})
export class NavbarComponent implements OnInit {
  currentRoute: string = '';
  isLoggedIn$: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthenticationControllerService
  ) {
    this.isLoggedIn$ = this.authService.authenticate$Response({body: {}})
  .pipe(map(response => !!response));
    
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  
    this.currentRoute = this.router.url;
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route;
  }

  getNavItemClass(route: string): string {
    return this.isActiveRoute(route) 
      ? 'text-blue-600 font-bold' 
      : 'text-black hover:text-blue-600';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
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