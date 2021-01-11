import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { addUser, addUserError, addUserSuccess, cancelActivity, cancelActivityError, cancelActivitySuccess, getUserProfile, getUserProfileError, getUserProfileSuccess, signupActivity, signupActivityError, signupActivitySuccess, updateUserError, updateUserInitiated, updateUserSuccess } from '../actions';
import { ProfileService } from '../services/profile.service';
import { loginInitiated } from 'src/app/login/actions';
import { ActivitiesService } from 'src/app/activities/services/activities.service';
import { of } from 'rxjs';


@Injectable()
export class ProfileEffects {

    constructor(
        private actions$: Actions,
        private profileService: ProfileService,
        private activitiesService: ActivitiesService
    ){}

    addUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(addUser),
            switchMap((action) => {
                return this.profileService.addUser(action.user)
                  .then(
                    user => addUserSuccess({user}),
                    error => addUserError({error: error.toString()})
                  )
            }
            )
        )
    }
    );

    addUserSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(addUserSuccess),
            map((action) => {
                const credentials = {
                    email: action.user.email, 
                    password: action.user.password
                }
                return loginInitiated({credentials})
            }
            )
        )
    });

    getUserProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(getUserProfile),
            switchMap(async (action) => {

                const education = await this.profileService.getEducations(action.user.id).toPromise()
                const languages = await this.profileService.getLanguages(action.user.id).toPromise()
                const activities =await this.activitiesService.getMyActivities(action.user.id).toPromise()
                const profile = action.user
                return getUserProfileSuccess({profile, education, languages, activities})
            }),
            catchError(err => of(getUserProfileError({error: err.toString()})))
        )
    })

    updateUserInitiated$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(updateUserInitiated),
            switchMap(async (action) => {
                return this.profileService.updateUser(action.user).toPromise()
                    .then(() => updateUserSuccess())
                
            }),
            catchError(err => of(updateUserError({error: err.toString()})))
        )
    })

    cancelActivity$ = createEffect(() =>{
        return this.actions$.pipe(
            ofType(cancelActivity),
            switchMap((action) => {
                return this.activitiesService.removeMyActivity(action.activity.id).pipe(
                    map(() => cancelActivitySuccess({activity: action.activity}))
                )                
            }),
            catchError(error => of(cancelActivityError({error})))
             
        )
    })

    signupActivity$ = createEffect(() =>{
        return this.actions$.pipe(
            ofType(signupActivity),
            switchMap(async (action) => {
                const activity = await this.activitiesService.signUpActivity(action.userId, action.activityId).toPromise()
                return signupActivitySuccess({activity})
            }),
            catchError(error => of(signupActivityError({error})))
             
        )
    })
}