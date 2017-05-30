import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Http} from "@angular/http";

@Injectable()
export class SlackService {
  slackMessageQueue$: FirebaseListObservable<any[]>;

  constructor(private af: AngularFireDatabase) {
    this.slackMessageQueue$ = af.list('/slackMessageQueue', {query: {limitToLast: 100}});
  }

  addToSlackMessageQueue(slackMessage: any) {
    this.slackMessageQueue$.push(slackMessage);

    // this.http.post('https://hooks.slack.com/services/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', { payload = {'text': 'This is a line of text in a channel. And this is another line of text.'}}).subscribe();
  }

}
