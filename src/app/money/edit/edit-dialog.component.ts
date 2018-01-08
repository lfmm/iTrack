import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromMoneyModels from '../state/money.models';

@Component({
  selector: 'app-money-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  /* edit type */
  type: string = <string>'';

  /* form controls */
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: fromMoneyModels.MoneyItem,
    private fb: FormBuilder) {
    // ++ build form
    this.form = this.fb.group({
      title: ['', Validators.required],
      direction: [0, Validators.required],
      amount: [0, Validators.required],
      when: [new Date(), Validators.required],
      where: null,
      who: ['', Validators.required]
    });
    // --
  }

  ngOnInit() {
    console.log('Dialog open with data:', this.data);
    if (this.data && this.data.id) {
      this.type = 'Update Item (' + this.data.id + ')';
    } else {
      this.type = 'New Item';
    }
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


}
