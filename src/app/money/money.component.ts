import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatSort, MatPaginator, MatChipInputEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

import { MatDialog, MatDialogRef } from '@angular/material';
import { EditDialogComponent } from './edit/edit-dialog.component';

import * as _ from 'lodash';

import { Guid } from '../core/helper.guid';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromMoney from './state/money.reducer';
import * as fromMoneyTag from './state/money-tag.reducer';
import * as fromMoneyActions from './state/money.actions';
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
  moneyListColumns: string[] = ['select', 'tags', 'title', 'direction', 'amount', 'when', 'where', 'who'];
  moneyTagsFilter: fromMoneyModels.MoneyTag[] = [];
  moneyTags: fromMoneyModels.MoneyTag[] = [];
  moneyTagsSubscription: Subscription;
  // bogus vars - for tsc error avoidance only
  moneyFilter: string[];
  moneyTagFilter: string[];
  moneyDirectionFilter: fromMoneyModels.MoneyDirection | null;

  moneyInStatSubscription: Subscription;
  moneyInStat: fromMoneyModels.MoneyStat;

  moneyOutStatSubscription: Subscription;
  moneyOutStat: fromMoneyModels.MoneyStat;

  @ViewChild(MatSort) moneySort: MatSort;
  @ViewChild(MatPaginator) moneyPaginator: MatPaginator;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  constructor(private store: Store<fromMoney.State>, private dialog: MatDialog,
    private storeTag: Store<fromMoneyTag.State>) { }

  ngOnInit() {
    this.moneyItemsSubscription = this.store.select(fromMoney.selectAll).subscribe((i: any[]) => {
      this.moneyItems = i;
      this.moneyItemsDS = new MatTableDataSource(this.moneyItems);
      this.moneyItemsDS.sort = this.moneySort;
      this.moneyItemsDS.paginator = this.moneyPaginator;
      this.moneyItemsDS.filterPredicate = this.filterMoneyItem;
    });
    this.moneyInStatSubscription = this.store.select(fromMoney.selectInEntitiesStat)
      .subscribe((i: fromMoneyModels.MoneyStat) => {
      this.moneyInStat = i;
    });
    this.moneyOutStatSubscription = this.store.select(fromMoney.selectOutEntitiesStat)
      .subscribe((i: fromMoneyModels.MoneyStat) => {
      this.moneyOutStat = i;
    });
    // ++ subscribe to money tags
    this.moneyTagsSubscription = this.storeTag.select(fromMoneyTag.selectAll).subscribe((i: any[]) => {
      this.moneyTags = i;
    });
  }

  ngOnDestroy() {
    if (this.moneyItemsSubscription) { this.moneyItemsSubscription.unsubscribe(); }
    if (this.moneyInStatSubscription) { this.moneyInStatSubscription.unsubscribe(); }
    if (this.moneyOutStatSubscription) { this.moneyOutStatSubscription.unsubscribe(); }
    if (this.moneyTagsSubscription) { this.moneyTagsSubscription.unsubscribe(); }
  }

  filterMoneyItem(data: fromMoneyModels.MoneyItem, filter: string): boolean {
    if (data) {
      let directionGo: boolean = <boolean>true;
      if (this.moneyDirectionFilter !== null) {
        if (data.direction !== this.moneyDirectionFilter) { directionGo = false; }
      }
      if (directionGo && (this.moneyFilter || this.moneyTagFilter)) {
        // data must correspond to every filter
        const tReach: number =
          (this.moneyFilter ? this.moneyFilter.length : 0) + (this.moneyTagFilter ? this.moneyTagFilter.length : 0);
        let found: number = <number>0;
        // tags
        if (this.moneyTagFilter) {
          if (data.tags && data.tags.length > 0) {
            this.moneyTagFilter.forEach((t: string) => {
              if ( _.findIndex(data.tags,
                (l: fromMoneyModels.MoneyTag): boolean => l.code === t) > -1 ) {
                found++;
              }
            });
          }
        }
        // text filters
        if (this.moneyFilter) {
          const dataStr: string =
            _.valuesIn(data).map((v: any): string => v ? v.toString().trim().toLowerCase() : '').join(';');
          this.moneyFilter.forEach((f: string) => {
            if (dataStr.indexOf(f) > -1) { found++; }
          });
        }
        // verify result against expected filters
        if (tReach === found) { return true; } else { return false; }
      }
      return directionGo;
    }
    return true;
  }

  createMoneyItem() {
    const moneyItem: fromMoneyModels.MoneyItem = {
      id: null,
      title: '',
      direction: fromMoneyModels.MoneyDirection.In,
      amount: 0,
      where: null,
      when: new Date(),
      who: 'mistery man',
      tags: []
    };
    this.editMoneyItem(moneyItem);
  }

  deleteMoneyItem(id: string) {
    this.store.dispatch( new fromMoneyActions.Delete(id) );
  }

  deleteSelectedMoneyItems() {
    if (this.moneyItemSelection && this.moneyItemSelection.selected && this.moneyItemSelection.selected.length > 0) {
      const ids: string[] = this.moneyItemSelection.selected.map((m: fromMoneyModels.MoneyItem): string => m.id);
      this.store.dispatch( new fromMoneyActions.DeleteMany(ids) );
      // ++ clear selection
      this.moneyItemSelection.clear();
    }
  }

  editMoneyItem(moneyItem: fromMoneyModels.MoneyItem) {
    const dialogRef: MatDialogRef<EditDialogComponent> = this.dialog.open(EditDialogComponent, {
      width: '350px',
      data: Object.assign({}, moneyItem, { direction: moneyItem.direction.toString() })
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with the following result', result);
      if (result) {
        if (!Number.isInteger(result.direction)) {
          // resolve direction
          result.direction = Number.parseInt(result.direction);
        }
        if (result.where) {
          // simplify object - for localStorage keep
          result.where = <Coordinates>Object.assign({},
            { latitude: result.where.latitude, longitude: result.where.longitude });
        }
        if (!result.id) {
          result.id = Guid.newGuid();
          this.store.dispatch( new fromMoneyActions.Create(result) );
        } else {
          this.store.dispatch( new fromMoneyActions.Update(result.id, result) );
        }
      }
    });
  }

  applyFilter(what: string, type: string = 'filter') {
    // ++ verify what to filter
    if (type && type === 'tag') {
      if (this.moneyTagsFilter && this.moneyTagsFilter.length > 0) {
        (<any>this.moneyItemsDS).moneyTagFilter =
          this.moneyTagsFilter.map((t: fromMoneyModels.MoneyTag): string => t.code);
      } else {
        (<any>this.moneyItemsDS).moneyTagFilter = null;
      }
    } else if (type && type === 'direction') {
      if (what !== undefined) {
        const v: number = Number.parseInt(what);
        (<any>this.moneyItemsDS).moneyDirectionFilter = v;
      } else {
        (<any>this.moneyItemsDS).moneyDirectionFilter = null;
      }
    } else {
      if (what) {
        const wSplit: string[] = [];
        what.split(' ').forEach((s: string) => {
          s = s.trim().toLowerCase();
          if (s && s.length > 0) { wSplit.push(s); }
        });
        if (wSplit.length > 0) { (<any>this.moneyItemsDS).moneyFilter = wSplit; } else {
          (<any>this.moneyItemsDS).moneyFilter = null;
        }
        // ++
      } else { (<any>this.moneyItemsDS).moneyFilter = null; }
    }
    // set new filter to bogus value to reset
    this.moneyItemsDS.filter = _.now().toString();
  }

  applyDirectionFilter(value: any) {
    this.applyFilter(value, 'direction');
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

  addTag(event: MatChipInputEvent): void {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;
    // Add our tag
    if ((value || '').trim()) {
      // get it, add it, if any
      let tag: fromMoneyModels.MoneyTag;
      if (this.moneyTags && this.moneyTags.length > 0) {
        if (this.moneyTags.filter((t: fromMoneyModels.MoneyTag): boolean => {
          if (t.code === value) { tag = t; return true; } else { return false; }
        }).length > 0) {
          if (tag && this.moneyTagsFilter.indexOf(tag) < 1) {
            this.moneyTagsFilter.push(tag);
            this.applyFilter(null, 'tag');
          }
        }
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: any): void {
    const index = this.moneyTagsFilter.indexOf(tag);
    if (index >= 0) {
      this.moneyTagsFilter.splice(index, 1);
      this.applyFilter(null, 'tag');
    }
  }

}
