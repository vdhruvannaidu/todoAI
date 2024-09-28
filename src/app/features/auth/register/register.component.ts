import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthserverService } from '../../../core/service/auth/authserver.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  private _auth = inject(AuthserverService);
  private _router = inject(Router);
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      const { username, email, password } = this.registerForm.value;

      // Register the user with email and password using the service
      const userCredential = await this._auth.register({ username, email, password });

      const user = userCredential.user;
      const token = await user.getIdToken();

      // Store the JWT token in localStorage
      localStorage.setItem('authToken', token);

      // Navigate to the dashboard after successful registration
      toast.success('Registration successful');
      this._router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    }
  }

  // Google Sign-In
  async googleLogin() {
    try {
      const userCredential = await this._auth.googleLogin();

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token);
      toast.success('Google login successful');
      this._router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error during Google login:', error);
      toast.error('Google login failed: ' + error.message);
    }
  }

  // Anonymous Sign-In
  async anonymousLogin() {
    try {
      const userCredential = await this._auth.anonymousLogin();

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token);
      toast.success('Logged in anonymously');
      this._router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error during anonymous login:', error);
      toast.error('Anonymous login failed: ' + error.message);
    }
  }

  // Utility for error handling in the template
  get f() {
    return this.registerForm.controls;
  }
}
