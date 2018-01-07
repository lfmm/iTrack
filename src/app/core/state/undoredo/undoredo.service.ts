import { Injectable } from '@angular/core';

@Injectable()
export class UndoredoService {

  private _undo: any[];
  private _redo: any[];

  constructor() {}

  init() {
    // load history from somewhere!!
  }

  do(what: any) {
    // set new do - reset redo
  }

  undo() {
    // undo to last state
  }

  redo() {
    // redo to next state
  }

}
