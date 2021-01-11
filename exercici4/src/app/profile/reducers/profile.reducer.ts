import { createReducer, on } from '@ngrx/store';
import * as profileActions from '../actions';
import { Education } from '../models/Education';
import { MyActivities } from 'src/app/profile/models/MyActivities';
import { User } from '../models/User';
import { UserLanguage } from '../models/UserLanguage';

export interface ProfileState {
    loading: boolean;
    error: string;
    profile: User;
    languages: UserLanguage[];
    education: Education[];
    activities: MyActivities[];
}

export const initialState: ProfileState = {
    loading: false,
    error: null,
    profile: null,
    languages: [],
    education: [],
    activities: []
}

const _profileReducer = createReducer(
    initialState,
    on(profileActions.addUser, (state) => ({ ...state, loading: true })),
    on(profileActions.addUserSuccess, (state ) => ({ ...state, loading: false })),
    on(profileActions.addUserError, (state, { error } ) => ({ ...state, loading: false, error })),
    on(profileActions.getUserProfile, (state) => ({...state, loading: true})),
    on(profileActions.getUserProfileSuccess, (state, { profile, languages, education, activities }) => ({...state, profile, languages, education, activities, loading: false})),
    on(profileActions.getUserProfileError, (state, { error } ) => ({ ...state, loading: false, error })),


    on(profileActions.cancelActivity, (state) => ({ ...state, loading: true })),
    on(profileActions.cancelActivitySuccess, (state, {activity}) => ({ 
        ...state, 
        activities: [...state.activities.filter(act => act.id !== activity.id)],  
        loading: false })),
    on(profileActions.cancelActivityError, (state, {error}) => ({ ...state, error, loading: false })),

    on(profileActions.signupActivity, (state) => ({ ...state, loading: true })),
    on(profileActions.signupActivitySuccess, (state, {activity}) => ({ 
        ...state, 
        activities: [...state.activities, activity],
        loading: false })),
    on(profileActions.signupActivityError, (state, {error}) => ({ ...state, error, loading: false })),
);

export function ProfileReducer(state: any, action: any) {
    return _profileReducer(state, action);
}
