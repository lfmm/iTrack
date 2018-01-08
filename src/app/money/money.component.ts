import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { MatDialog, MatDialogRef } from '@angular/material';
import { EditDialogComponent } from './edit/edit-dialog.component';

import { Guid } from '../core/helper.guid';

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
  moneyItemSelection: SelectionModel<fromMoneyModels.MoneyItem>
    = new SelectionModel<fromMoneyModels.MoneyItem>(true, []);
  moneyListColumns: string[] = ['select', 'id', 'title', 'direction', 'amount', 'when', 'where', 'who'];

  @ViewChild(MatSort) moneySort: MatSort;
  @ViewChild(MatPaginator) moneyPaginator: MatPaginator;

  constructor(private store: Store<fromMoney.State>, private dialog: MatDialog) { }

  ngOnInit() {
    this.moneyItemsSubscription = this.store.select(fromMoney.selectAll).subscribe((i: any[]) => {
      this.moneyItems = i;
      this.moneyItemsDS = new MatTableDataSource(this.moneyItems);
      this.moneyItemsDS.sort = this.moneySort;
      this.moneyItemsDS.paginator = this.moneyPaginator;
    });
  }

  ngOnDestroy() {
    if (this.moneyItemsSubscription) { this.moneyItemsSubscription.unsubscribe(); }
  }

  createMoneyItem() {
    const moneyItem: fromMoneyModels.MoneyItem = {
      id: null,
      title: '',
      direction: fromMoneyModels.MoneyDirection.In,
      amount: 0,
      where: null,
      when: new Date(),
      who: 'mistery man'
    };
    this.editMoneyItem(moneyItem);
  }

  deleteMoneyItem(id: string) {
    this.store.dispatch( new actions.Delete(id) );
  }

  editMoneyItem(moneyItem: fromMoneyModels.MoneyItem) {
    const dialogRef: MatDialogRef<EditDialogComponent> = this.dialog.open(EditDialogComponent, {
      width: '350px',
      data: moneyItem
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with the following result', result);
      if (result) {
        if (!result.id) {
          result.id = Guid.newGuid();
          this.store.dispatch( new actions.Create(result) );
        } else {
          this.store.dispatch( new actions.Update(result.id, Object.assign({}, result.moneyItem )) );
        }
      }
    });
  }

  applyFilter(what: string) {
    if (what) {
      what = what.trim();
      what = what.toLowerCase();
      this.moneyItemsDS.filter = what;
    } else {
      this.moneyItemsDS.filter = null;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.moneyItemSelection.selected.length;
    const numRows = this.moneyItemsDS.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.moneyItemSelection.clear() :
        this.moneyItemsDS.data.forEach(row => this.moneyItemSelection.select(row));
  }

}
