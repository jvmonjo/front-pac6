import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/profile/models/User';
import * as loginActions from '../actions';

export interface LoginState {
    isLoggedIn: boolean;
    loading: boolean;
    user: User;
    error: any;
}

export const initialState: LoginState = {
    isLoggedIn: false,
    loading: false,
    user: null,
    error: null
}

const _loginReducer = createReducer(
    initialState,
    on(loginActions.loginInitiated, (state, credentials) => ({ ...state, error: null, loading: true })),
    on(loginActions.loginSuccess, (state, {user}) => ({...state, isLoggedIn: true, user, loading: false, error: null })),
    on(loginActions.loginError, (state, {error}) => ({...state, user: null, error: error, isLoggedIn: false, loading: false })),
    on(loginActions.logoutDispatch, (state) => ({...state, user: null}))
);

export function LoginReducer(state: any, action: any) {
    return _loginReducer(state, action);
}
