import { Action } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

// Theme
export interface Theme {
  id: string;
  class: string;
}

// Default data / initial state
export const defaultTheme = {
  ids: <string[]>['1'],
  entities: { '1': {
        id: '1',
        class: 'app-light-theme'
    }
  }
};

export const CHANGE = '[Theme] Change';

export class Change implements Action {
    readonly type = CHANGE;
    constructor(public id: string, public changes: Partial<Theme>) { }
}

export type ThemeActions
= Change;

// Entity adapter
export const themeAdapter = createEntityAdapter<Theme>();
export interface State extends EntityState<Theme> { }

export const initialState: State = themeAdapter.getInitialState(defaultTheme);

// Reducer
export function themeReducer(
    state: State = initialState,
    action: ThemeActions) {

    switch (action.type) {
        case CHANGE:
            return themeAdapter.updateOne({
                id: action.id,
                changes: action.changes,
            }, state);
        default:
            return state;
        }

}

// Create the default selectors
export const getThemeState = createFeatureSelector<State>('theme');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = themeAdapter.getSelectors(getThemeState);

