import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationControllerService } from '../../../services/services/authentication-controller.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationRequest } from '../../../services/models/authentication-request';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;


  constructor(private fb: FormBuilder, private authService: AuthenticationControllerService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
  
    const body = this.loginForm.value;
  
    this.authService.authenticate({ body }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => this.error = err.error?.message || 'Login failed'
    });
  }
  

  navigateToSignup(): void {
    this.router.navigate(['/register']);
  }
}
