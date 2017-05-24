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
    this.challegesService.getChallengesPending().subscribe(challengesPending => this.challengesPending = challengesPending);
  }

}
