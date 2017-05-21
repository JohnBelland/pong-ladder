import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Subject} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlayerService {
  private loggedInPlayer$ = new Subject<any>();

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    authService.authState().subscribe(user => {
      af.list('/players', {query: {limitToLast: 100, orderByChild: 'uid', equalTo: user.uid}}).subscribe(players => {
        this.loggedInPlayer$.next(players[0]);
      });
    });
  }

  getLoggedInPlayer(): Observable<any> {
    return this.loggedInPlayer$.asObservable();
  }
}
