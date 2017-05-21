import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Subject} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChallengesService {
  private challengesWon$ = new Subject<any[]>();
  private challengesLost$ = new Subject<any[]>();
  private challengesDeclined$ = new Subject<any[]>();

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    af.list('/challengeswon', {
      query: {
        limitToLast: 10,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesWon$.next(challenges);
    });
    af.list('/challengeslost', {
      query: {
        limitToLast: 10,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesLost$.next(challenges);
    });
    af.list('/challengesdeclined', {
      query: {
        limitToLast: 10,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesDeclined$.next(challenges);
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
}
