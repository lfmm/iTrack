import { StoreModule, ActionReducer, MetaReducer, Action } from '@ngrx/store';

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state: any, action: Action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}
