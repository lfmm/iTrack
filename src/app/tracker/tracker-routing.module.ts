import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { TrackerComponent } from './tracker.component';

const routes: Routes = Route.withShell([
  { path: 'tracker', component: TrackerComponent, data: { title: extract('Tracker') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TrackerRoutingModule { }
