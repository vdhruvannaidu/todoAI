import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { log } from 'node:console';
import { AuthserverService } from '../../../core/service/auth/authserver.service';
import { toast } from 'ngx-sonner';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { signInAnonymously } from '@angular/fire/auth';

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
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // async onSubmit() {
  //   console.log(this.registerForm);

  //   if (this.registerForm.invalid) {
  //     this.registerForm.markAllAsTouched(); // Shows errors on all fields
  //     return;
  //   }

  //   try {
  //     const { username, email, password } = this.registerForm.value;
  //     await this._auth.register({ username, email, password });
  //     toast.success('Registration successful');
  //   } catch (error: any) {
  //     // Log the error to the console for debugging
  //     console.error('Error during registration:', error);

  //     // Check if it's a Firebase error with a specific structure
  //     if (error.error && error.error.message) {
  //       // Handle specific Firebase error messages like "EMAIL_EXISTS"
  //       switch (error.error.message) {
  //         case 'EMAIL_EXISTS':
  //           toast.error('This email is already registered.');
  //           break;
  //         case 'INVALID_PASSWORD':
  //           toast.error('The password is incorrect.');
  //           break;
  //         // Add more cases as needed
  //         default:
  //           toast.error('An error occurred: ' + error.error.message);
  //       }
  //     } else {
  //       // Handle any other error
  //       toast.error(error.message || 'An unexpected error occurred.');
  //     }
  //   }

  //   console.log(this.registerForm.value); // Handle registration logic here
  // }

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

      localStorage.setItem('authToken', token); // Store the JWT token
      toast.success('Registration successful');
    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    }
  }

  // Google Sign-In
  async googleLogin() {
    try {
      const userCredential = await this._auth.googleLogin(); // Call googleLogin from service

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token); // Store the JWT token
      toast.success('Google login successful');
    } catch (error: any) {
      console.error('Error during Google login:', error);
      toast.error('Google login failed: ' + error.message);
    }
  }

  // Anonymous Sign-In
  async anonymousLogin() {
    try {
      const userCredential = await this._auth.anonymousLogin(); // Call anonymousLogin from service

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token); // Store the JWT token
      toast.success('Logged in anonymously');
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
