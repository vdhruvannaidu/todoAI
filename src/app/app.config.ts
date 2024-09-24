import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp, getApps, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideHttpClient(),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => {
      if (!getApps().length) {
        return initializeApp({"projectId":"ngtodoist","appId":"1:727288303659:web:48f04da02297b1b7ef5a6e","storageBucket":"ngtodoist.appspot.com","apiKey":"AIzaSyDpsnbNi15MnuqAwFc0fR2h5gEArTsIF_A","authDomain":"ngtodoist.firebaseapp.com","messagingSenderId":"727288303659","measurementId":"G-WRCRR86EE8"});
      } else {
        return getApp(); // Use the existing Firebase app
      }
    }),
      
      // initializeApp({"projectId":"ngtodoist","appId":"1:727288303659:web:48f04da02297b1b7ef5a6e","storageBucket":"ngtodoist.appspot.com","apiKey":"AIzaSyDpsnbNi15MnuqAwFc0fR2h5gEArTsIF_A","authDomain":"ngtodoist.firebaseapp.com","messagingSenderId":"727288303659","measurementId":"G-WRCRR86EE8"})), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideFunctions(() => getFunctions()), 
    provideMessaging(() => getMessaging()), 
    providePerformance(() => getPerformance()),
  ]
};