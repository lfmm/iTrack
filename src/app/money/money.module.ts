import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { MoneyRoutingModule } from './money-routing.module';
import { MoneyComponent } from './money.component';
import { EditDialogComponent } from './edit/edit-dialog.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';

// charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

// state management
import { StoreModule } from '@ngrx/store';
import { moneyReducer } from './state/money.reducer';
import { moneyTagReducer } from './state/money-tag.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    MoneyRoutingModule,
    StoreModule.forFeature('money', moneyReducer),
    StoreModule.forFeature('money-tag', moneyTagReducer),
    NgxChartsModule
  ],
  declarations: [
    MoneyComponent,
    EditDialogComponent,
    EditTagComponent
  ],
  entryComponents: [EditDialogComponent]
})
export class MoneyModule { }
