import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AuthService} from "./auth.service";

@Injectable()
export class ChallengesService implements OnDestroy {
  private challengesWon$ = new Subject<any[]>();
  private challengesLost$ = new Subject<any[]>();
  private challengesDeclined$ = new Subject<any[]>();
  private challengesPending$ = new Subject<any[]>();
  private subscriptions: any[] = [];

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    authService.authState().subscribe(user => {
      if (user) {
        console.log(user);
        this.subscriptions.push(af.list('/challengeswon', {
          query: {
            limitToLast: 5,
            orderByChild: 'challengeResponseDateTime'
          }
        }).subscribe(challenges => {
          this.challengesWon$.next(challenges);
        }));

        this.subscriptions.push(af.list('/challengeslost', {
          query: {
            limitToLast: 5,
            orderByChild: 'challengeResponseDateTime'
          }
        }).subscribe(challenges => {
          this.challengesLost$.next(challenges);
        }));

        this.subscriptions.push(af.list('/challengesdeclined', {
          query: {
            limitToLast: 5,
            orderByChild: 'challengeResponseDateTime'
          }
        }).subscribe(challenges => {
          this.challengesDeclined$.next(challenges);
        }));

        this.subscriptions.push(af.list('/challenges', {
          query: {
            limitToLast: 5,
            orderByChild: 'challengeResponseDateTime'
          }
        }).subscribe(challenges => {
          this.challengesPending$.next(challenges);
        }));
      }
    });
  }

  getChallengesWon(): Observable<any[]> {
    return this.challengesWon$.asObservable();
  }

  getChallengesLost(): Observable<any[]> {
    return this.challengesLost$.asObservable();
  }

  getChallengesDeclined(): Observable<any[]> {
    return this.challengesDeclined$.asObservable();
  }

  getChallengesPending(): Observable<any[]> {
    return this.challengesPending$.asObservable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
