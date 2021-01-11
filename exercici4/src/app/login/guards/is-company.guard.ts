import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class IsCompanyGuard implements CanActivate {

  constructor(
    private store: Store<AppState>, 
    private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isCompany= false
      this.store.select('login').subscribe(state => isCompany = state.user && state.user.type === 1)
      if (isCompany) { return true } 

      // go login page
      this.router.navigate(['/signin']);
      return false;
  }
  
}
