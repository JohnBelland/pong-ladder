import { Component } from '@angular/core';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: firebase.User;
  //items: FirebaseListObservable<any[]>;
  //msgVal: string = '';

  constructor(//public afAuth: AngularFireAuth,
              //public af: AngularFireDatabase,
              private authService: AuthService,
              private router: Router) {
    // this.items = af.list('/messages', {
    //   query: {
    //     limitToLast: 50
    //   }
    // });

    // this.authService.authState().subscribe(s => {
    //   console.log(s);
    //   this.user = s;
    //   if (s){
    //     console.log('authenticated');
    //     this.router.navigate(['rankings']);
    //   } else {
    //     console.log('not authenticated');
    //     this.router.navigate(['login']);
    //   }
    // });

    this.authService.authState().subscribe(s => {
      this.user = s;
    });

    this.authService.authenticationSubscription().subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['rankings']);
        } else {
          this.router.navigate(['login']);
        }
      });
    }


    //this.user = this.authService.authState;

  // login() {
  //   console.log('I logged in');
  //   this.afAuth.auth.signInAnonymously();
  //
  //   console.log(this.user);
  // }

  // logout() {
  //   this.authService.logout();
  //   //this.afAuth.auth.signOut();
  //   //console.log(this.user);
  // }

  // Send(desc: string) {
  //   this.items.push({ message: desc});
  //   this.msgVal = '';
  // }
}
