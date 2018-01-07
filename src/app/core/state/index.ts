import { ActionReducerMap, MetaReducer, META_REDUCERS } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { themeReducer } from './theme/theme.state';

import { debug } from './debug';

export const reducers: ActionReducerMap<any> = {
    routerReducer: routerReducer,
    theme: themeReducer
};

export const metaReducers: MetaReducer<any>[] = [debug];

