import * as actions from './money.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { MoneyItem, defaultMoneyItem } from './money.models';

// Entity adapter
export const moneyAdapter = createEntityAdapter<MoneyItem>();
export interface State extends EntityState<MoneyItem> { }

export const initialState: State = moneyAdapter.getInitialState(defaultMoneyItem);

// Reducer
export function moneyReducer(
    state: State = initialState,
    action: actions.MoneyActions) {

    switch (action.type) {
        case actions.CREATE:
            return moneyAdapter.addOne(action.moneyItem, state);
        case actions.UPDATE:
            return moneyAdapter.updateOne({
                id: action.id,
                changes: action.changes,
            }, state);
        case actions.DELETE:
            return moneyAdapter.removeOne(action.id, state);
        default:
            return state;
        }

}

// Create the default selectors
export const getMoneyState = createFeatureSelector<State>('money');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = moneyAdapter.getSelectors(getMoneyState);

