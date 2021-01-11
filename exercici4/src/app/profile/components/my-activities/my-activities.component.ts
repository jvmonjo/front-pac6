import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.scss']
})
export class MyActivitiesComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  public userId: number

  ngOnInit(): void {
    this.store.select('login').subscribe(state => {
      if (state.user) {
        this.userId = state.user.id
      }
    })
  }

}
