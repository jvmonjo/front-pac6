import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { addActivity, addActivityError, addActivitySuccess, getActivities, getActivitiesSuccess, getActivity, getActivityError, getActivitySuccess, updateActivity, updateActivityError, updateActivitySuccess } from '../actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivitiesService } from '../services/activities.service';


@Injectable()
export class ActivitiesEffects {

    constructor(
        private actions$: Actions,
        private activitiesService: ActivitiesService,
        private router: Router
    ){}

    getActivities$ = createEffect(() =>{
        return this.actions$.pipe(
            ofType(getActivities),
            switchMap(async () => {
                const activities = await this.activitiesService.getActivities().toPromise()
                return getActivitiesSuccess({activities})
            })
        )
    });

    updateActivity$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(updateActivity),
            switchMap((action) => {
               return this.activitiesService.updateActivity(action.activity).toPromise()
                    .then(() => updateActivitySuccess({activity: action.activity}))
                    .catch(error => updateActivityError({error}))
            }),
            catchError(error => of(updateActivityError({error})))
        )
    });

    addActivity$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(addActivity),
            switchMap((action) => {
                // console.log(action)
               return this.activitiesService.addActivity(action.activity).toPromise()
                    .then((activity) => addActivitySuccess({activity}))
                    .catch(error => addActivityError({error}))
            }),
            catchError(error => of(addActivityError({error})))
        )
    });

    getActivity$ = createEffect(() =>{
        return this.actions$.pipe(
            ofType(getActivity),
            switchMap(async (action) => {
                const people = await this.activitiesService.getPeopleOnActivity(action.id).toPromise()
                const activity = await this.activitiesService.getActivity(action.id).toPromise()
                // console.log(people)
                activity.peopleRegistered = people.length
                return activity            
            }),
            map( data => {
                return getActivitySuccess({activity: data})
            }),
            catchError(error => of(getActivityError({error})))
        )
    });


}
