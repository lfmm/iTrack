import * as actions from './money.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MoneyItem, MoneyDirection, defaultMoneyItem, buildMoneyStat } from './money.models';

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
        case actions.REFRESH:
            return Object.assign({}, state);
        case actions.DELETE_MANY:
            return moneyAdapter.removeMany(action.ids, state);
        case actions.LET_TAGS:
          return moneyAdapter.updateOne({
              id: action.id,
              changes: { tags: action.tags ? [...action.tags] : [] },
            }, state);
        default:
            return state;
        }

}

// Create the default selectors
export const getMoneyState = createFeatureSelector<State>('money');
export const getMoneyStateMoneyList = createSelector(getMoneyState, (n: any) => n.entities);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = moneyAdapter.getSelectors(getMoneyState);

export const selectInEntities = createSelector(getMoneyStateMoneyList, (n: any) => {
  const l: MoneyItem[] = Object.values(n);
  if (l && l.length > 0) {
    return l.filter((i: MoneyItem) => {
      return i.direction === MoneyDirection.In;
    });
  }
  return [];
});

export const selectInEntitiesStat = createSelector(selectInEntities, (n: any) => {
  return buildMoneyStat(MoneyDirection.In, n);
});

export const selectOutEntities = createSelector(getMoneyStateMoneyList, (n: any) => {
  const l: MoneyItem[] = Object.values(n);
  if (l && l.length > 0) {
    return l.filter((i: MoneyItem) => {
      return i.direction === MoneyDirection.Out;
    });
  }
  return [];
});

export const selectOutEntitiesStat = createSelector(selectOutEntities, (n: any) => {
  return buildMoneyStat(MoneyDirection.Out, n);
});

