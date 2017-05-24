import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChallengesService {
  private challengesWon$ = new Subject<any[]>();
  private challengesLost$ = new Subject<any[]>();
  private challengesDeclined$ = new Subject<any[]>();
  private challengesPending$ = new Subject<any[]>();

  constructor(private af: AngularFireDatabase) {
    af.list('/challengeswon', {
      query: {
        limitToLast: 5,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesWon$.next(challenges);
    });
    af.list('/challengeslost', {
      query: {
        limitToLast: 5,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesLost$.next(challenges);
    });
    af.list('/challengesdeclined', {
      query: {
        limitToLast: 5,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesDeclined$.next(challenges);
    });
    af.list('/challenges', {
      query: {
        limitToLast: 5,
        orderByChild: 'challengeResponseDateTime'
      }
    }).subscribe(challenges => {
      this.challengesPending$.next(challenges);
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
}
