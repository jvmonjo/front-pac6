import { createAction, props } from '@ngrx/store';
import { MyActivities } from 'src/app/profile/models/MyActivities';
import { Activity } from '../models/Activity';

export const getActivities = createAction('[ACTIVITIES] get activities');
export const getActivitiesSuccess = createAction('[ACTIVITIES] get activities success', props<{activities: Activity[]}>());
export const getActivitiesError = createAction('[ACTIVITIES] get activities error', props<{error: string}>());

export const getActivity = createAction('[ACTIVITIES] get activity', props<{id: number}>());
export const getActivitySuccess = createAction('[ACTIVITIES] get activity success', props<{activity: Activity}>());
export const getActivityError = createAction('[ACTIVITIES] get activity error', props<{error: string}>());

export const updateActivity = createAction('[ACTIVITIES] update activity', props<{activity: Activity}>());
export const updateActivitySuccess = createAction('[ACTIVITIES] update activity success', props<{activity: Activity}>());
export const updateActivityError = createAction('[ACTIVITIES] update activity error', props<{error: string}>());


export const addActivity = createAction('[ACTIVITIES] add activity', props<{activity: Activity}>());
export const addActivitySuccess = createAction('[ACTIVITIES] add activity success', props<{activity: Activity}>());
export const addActivityError = createAction('[ACTIVITIES] add activity error', props<{error: string}>());

export const selectActivity = createAction('[ACTIVITIES] select activity', props<{activity: Activity}>());
