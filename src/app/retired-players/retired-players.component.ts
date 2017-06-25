import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";

@Component({
  selector: 'app-retired-players',
  templateUrl: './retired-players.component.html',
  styleUrls: ['./retired-players.component.css']
})
export class RetiredPlayersComponent implements OnInit {
  retiredPlayers$: FirebaseListObservable<any[]>;
  retiredPlayers: any[];

  constructor(private af: AngularFireDatabase) {
    this.retiredPlayers$ = af.list('/players', {query: {limitToLast: 100, orderByChild: 'rank'}});
  }

  ngOnInit() {
    this.retiredPlayers$.subscribe(players => {
      this.retiredPlayers = players.filter(p => p.isActive === false);
    });
  }

}
