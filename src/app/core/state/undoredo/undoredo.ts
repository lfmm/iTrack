import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import { UndoredoService } from './undoredo.service';

export const DO = '[Undoredo] Do';
export const UNDO = '[Undoredo] Undo';
export const REDO = '[Undoredo] Redo';

export class Do implements Action {
  readonly type = DO;

  constructor(public payload: any) {}
}

export class Undo implements Action {
  readonly type = UNDO;
}

export class Redo implements Action {
  readonly type = REDO;
}

export type Actions
  = Do
  | Undo
  | Redo;

@Injectable()
export class UndoredoEffects {
  @Effect({ dispatch: false })
  navigate$ = this.actions$.ofType(DO).pipe(
    map((action: Do) => action.payload),
    tap((w: any) => this.service.do(w))
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.ofType(UNDO).pipe(
    tap(() => this.service.undo())
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.ofType(REDO).pipe(
    tap(() => this.service.redo())
  );

  constructor(
    private actions$: Actions,
    private service: UndoredoService
  ) {}

}

