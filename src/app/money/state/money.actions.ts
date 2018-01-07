import { Action } from '@ngrx/store';
import { MoneyItem } from './money.models';


export const CREATE = '[Money] Create';
export const UPDATE = '[Money] Update';
export const DELETE = '[Money] Delete';

export class Create implements Action {
    readonly type = CREATE;
    constructor(public moneyItem: MoneyItem) { }
}

export class Update implements Action {
    readonly type = UPDATE;
    constructor(
        public id: string,
        public changes: Partial<MoneyItem>,
      ) { }
}

export class Delete implements Action {
    readonly type = DELETE;
    constructor(public id: string) { }
}

export type MoneyActions
= Create
| Update
| Delete;
