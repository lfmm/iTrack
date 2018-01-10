import { Action } from '@ngrx/store';
import { MoneyItem, MoneyTag } from './money.models';

// ++ money related
export const CREATE = '[Money] Create';
export const UPDATE = '[Money] Update';
export const DELETE = '[Money] Delete';
export const REFRESH = '[Money] Refresh';
export const DELETE_MANY = '[Money] Delete Many';
// ++ money tag related
export const LET_TAGS = '[Money] Let Tags';

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

export class Refresh implements Action {
  readonly type = REFRESH;
  constructor() { }
}

export class DeleteMany implements Action {
  readonly type = DELETE_MANY;
  constructor(public ids: string[]) { }
}

export class LetTags implements Action {
  readonly type = LET_TAGS;
  constructor(public id: string, public tags: MoneyTag[]) { }
}

export type MoneyActions
= Create
| Update
| Delete
| Refresh
| DeleteMany
| LetTags;
