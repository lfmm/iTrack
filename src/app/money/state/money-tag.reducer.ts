import * as actions from './money-tag.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MoneyTag, defaultMoneyTag } from './money.models';
import { $$ } from 'protractor';

// Entity adapter
export const moneyTagAdapter = createEntityAdapter<MoneyTag>();
export interface State extends EntityState<MoneyTag> {
  selectedTagCode: string | null;
}

export const initialState: State =
  moneyTagAdapter.getInitialState({ selectedTagCode: null });

// Reducer
export function moneyTagReducer(
    state: State = initialState,
    action: actions.MoneyTagActions) {

    switch (action.type) {
        case actions.CREATE:
        // pass the tag code for id
            action.moneyTag.id = action.moneyTag.code;
            return moneyTagAdapter.addOne(action.moneyTag, state);
        case actions.UPDATE:
            return moneyTagAdapter.updateOne({
                id: action.code,
                changes: action.changes,
            }, state);
        case actions.DELETE:
            return moneyTagAdapter.removeOne(action.code, state);
        case actions.REFRESH:
            return Object.assign({}, state);
        case actions.DELETE_MANY:
            return moneyTagAdapter.removeMany(action.codes, state);
        case actions.SELECT_TAG:
            return Object.assign({}, state, { selectedTagCode: action.code });
        default:
            return state;
        }

}

// Create the default selectors
export const getMoneyTagState = createFeatureSelector<State>('money-tag');
export const getSelectedTagCode = (state: State) => state.selectedTagCode;

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = moneyTagAdapter.getSelectors(getMoneyTagState);

export const selectMoneyTagStateTagList = createSelector(getMoneyTagState, (n: any) => n.entities);
export const selectCurrentTagCode = createSelector(getMoneyTagState, getSelectedTagCode);
export const selectCurrentTag = createSelector(getMoneyTagState, selectCurrentTagCode, (e, c) => e.entities[c] );

