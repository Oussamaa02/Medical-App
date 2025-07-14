import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/custom-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.checkAuthStatus().pipe(
      map(user => {
        const expectedRole = route.data['expectedRole'];
        
        if (user.role !== expectedRole) {
          this.router.navigate(['/access-denied']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}