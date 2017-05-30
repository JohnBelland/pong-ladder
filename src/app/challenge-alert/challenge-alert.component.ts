import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from '../providers/auth.service';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import { Observable } from 'rxjs';
import { SlackService } from '../providers/slack.service';

@Component({
  selector: 'app-challenge-alert',
  templateUrl: './challenge-alert.component.html',
  styleUrls: ['challenge-alert.component.css']
})
export class ChallengeAlertComponent implements OnInit, OnDestroy {
  user: firebase.User;
  currentPlayer: any;
  players$: FirebaseListObservable<any[]>;
  challenges$: FirebaseListObservable<any[]>;
  challengesDeclined$: FirebaseListObservable<any[]>;
  challengesWon$: FirebaseListObservable<any[]>;
  challengesLost$: FirebaseListObservable<any[]>;
  authServiceSub: any;
  playersSub: any;
  sub: any;

  constructor(private authService: AuthService, private af: AngularFireDatabase, private slackService: SlackService) {
  }

  ngOnInit() {
    this.players$ = this.af.list('/players', {query: {limitToLast: 1000}});
    this.challengesWon$ = this.af.list('/challengeswon', {query: {limitToLast: 1000}});
    this.challengesLost$ = this.af.list('/challengeslost', {query: {limitToLast: 1000}});
    this.challengesDeclined$ = this.af.list('/challengesdeclined', {query: {limitToLast: 1000}});

    this.authServiceSub = this.authService.authState().subscribe(user => {
      this.playersSub = this.players$.subscribe(players => {
        players.forEach(player => {
          if (player && user && player.uid === user.uid) {
            this.currentPlayer = player;
            this.challenges$ = this.af.list('/challenges', {
              query: {
                limitToLast: 1000,
                orderByChild: 'defenderPlayerId',
                equalTo: this.currentPlayer.$key
              }
            });
          }
        });
      });
    });
  }

  challengeDeclined(challenge: any, key: string) {
    // remove and save to challengesDeclined
    challenge.challengeResponseDateTime = Date.now();
    this.challengesDeclined$.push(challenge);
    this.challenges$.remove(key);
    const message = '#' + challenge.defenderRank + ' ' + challenge.defenderDisplayName + ' declined #' + challenge.challengerRank + ' ' + challenge.challengerDisplayName + 's challenge';
    this.slackService.addToSlackMessageQueue({ channel: 'usonly', message: message });
  }

  challengeWon(challenge: any, key: string) {
    // remove and save to challengesLost
    challenge.challengeResponseDateTime = Date.now();
    this.challengesLost$.push(challenge);
    this.challenges$.remove(key);
    const message = '#' + challenge.defenderRank + ' ' + challenge.defenderDisplayName + ' defeated challenger #' + challenge.challengerRank + ' ' + challenge.challengerDisplayName;
    this.slackService.addToSlackMessageQueue({ channel: 'usonly', message: message });
  }

  challengeLost(challenge: any, key: string) {
    let playersUpdated = false;
    const challengerPlayer$ = this.af.object(`/players/${challenge.challengerPlayerId}`);
    const defenderPlayer$ = this.af.object(`/players/${challenge.defenderPlayerId}`);

    this.sub = Observable.zip(
      defenderPlayer$,
      challengerPlayer$
    ).takeWhile(() => !playersUpdated)
      .subscribe(res => {
      challengerPlayer$.update({rank: res[0].rank});
      defenderPlayer$.update({rank: res[1].rank});
      playersUpdated = true;
    });

    // remove and save to challengesWon
    challenge.challengeResponseDateTime = Date.now();
    this.challengesWon$.push(challenge);
    this.challenges$.remove(key);
    const message = 'TITlE CHANGED!!! #' + challenge.defenderRank + ' ' + challenge.defenderDisplayName + ' LOST to #' + challenge.challengerRank + ' ' + challenge.challengerDisplayName;
    this.slackService.addToSlackMessageQueue({ channel: 'usonly', message: message });
  }

  ngOnDestroy() {
    this.authServiceSub.unsubscribe();
    this.playersSub.unsubscribe();
  }
}
