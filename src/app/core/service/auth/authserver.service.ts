import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

export interface User {
  username: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthserverService {
  private auth = inject(Auth);
  private router = inject(Router);
  constructor() {}

  register(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  anonymousLogin() {
    return signInAnonymously(this.auth);
  }

  async isLoggedIn(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          user
            .getIdToken(true)
            .then((token) => {
              localStorage.setItem('authToken', token);
              resolve(true);
            })
            .catch(() => {
              this.logout();
              resolve(false);
            });
        } else {
          this.logout();
          resolve(false);
        }
      });
    });
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  logout() {
    return this.auth.signOut().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
