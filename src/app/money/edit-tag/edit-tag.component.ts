import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import * as _ from 'lodash';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromMoneyTag from '../state/money-tag.reducer';
import * as fromMoneyTagActions from '../state/money-tag.actions';
import * as fromMoneyModels from '../state/money.models';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-money-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit, OnDestroy {

  items: fromMoneyModels.MoneyTag[];
  itemsSubscription: Subscription;
  selectedItem: fromMoneyModels.MoneyTag;
  selectedItemSubscription: Subscription;

  tableItemsDS: MatTableDataSource<fromMoneyModels.MoneyTag> = new MatTableDataSource(this.items);
  tableItemSelection: SelectionModel<fromMoneyModels.MoneyTag>
    = new SelectionModel<fromMoneyModels.MoneyTag>(true, []);
  tableColumns: string[] = ['select', 'code', 'title', 'color', 'when', 'description', 'who'];

  itemEdit: fromMoneyModels.MoneyTag;
  itemEditNew: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<fromMoneyTag.State>) { }

  ngOnInit() {
    // ++ subscribe to money tags
    this.itemsSubscription = this.store.select(fromMoneyTag.selectAll).subscribe((i: any[]) => {
      this.items = i;
      this.tableItemsDS = new MatTableDataSource(this.items);
      this.tableItemsDS.sort = this.sort;
      this.tableItemsDS.paginator = this.paginator;
    });
    // ++ subscribe to selected item
    this.selectedItemSubscription = this.store.select(fromMoneyTag.selectCurrentTag).subscribe(
      (i: fromMoneyModels.MoneyTag) => {
      this.itemEditNew = false;
      this.itemEdit = i;
    });
  }

  ngOnDestroy() {
    if (this.itemsSubscription) { this.itemsSubscription.unsubscribe(); }
  }

  createTableItem() {
    const item: fromMoneyModels.MoneyTag = {
      id: '',
      code: '',
      title: '',
      when: new Date(),
      who: '',
      path: [],
      color: '#000000',
      description: ''
    };
    this.itemEditNew = true;
    this.itemEdit = item;
  }

  deleteTableItem(code: string) {
    this.store.dispatch( new fromMoneyTagActions.Delete(code) );
  }

  deleteSelectedTableItems() {
    if (this.tableItemSelection && this.tableItemSelection.selected && this.tableItemSelection.selected.length > 0) {
      const codes: string[] = this.tableItemSelection.selected.map((m: fromMoneyModels.MoneyTag): string => m.code);
      this.store.dispatch( new fromMoneyTagActions.DeleteMany(codes) );
      // ++ clear selection
      this.tableItemSelection.clear();
    }
  }

  editTableItem(item: fromMoneyModels.MoneyTag) {
    this.store.dispatch( new fromMoneyTagActions.SelectTag(item.code) );
  }

  applyFilter(what: string) {
    this.tableItemsDS.filter = what;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.tableItemSelection.selected.length;
    const numRows = this.tableItemsDS.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.tableItemSelection.clear() :
        this.tableItemsDS.data.forEach(row => this.tableItemSelection.select(row));
  }

}
