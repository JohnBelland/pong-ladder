import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RankingsComponent } from './rankings/rankings.component';
import { AlertModule } from 'ng2-bootstrap';
import { PlayersComponent } from './players/players.component';
import { AuthService } from './providers/auth.service';
import { HeaderComponent } from './header/header.component';
import { ChallengeAlertComponent } from './challenge-alert/challenge-alert.component';
import { ChallengesWonComponent } from './challenges-won/challenges-won.component';
import { ChallengesLostComponent } from './challenges-lost/challenges-lost.component';
import { ChallengesDeclinedComponent } from './challenges-declined/challenges-declined.component';
import { ChallengesPendingComponent } from './challenges-pending/challenges-pending.component';
import { LadderRankingComponent } from './ladder-ranking/ladder-ranking.component';
import { PlayerService } from './providers/player.service';
import { ChallengesService } from './providers/challenges.service';
import { SlackService } from './providers/slack.service';
import { LogoutComponent } from './logout/logout.component';
import { RetiredPlayersComponent } from './retired-players/retired-players.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyDXjmsywuNUTfxvX7YnHwKsTn12_Xd1d9k',
  authDomain: 'pongassistrx.firebaseapp.com',
  databaseURL: 'https://pongassistrx.firebaseio.com',
  projectId: 'pongassistrx',
  storageBucket: 'pongassistrx.appspot.com',
  messagingSenderId: '463969418358'
};

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: 'players', component: PlayersComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingsComponent,
    PlayersComponent,
    HeaderComponent,
    ChallengeAlertComponent,
    ChallengesWonComponent,
    ChallengesLostComponent,
    ChallengesDeclinedComponent,
    ChallengesPendingComponent,
    LadderRankingComponent,
    LogoutComponent,
    RetiredPlayersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AlertModule.forRoot()
  ],
  providers: [AuthService, PlayerService, ChallengesService, SlackService],
  bootstrap: [AppComponent]
})
export class AppModule { }
