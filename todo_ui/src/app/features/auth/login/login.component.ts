import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserverService } from '../../../core/service/auth/authserver.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export  class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthserverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password)
    .then(async () => {
      // Get the JWT token after successful login
      const token = await this.authService.getToken();
      console.log('JWT Token:', token); // You can store it or use it as needed

      // Redirect to the dashboard after successful login
      this.router.navigate(['/dashboard']);
    })
    .catch((error) => {
      console.error(error);
      toast.error('Login failed. Please check your credentials.');
    });

  }
  async googleLogin() {
    try {
      const userCredential = await this.authService.googleLogin(); // Call googleLogin from service

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
      const userCredential = await this.authService.anonymousLogin(); // Call anonymousLogin from service

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token); // Store the JWT token
      toast.success('Logged in anonymously');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error during anonymous login:', error);
      toast.error('Anonymous login failed: ' + error.message);
    }
  }
}
