import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as actions from './state/tracker.actions';
import * as fromTracker from './state/tracker.reducer';
import * as fromTrackerModels from './state/tracker.models';


import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {

  version: string = environment.version;

  trackItems: Observable<any>;

  constructor(private store: Store<fromTracker.State>) { }

  ngOnInit() {
    this.trackItems = this.store.select(fromTracker.selectAll);
  }

  createTrackItem() {
    const trackItem: fromTrackerModels.TrackItem = {
      id: new Date().getUTCMilliseconds().toString(),
      title: new Date().getUTCMilliseconds().toString(),
      body: new Date().getUTCMilliseconds().toString(),
      when: new Date(),
      who: 'mistery man',
      tags: []
    };

    this.store.dispatch( new actions.Create(trackItem) );
  }

  updateTrackItem(id: string, trackItem: fromTrackerModels.TrackItem, who: string) {
    this.store.dispatch( new actions.Update(id, Object.assign({}, trackItem, { who: who } )) );
  }

  deleteTrackItem(id: string) {
    this.store.dispatch( new actions.Delete(id) );
  }

}
