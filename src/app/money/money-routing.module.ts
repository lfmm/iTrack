import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { MoneyComponent } from './money.component';

const routes: Routes = Route.withShell([
  { path: 'money', component: MoneyComponent, data: { title: extract('Money') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MoneyRoutingModule { }
