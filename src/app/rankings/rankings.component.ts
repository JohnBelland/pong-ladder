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
  showJoinDialog: boolean;
  user: firebase.User;
  newPlayerRank: number;

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    this.showJoinDialog = true;
    this.newPlayerRank = 1;
    this.players$ = af.list('/players', {query: {limitToLast: 100, orderByChild: 'rank'}});
  }

  ngOnInit() {
    // if user is not yet a player show join dialog
    this.players$.subscribe(players => {
      this.newPlayerRank = players.length + 1;
      this.authService.authState().subscribe(user => {
        this.user = user;
        players.forEach(player => {
          if (player && user && player.uid === user.uid) {
            this.showJoinDialog = false;
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
      rank: this.newPlayerRank,
      isActive: true
    });
  }

}
