import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlayerService implements OnDestroy {
  private loggedInPlayer$ = new Subject<any>();
  private authSub: any;
  private playersSub: any;

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    this.authSub = authService.authState().subscribe(user => {
      this.playersSub = af.list('/players', {query: {limitToLast: 100, orderByChild: 'uid', equalTo: user.uid}}).subscribe(players => {
        this.loggedInPlayer$.next(players[0]);
      });
    });
  }

  getLoggedInPlayer(): Observable<any> {
    return this.loggedInPlayer$.asObservable();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.playersSub.unsubscribe();
  }
}
