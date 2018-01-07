import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { MoneyRoutingModule } from './money-routing.module';
import { MoneyComponent } from './money.component';

// state management
import { StoreModule } from '@ngrx/store';
import { moneyReducer } from './state/money.reducer';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    MoneyRoutingModule,
    StoreModule.forFeature('money', moneyReducer)
  ],
  declarations: [
    MoneyComponent
  ]
})
export class MoneyModule { }
