import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../providers/player.service';
import { ChallengesService } from '../providers/challenges.service';

@Component({
  selector: 'app-challenges-pending',
  templateUrl: './challenges-pending.component.html',
  styleUrls: ['./challenges-pending.component.css']
})
export class ChallengesPendingComponent implements OnInit {
  loggedInPlayer: any;
  challengesPending: any[];

  constructor(private playerService: PlayerService,
              private challegesService: ChallengesService) {
  }

  ngOnInit() {
    this.playerService.getLoggedInPlayer().subscribe(loggedInPlayer => this.loggedInPlayer = loggedInPlayer);
    this.challegesService.getChallengesPending()
      .map(c => c.sort(this.sortChallenges))
      .subscribe(challengesPending => this.challengesPending = challengesPending);
  }

  sortChallenges = (a, b) => {
    if (a.challengeResponseDateTime > b.challengeResponseDateTime) {
      return -1;
    } else {
      return 1;
    }
  }

}
