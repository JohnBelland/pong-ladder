// import { Injectable } from '@angular/core';
// import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
// @Injectable()
// export class AuthService {
//   constructor(public af: AngularFire) { }
//   loginWithGoogle() {
//     return this.af.auth.login({
//       provider: AuthProviders.Google,
//       method: AuthMethods.Popup
//     });
//   }
//   logout() {
//     return this.af.auth.logout();
//   }
// }


import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { Subject } from 'rxjs';
@Injectable()
export class AuthService {
  private isAuthenticated = new Subject<boolean>();
  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(s => {
      if (s) {
        this.isAuthenticated.next(true);
      }
      else {
        this.isAuthenticated.next(false);
      }
    });
  }

  loginWithEmailPassword(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    return this.afAuth.auth.signOut();
  }
  authState() {
    return this.afAuth.authState;
  }

  authenticationSubscription() {
    return this.isAuthenticated.asObservable();
  }



}
