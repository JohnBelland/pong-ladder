import { Component, OnInit } from '@angular/core';
import {PlayerService} from '../providers/player.service';
import {ChallengesService} from '../providers/challenges.service';

@Component({
  selector: 'app-challenges-declined',
  templateUrl: './challenges-declined.component.html',
  styleUrls: ['./challenges-declined.component.css']
})
export class ChallengesDeclinedComponent implements OnInit {
  loggedInPlayer: any;
  challengesDeclined: any[];

  constructor(private playerService: PlayerService,
              private challegesService: ChallengesService) {
  }

  ngOnInit() {
    this.playerService.getLoggedInPlayer().subscribe(loggedInPlayer => this.loggedInPlayer = loggedInPlayer);
    this.challegesService.getChallengesDeclined()
      .map(c => c.sort(this.sortChallenges))
      .subscribe(challengesDeclined => this.challengesDeclined = challengesDeclined);
  }

  sortChallenges = (a, b) => {
    if (a.challengeResponseDateTime > b.challengeResponseDateTime) {
      return -1;
    } else {
      return 1;
    }
  }
}
