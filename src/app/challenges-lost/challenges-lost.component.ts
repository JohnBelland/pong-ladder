import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from '../providers/auth.service';
import {PlayerService} from '../providers/player.service';
import {ChallengesService} from '../providers/challenges.service';

@Component({
  selector: 'app-challenges-lost',
  templateUrl: './challenges-lost.component.html',
  styleUrls: ['./challenges-lost.component.css']
})
export class ChallengesLostComponent implements OnInit {
  loggedInPlayer: any;
  challengesLost: any[];

  constructor(private playerService: PlayerService,
              private challegesService: ChallengesService) {
  }

  ngOnInit() {
    this.playerService.getLoggedInPlayer().subscribe(loggedInPlayer => this.loggedInPlayer = loggedInPlayer);
    this.challegesService.getChallengesLost()
      .map(c => c.sort(this.sortChallenges))
      .subscribe(challengesLost => this.challengesLost = challengesLost);
  }

  sortChallenges = (a, b) => {
    if (a.challengeResponseDateTime > b.challengeResponseDateTime) {
      return -1;
    } else {
      return 1;
    }
  }

}
