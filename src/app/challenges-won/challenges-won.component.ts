import { Component, OnInit } from '@angular/core';
import {AuthService} from '../providers/auth.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {PlayerService} from '../providers/player.service';
import {ChallengesService} from '../providers/challenges.service';

@Component({
  selector: 'app-challenges-won',
  templateUrl: './challenges-won.component.html',
  styleUrls: ['./challenges-won.component.css']
})
export class ChallengesWonComponent implements OnInit {
  loggedInPlayer: any;
  challengesWon: any[];

  constructor(private playerService: PlayerService,
              private challegesService: ChallengesService) {
  }

  ngOnInit() {
    this.playerService.getLoggedInPlayer().subscribe(loggedInPlayer => this.loggedInPlayer = loggedInPlayer);
    this.challegesService.getChallengesWon()
      .map(c => c.sort(this.sortChallenges))
      .subscribe(challengesWon => this.challengesWon = challengesWon);
  }

  sortChallenges = (a, b) => {
    if (a.challengeResponseDateTime > b.challengeResponseDateTime) {
      return -1;
    } else {
      return 1;
    }
  }
}
