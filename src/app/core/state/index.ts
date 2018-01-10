import { ActionReducerMap, MetaReducer, META_REDUCERS } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { themeReducer } from './theme/theme.state';

import { debug } from './debug';
import { ActionReducer } from '@ngrx/store/src/models';

export const reducers: ActionReducerMap<any> = {
    routerReducer: routerReducer,
    theme: themeReducer
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['theme', 'money', 'money-tag',
    'tracker', 'routerReducer'], rehydrate: true})(reducer);
}

export const metaReducers: MetaReducer<any>[] = [debug, localStorageSyncReducer];

