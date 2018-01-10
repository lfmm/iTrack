import { Action } from '@ngrx/store';
import { MoneyTag } from './money.models';

export const CREATE = '[MoneyTag] Create';
export const UPDATE = '[MoneyTag] Update';
export const DELETE = '[MoneyTag] Delete';
export const REFRESH = '[MoneyTag] Refresh';
export const DELETE_MANY = '[MoneyTag] Delete Many';
export const SELECT_TAG = '[MoneyTag] Select Tag';

export class Create implements Action {
    readonly type = CREATE;
    constructor(public moneyTag: MoneyTag) { }
}

export class Update implements Action {
    readonly type = UPDATE;
    constructor(
        public code: string,
        public changes: Partial<MoneyTag>,
      ) { }
}

export class Delete implements Action {
    readonly type = DELETE;
    constructor(public code: string) { }
}

export class Refresh implements Action {
  readonly type = REFRESH;
  constructor() { }
}

export class DeleteMany implements Action {
  readonly type = DELETE_MANY;
  constructor(public codes: string[]) { }
}

export class SelectTag implements Action {
  readonly type = SELECT_TAG;
  constructor(public code: string) { }
}

export type MoneyTagActions
= Create
| Update
| Delete
| Refresh
| DeleteMany
| SelectTag;
