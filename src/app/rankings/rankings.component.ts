import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import * as firebase from 'firebase/app';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['rankings.component.css']
})
export class RankingsComponent implements OnInit {
  displayName: string;
  players$: FirebaseListObservable<any[]>;
  players: any[];
  challenges$: FirebaseListObservable<any[]>;
  challenges: any[];
  newPlayerRank: number;
  showJoinDialog: boolean;
  user: firebase.User;
  currentPlayer: any;

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    this.newPlayerRank = 1;
    this.showJoinDialog = true;

    this.players$ = af.list('/players', {query: {limitToLast: 100, orderByChild: 'rank'}});
    this.challenges$ = af.list('/challenges', { query: { limitToLast: 1000 } });
  }

  ngOnInit() {
    this.challenges$.subscribe(challenges => this.challenges = challenges);

    //if user is not yet a player show join dialog
    this.players$.subscribe(players => {
      this.players = players;
      this.newPlayerRank = players.length + 1;
      this.authService.authState().subscribe(user => {
        this.user = user;
        this.players.forEach(player => {
          if (player && user && player.uid === user.uid) {
            player.isLoggedInUser = true;
            this.currentPlayer = player;
            this.showJoinDialog = false;
            this.players.forEach(player => {
              player.isChallenged = this.isChallenged(player);
              player.canChallenge = this.canChallenge(player);
            });
          }
        });
      });
    });
  }

  join() {
    this.players$.push({
      uid: this.user.uid,
      displayName: this.displayName,
      email: this.user.email,
      rank: this.newPlayerRank
    });
  }

  canChallenge(player: any) {
    return (player.rank < this.currentPlayer.rank) && !this.isChallenged(player);
  }

  isChallenged(player: any) {
    let isChallenged = false;
    this.challenges.forEach(challenge => {
      console.log('hit challenges loop');
      if (challenge.challengerPlayerId === this.currentPlayer.$key && challenge.defenderPlayerId === player.$key) {
        isChallenged = true;
        console.log('already challenged');
      }
    });
    return isChallenged;
  }

  challenge(player: any) {
    if (!this.isChallenged(player)) {
      this.challenges$.push({
        challengeRequestDateTime: Date.now(),
        challengerPlayerId: this.currentPlayer.$key,
        challengerDisplayName: this.currentPlayer.displayName,
        challengerRank: this.currentPlayer.rank,
        defenderPlayerId: player.$key,
        defenderDisplayName: player.displayName,
        defenderRank: player.rank
      });
      player.isChallenged = true;
      player.canChallenge = false;
    }
  }
}
