import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { LoginService } from '../services/login.service';
import { mergeMap, map, catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { loginError, loginInitiated, loginSuccess, logoutDispatch } from '../actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';


@Injectable()
export class LoginEffects {

    constructor(
        private actions$: Actions,
        private loginService: LoginService,
        private storageService: StorageService,
        private router: Router
    ){}

    checkLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginInitiated),
            exhaustMap((action) => {
                return this.loginService.login(action.credentials).pipe(
                    map(user => {
                        // console.log(user)
                        // this.storageService.addItem('user', user)
                        return loginSuccess({user})
                    }),
                    catchError(
                        err => {
                            // console.log('error', err)
                            this.storageService.addItem('user', null)
                            return of(loginError({error: err}))
                        }
                    )
                )
            }
            )
        )
    );

    loginSuccess$ = createEffect(
        () =>
          this.actions$.pipe(
            ofType(loginSuccess),
            tap(() => this.router.navigate(['/']))
          ),
        { dispatch: false }
      );

      logout$ = createEffect(
        () =>
          this.actions$.pipe(
            ofType(logoutDispatch),
            tap(() => this.router.navigate(['/signin']))
          ),
        { dispatch: false }
      );
}
