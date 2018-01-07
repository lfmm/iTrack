import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as actions from './state/money.actions';
import * as fromMoney from './state/money.reducer';
import * as fromMoneyModels from './state/money.models';


import { environment } from '../../environments/environment';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss']
})
export class MoneyComponent implements OnInit, OnDestroy {

  version: string = environment.version;

  moneyItemsSubscription: Subscription;
  moneyItems: any[] = [];
  moneyItemsDS: MatTableDataSource<fromMoneyModels.MoneyItem> = new MatTableDataSource(this.moneyItems);
  moneyListColumns: string[] = ['id', 'title', 'direction', 'amount', 'when', 'where', 'who'];

  constructor(private store: Store<fromMoney.State>) { }

  ngOnInit() {
    this.moneyItemsSubscription = this.store.select(fromMoney.selectAll).subscribe((i: any[]) => {
      this.moneyItems = i;
      this.moneyItemsDS = new MatTableDataSource(this.moneyItems);
    });
  }

  ngOnDestroy() {
    if (this.moneyItemsSubscription) { this.moneyItemsSubscription.unsubscribe(); }
  }

  createMoneyItem() {
    const moneyItem: fromMoneyModels.MoneyItem = {
      id: new Date().getUTCMilliseconds().toString(),
      title: new Date().getUTCMilliseconds().toString(),
      direction: fromMoneyModels.MoneyDirection.In,
      amount: 100,
      where: null,
      when: new Date(),
      who: 'mistery man'
    };

    this.store.dispatch( new actions.Create(moneyItem) );
  }

  updateMoneyItem(id: string, moneyItem: fromMoneyModels.MoneyItem, who: string) {
    this.store.dispatch( new actions.Update(id, Object.assign({}, moneyItem, { who: who } )) );
  }

  deleteMoneyItem(id: string) {
    this.store.dispatch( new actions.Delete(id) );
  }

}
