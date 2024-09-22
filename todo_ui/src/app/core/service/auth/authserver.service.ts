import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, user } from '@angular/fire/auth';


export interface User{
  username:string,
  email: string,
  password:string,

}
@Injectable({
  providedIn: 'root'
})
export class AuthserverService {
  private auth = inject(Auth)
  constructor() { }


  register(user:User){
    return createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    )
  }

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider); // Sign in with Google
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // Optionally handle any post-login actions here
    } catch (error) {
      throw error; // Rethrow the error for handling in the component
    }
  }

  // Anonymous sign-in method
  anonymousLogin() {
    return signInAnonymously(this.auth); // Sign in anonymously
  }
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken(); // Return the JWT token if the user is logged in
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser; // Check if the user is logged in
  }

  logout() {
    // Implement your logout logic here
  }
}
