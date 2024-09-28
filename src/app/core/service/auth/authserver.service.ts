import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore'; // Firestore imports
import { Router } from '@angular/router';
import { FirebaseError } from '@firebase/util'; // Firebase error handling
import { User as FirebaseUser } from 'firebase/auth'; // Firebase user type

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
  private firestore = inject(Firestore); // Inject Firestore
  private router = inject(Router);

  constructor() {}

  // Register a new user and save their data in Firestore
  async register(user: User) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      
      // After successful registration, store user data in Firestore
      await this.saveUserData(userCredential.user, user.username);
      
      return userCredential;
    } catch (error) {
      this.handleFirebaseErrors(error);
      throw error;
    }
  }

  // Google login and store user data in Firestore
  async googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);

      // Save user data to Firestore
      await this.saveUserData(userCredential.user, userCredential.user.displayName || 'Unknown');
      
      return userCredential;
    } catch (error) {
      this.handleFirebaseErrors(error);
      throw error;
    }
  }

  // Anonymous login and store user data in Firestore
  async anonymousLogin() {
    try {
      const userCredential = await signInAnonymously(this.auth);

      // Save anonymous user data in Firestore
      await this.saveUserData(userCredential.user, 'Anonymous');
      
      return userCredential;
    } catch (error) {
      this.handleFirebaseErrors(error);
      throw error;
    }
  }

  // Standard email login with Firestore user data update
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Optionally update user data in Firestore after login
      await this.updateUserDetails(userCredential.user);
      
    } catch (error) {
      this.handleFirebaseErrors(error);
      throw error;
    }
  }

  // Save user data to Firestore
  private async saveUserData(firebaseUser: FirebaseUser, username: string) {
    const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    
    // Check if the user document already exists to avoid overwriting
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: username,
        createdAt: new Date(),
      });
    }
  }

  // Update user details in Firestore after login (if needed)
  async updateUserDetails(firebaseUser: FirebaseUser) {
    const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // You can update any specific fields here if needed
      await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });
    } else {
      // If user doc doesn't exist, create it (for new users)
      await this.saveUserData(firebaseUser, firebaseUser.email || 'Unknown');
    }
  }

  // Firebase error handler
  private handleFirebaseErrors(error: any) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No user found with this email.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password.');
        case 'auth/email-already-in-use':
          throw new Error('Email is already registered.');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later.');
        default:
          throw new Error('An error occurred. Please try again.');
      }
    } else {
      console.error('An unknown error occurred:', error);
      throw new Error('An unexpected error occurred.');
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          user.getIdToken(true)
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
