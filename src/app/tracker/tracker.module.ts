import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { TrackerRoutingModule } from './tracker-routing.module';
import { TrackerComponent } from './tracker.component';

// state management
import { StoreModule } from '@ngrx/store';
import { trackerReducer } from './state/tracker.reducer';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    TrackerRoutingModule,
    StoreModule.forFeature('tracker', trackerReducer)
  ],
  declarations: [
    TrackerComponent
  ]
})
export class TrackerModule { }
