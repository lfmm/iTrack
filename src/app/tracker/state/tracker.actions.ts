import { Action } from '@ngrx/store';
import { TrackItem } from './tracker.models';


export const CREATE = '[Tracker] Create';
export const UPDATE = '[Tracker] Update';
export const DELETE = '[Tracker] Delete';

export class Create implements Action {
    readonly type = CREATE;
    constructor(public trackItem: TrackItem) { }
}

export class Update implements Action {
    readonly type = UPDATE;
    constructor(
        public id: string,
        public changes: Partial<TrackItem>,
      ) { }
}

export class Delete implements Action {
    readonly type = DELETE;
    constructor(public id: string) { }
}

export type TrackerActions
= Create
| Update
| Delete;