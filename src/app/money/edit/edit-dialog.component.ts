import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { State } from '../state/money-tag.reducer';
import * as fromMoney from '../state/money.reducer';
import * as fromMoneyTag from '../state/money-tag.reducer';
import * as fromMoneyModels from '../state/money.models';
import * as fromMoneyActions from '../state/money.actions';
import * as fromMoneyTagActions from '../state/money-tag.actions';

@Component({
  selector: 'app-money-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit, OnDestroy {

  /* edit type */
  type: string = <string>'';

  /* form controls */
  form: FormGroup;

  /* money tags */
  moneyTags: fromMoneyModels.MoneyTag[] = [];
  moneyTagsSubscription: Subscription;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private moneyStore: Store<fromMoney.State>,
    private moneyTagStore: Store<fromMoneyTag.State>) {
    // ++ build form
    this.form = this.fb.group({
      title: ['', Validators.required],
      direction: ['', Validators.required],
      amount: [0, Validators.required],
      when: [new Date(), Validators.required],
      where: null,
      who: ['', Validators.required],
      tags: []
    });
    // ++ subscribe to money tags
    this.moneyTagsSubscription = this.moneyTagStore.select(fromMoneyTag.selectAll).subscribe((i: any[]) => {
      this.moneyTags = i;
    });
  }

  ngOnInit() {
    if (this.data && this.data.id) {
      this.type = 'Update Item (' + this.data.id + ')';
      if (!this.data.where || !this.data.where.latitude) {
        this.getCurrentGeolocation();
      }
    } else {
      this.type = 'New Item';
      this.getCurrentGeolocation();
    }
    // ++ dispatch a bogus select tag action
    this.moneyTagStore.dispatch( new fromMoneyTagActions.SelectTag('1') );
  }

  ngOnDestroy() {
    if (this.moneyTagsSubscription) { this.moneyTagsSubscription.unsubscribe(); }
  }

  close() {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    if (field && this.form.get(field)) {
      return this.form.get(field).hasError('required') ? 'This field is required' : '';
    }
    return '';
  }

  getCurrentGeolocation(): void {
    // ++
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p: Position) => {
        if (p && p.coords) {
          this.data.where = p.coords;
        }
      });
    }
    // --
  }

  addTag(event: MatChipInputEvent): void {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;
    // Add our tag
    if ((value || '').trim()) {
      // check if it is on our money tags list
      let isIn: boolean = <boolean>false;
      let tag: fromMoneyModels.MoneyTag;
      if (this.moneyTags && this.moneyTags.length > 0) {
        if (this.moneyTags.filter((t: fromMoneyModels.MoneyTag): boolean => {
          if (t.code === value) { tag = t; return true; } else { return false; }
        }).length > 0) { isIn = true; } else { isIn = false; }
      } else { isIn = false; }
      // ++
      if (!isIn) {
        // --
        tag = {
          id: value,
          code: value,
          color: 'blue',
          description: value,
          path: [],
          title: value,
          when: new Date(),
          who: 'b'
        };
        // dispatch to moneyTagStore and create it
        this.moneyTagStore.dispatch( new fromMoneyTagActions.Create(tag) );
      }
      // ++ add it to the tag collection, if not added yet
      if (this.data.tags.filter((t: fromMoneyModels.MoneyTag): boolean => {
        if (t.code === value) { return true; } else { return false; }
      }).length < 1) {
        this.data.tags.push(tag);
        if (this.data.id) {
          // dispatch to moneyStore
          this.moneyStore.dispatch( new fromMoneyActions.LetTags(this.data.id, this.data.tags) );
        }
      }
      // --
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: any): void {
    const index = this.data.tags.indexOf(tag);
    if (index >= 0) {
      this.data.tags.splice(index, 1);
      if (this.data.id) {
        // dispatch to moneyStore
        this.moneyStore.dispatch( new fromMoneyActions.LetTags(this.data.id, this.data.tags) );
      }
  }
  }

}
