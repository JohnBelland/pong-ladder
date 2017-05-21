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
    this.challegesService.getChallengesDeclined().subscribe(challengesDeclined => this.challengesDeclined = challengesDeclined);
  }


}
