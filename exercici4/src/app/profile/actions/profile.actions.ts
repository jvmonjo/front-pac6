import { createAction, props } from '@ngrx/store';
import { Education } from '../models/Education';
import { MyActivities } from 'src/app/profile/models/MyActivities';
import { User } from '../models/User';
import { UserLanguage } from '../models/UserLanguage';


export const addUser = createAction('[PROFILE] add user', props<{user: User }>());
export const addUserSuccess = createAction('[PROFILE] add user success', props<{user: User }>());
export const addUserError = createAction('[PROFILE] add user error', props<{error: string }>());

export const getUserProfile = createAction('[PROFILE] get profile info', props<{user: User}>());
export const getUserProfileSuccess = createAction('[PROFILE] get user profile success', props<{profile: User, education: Education[], activities: MyActivities[], languages: UserLanguage[] }>());
export const getUserProfileError = createAction('[PROFILE] get user profile error', props<{error: string }>());

export const updateUserInitiated = createAction('[PROFILE] update user initiated', props<{user: User}>());
export const updateUserSuccess = createAction('[PROFILE] update user success');
export const updateUserError = createAction('[PROFILE] update user error', props<{error: string }>());

export const cancelActivity = createAction('[PROFILE] cancel activity', props<{activity: MyActivities}>());
export const cancelActivitySuccess = createAction('[PROFILE] cancel activity success',props<{activity: MyActivities}>());
export const cancelActivityError = createAction('[PROFILE] cancel activity error', props<{error: string}>());

export const signupActivity = createAction('[PROFILE] signup activity', props<{userId: number, activityId: number}>());
export const signupActivitySuccess = createAction('[PROFILE] signup activity success', props<{activity: MyActivities}>());
export const signupActivityError = createAction('[PROFILE] signup activity error', props<{error: string}>());