import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserverService } from '../../../core/service/auth/authserver.service';
import { FirebaseError } from '@firebase/util'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);

      // Get the JWT token after successful login
      const token = await this.authService.getToken();
      console.log('JWT Token:', token);

      // Store token in localStorage if needed
      if (token) {
        localStorage.setItem('authToken', token);
      }

      // Update user details in Firestore if required
      await this.authService.updateUserDetails(email);

      // Redirect to the dashboard after successful login
      this.router.navigate(['/dashboard']);
      toast.success('Login successful');
    } catch (error: any) {
      // Firebase-specific error handling

        console.error('Error during login:', error); // Log the error for   debugging
        toast.error('Login failed. ' + error.message);
      // if (error instanceof FirebaseError) {
      //   switch (error.code) {
      //     case 'auth/user-not-found':
      //       toast.error('No user found with this email. Please register.');
      //       break;
      //     case 'auth/wrong-password':
      //       toast.error('Incorrect password. Please try again.');
      //       break;
      //     case 'auth/too-many-requests':
      //       toast.error('Too many failed login attempts. Try again later.');
      //       break;
      //     default:
      //       toast.error(`Login failed: ${error.message || 'Unknown error occurred'}`);
      //   }
      // } else {
      //   // Handle other errors
      //   console.error(error);
      //   toast.error('An unexpected error occurred.');
      // }
    }
  }

  async googleLogin() {
    try {
      const userCredential = await this.authService.googleLogin();
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token);
      toast.success('Google login successful');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error during Google login:', error);
      toast.error('Google login failed: ' + error.message);
    }
  }

  async anonymousLogin() {
    try {
      const userCredential = await this.authService.anonymousLogin();
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('authToken', token);
      toast.success('Logged in anonymously');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error during anonymous login:', error);
      toast.error('Anonymous login failed: ' + error.message);
    }
  }
}
