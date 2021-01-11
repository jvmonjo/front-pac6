import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/profile/models/User';
import { Credentials } from '../models/Credentials';

export const loginInitiated = createAction('[LOGIN] initiated', props<{credentials: Credentials }>());

export const loginSuccess = createAction('[LOGIN] success', props<{user: User}>());

export const loginError = createAction('[LOGIN] error', props<{error: string}>());

export const logoutDispatch = createAction('[LOGIN] logout');
