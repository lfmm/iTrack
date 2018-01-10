import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { MoneyComponent } from './money.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';

const routes: Routes = Route.withShell([
  { path: 'money', component: MoneyComponent, data: { title: extract('Money') } },
  { path: 'money-tag', component: EditTagComponent }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MoneyRoutingModule { }
