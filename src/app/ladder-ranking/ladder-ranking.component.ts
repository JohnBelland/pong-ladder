import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AuthService} from '../providers/auth.service';
import * as firebase from 'firebase/app';
import {SlackService} from '../providers/slack.service';

@Component({
  selector: 'app-ladder-ranking',
  templateUrl: './ladder-ranking.component.html',
  styleUrls: ['./ladder-ranking.component.css']
})
export class LadderRankingComponent implements OnInit {
  players$: FirebaseListObservable<any[]>;
  players: any[];
  challenges$: FirebaseListObservable<any[]>;
  challenges: any[];
  user: firebase.User;
  currentPlayer: any;

  constructor(private af: AngularFireDatabase, private authService: AuthService, private slackService: SlackService) {
    this.players$ = af.list('/players', {query: {limitToLast: 100, orderByChild: 'rank'}});
    this.challenges$ = af.list('/challenges', {query: {limitToLast: 1000}});
  }

  ngOnInit() {
    this.challenges$.subscribe(challenges => {
      this.challenges = challenges;
      this.players$.subscribe(players => {
        this.players = players;
        this.authService.authState().subscribe(user => {
          this.user = user;
          this.players.forEach(player => {
            if (player && user && player.uid === user.uid) {
              player.isLoggedInUser = true;
              this.currentPlayer = player;
              this.players.forEach(p => {
                p.isChallenged = this.isChallenged(p);
                p.canChallenge = this.canChallenge(p);
              });
            }
          });
        });
      });
    });
  }

  canChallenge(player: any) {
    return (player.rank < this.currentPlayer.rank) && !this.isChallenged(player);
  }

  isChallenged(player: any) {
    let isChallenged = false;
    this.challenges.forEach(challenge => {
      if (challenge.challengerPlayerId === this.currentPlayer.$key && challenge.defenderPlayerId === player.$key) {
        isChallenged = true;
      }
    });
    return isChallenged;
  }

  challenge(player: any) {
    if (!this.isChallenged(player)) {
      this.challenges$.push({
        challengeRequestDateTime: Date.now(),
        challengeResponseDateTime: Date.now(),
        challengerPlayerId: this.currentPlayer.$key,
        challengerDisplayName: this.currentPlayer.displayName,
        challengerRank: this.currentPlayer.rank,
        defenderPlayerId: player.$key,
        defenderDisplayName: player.displayName,
        defenderRank: player.rank
      });
      player.isChallenged = true;
      player.canChallenge = false;
      const message = '#' + this.currentPlayer.rank + ' ' + this.currentPlayer.displayName + ' Challenged #' + player.rank + ' ' + player.displayName + ' to a match';
      this.slackService.addToSlackMessageQueue({ channel: 'usonly', message: message });
    }
  }

}
