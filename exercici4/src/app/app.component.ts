import { Component } from '@angular/core';
import { User } from 'src/app/profile/models/User';
import { AppState } from './app.reducer';
import { Store } from '@ngrx/store';
import { logoutDispatch } from './login/actions';
import { getUserProfile } from './profile/actions';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Tourist app';
  public user: User

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  // public user: User = this.storageService.getItem('user')
  // public isLoggedIn = false

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
    ){}

  ngOnInit(): void{
    this.store.select('login').subscribe(state =>{
      this.user = state.user
      if (state.user) {
        this.store.dispatch(getUserProfile({user: state.user}))
      }
    }
      
    )
    
  }

  logout(){
    this.store.dispatch(logoutDispatch())
  }
}
