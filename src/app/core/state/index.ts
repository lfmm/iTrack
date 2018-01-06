import { ActionReducerMap } from '@ngrx/store';
import { trackerReducer } from '../../tracker/state/tracker.reducer';
import { routerReducer } from '@ngrx/router-store';

export const reducers: ActionReducerMap<any> = {
    tracker: trackerReducer,
    routerReducer: routerReducer
};
