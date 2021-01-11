import { ActionReducerMap, ReducerObservable } from '@ngrx/store';
import * as loginReducers from './login/reducers';
import * as profileReducers from './profile/reducers';
import * as activitiesReducers from './activities/reducers'


export interface AppState {
    login: loginReducers.LoginState;
    profile: profileReducers.ProfileState;
    activities: activitiesReducers.ActivitiesState;
}

export const appReducers: ActionReducerMap<AppState> = {
    login: loginReducers.LoginReducer,
    profile: profileReducers.ProfileReducer,
    activities: activitiesReducers.ActivitiesReducer
};
