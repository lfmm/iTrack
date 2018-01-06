import * as actions from './tracker.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { TrackItem, defaultTrackItem } from './tracker.models';

// Entity adapter
export const trackerAdapter = createEntityAdapter<TrackItem>();
export interface State extends EntityState<TrackItem> { }

export const initialState: State = trackerAdapter.getInitialState(defaultTrackItem);

// Reducer
export function trackerReducer(
    state: State = initialState,
    action: actions.TrackerActions) {

    switch (action.type) {
        case actions.CREATE:
            return trackerAdapter.addOne(action.trackItem, state);
        case actions.UPDATE:
            return trackerAdapter.updateOne({
                id: action.id,
                changes: action.changes,
            }, state);
        case actions.DELETE:
            return trackerAdapter.removeOne(action.id, state);
        default:
            return state;
        }

}

// Create the default selectors
export const getTrackerState = createFeatureSelector<State>('tracker');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = trackerAdapter.getSelectors(getTrackerState);

