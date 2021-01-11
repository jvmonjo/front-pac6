import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { ProfileService } from 'src/app/profile/services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  

  constructor(
    private store: Store<AppState>, 
    private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isLoggedIn = false
      this.store.select('login').subscribe(state => isLoggedIn = state.isLoggedIn)
      if (isLoggedIn) { return true } 

      // go login page
      this.router.navigate(['/signin']);
      return false;
  }
  
}
