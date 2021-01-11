import { createReducer, on } from '@ngrx/store';
import * as activityActions from '../actions';
import { Activity } from '../models/Activity';

export interface ActivitiesState {
    loading: boolean;
    activities: Activity[],
    selectedActivity: Activity
}

export const initialState: ActivitiesState = {
    loading: false,
    activities: [],
    selectedActivity: null
}

const _activitiesReducer = createReducer(
    initialState,
    on(activityActions.getActivities, (state) => ({ ...state, loading: true })),
    on(activityActions.getActivitiesSuccess, (state, {activities}) => ({ ...state, activities, loading: false })),
    on(activityActions.getActivitiesError, (state, {error}) => ({ ...state, error, loading: false })),

    on(activityActions.getActivity, (state) => ({ ...state })),
    on(activityActions.getActivitySuccess, (state, {activity}) => ({ ...state, selectedActivity: activity, loading: false })),
    on(activityActions.getActivityError, (state, {error}) => ({ ...state, error, loading: false })),

    on(activityActions.updateActivity, (state) => ({ ...state, loading: true })),
    on(activityActions.updateActivitySuccess, (state, {activity}) => ({
        ...state,
        activities: [
            ...state.activities.filter(act => act.id !== activity.id),
            activity
        ], 
        loading: false })),
    on(activityActions.updateActivityError, (state, {error}) => ({ ...state, error, loading: false })),

    on(activityActions.addActivity, (state) => ({ ...state, loading: true })),
    on(activityActions.addActivitySuccess, (state, {activity}) => (
        {
            ...state, 
            activities: [...state.activities, activity], 
            loading: false 
        })),
    on(activityActions.addActivityError, (state, {error}) => ({ ...state, error, loading: false })),

    on(activityActions.selectActivity, (state, {activity}) => ({ ...state, selectedActivity: activity })),

);

export function ActivitiesReducer(state: any, action: any) {
    return _activitiesReducer(state, action);
}
