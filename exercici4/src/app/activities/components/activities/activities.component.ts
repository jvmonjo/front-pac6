import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Activity } from 'src/app/activities/models/Activity';
import { AppState } from 'src/app/app.reducer';
import { getActivities, getActivity, selectActivity } from '../../actions';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  animations: [
    trigger('cardsAnimation', [
      transition('* => *', [
        query('mat-card', style({transform: 'translateX(-100%)'})),
        query('mat-card',
          stagger('600ms', [
              animate('900ms', style({transform: 'translateX(0)'}))
          ])),
      ])
    ])
  ]
})
export class ActivitiesComponent implements OnInit {

  public activities: Activity[]

  public selectedActivity: Activity

  public loading: boolean = false

  public displayedColumnsActivities: string[] = ['id', 'name', 'category', 'price', 'date', 'action']

  @Input() userId: number

  @Input() ownerId: number

  public isTourist: boolean = false
  

  constructor(
    private store: Store<AppState>
    ) { }

  ngOnInit(): void {

    this.store.select('login').subscribe(state =>{
      this.isTourist = state.user && state.user.type === 0
    })

    // reset selected activity
    this.store.dispatch(selectActivity(null))

    // get activities
    this.store.dispatch(getActivities())

    // subscribe to activities
    this.subscribeActivities()
  
  }

  subscribeActivities() {
    this.store.select('activities').subscribe( state => {
      const selectedActivity = state.selectedActivity
      this.selectedActivity = selectedActivity
      this.loading = state.loading

      const activities = state.activities
      if (activities && this.userId) {
        this.store.select('profile').subscribe(profile => {
          const myActivities = profile.activities
          const myActivitiesArray = myActivities.map(act => act.activityId)
          this.activities = activities.filter(act => myActivitiesArray.includes(act.id))
        })
      } else if (activities && this.ownerId) {
        const ownerActivities = activities.filter(act => act.userId == this.ownerId)
        this.activities = ownerActivities
      } else {
        this.activities = activities
      }
    })
  }

  onSelected(activity: Activity) {
    if (activity) {
      this.store.dispatch(selectActivity({activity}))
      this.store.dispatch(getActivity({id: activity.id}))
      // console.log('selected:', activity)
    } else {

      const newActivity = new Activity()
      newActivity.name = ''
      newActivity.category = ''
      newActivity.description = ''
      newActivity.subcategory = ''
      newActivity.price = null
      newActivity.date = null
      newActivity.language = ''
      newActivity.minimumCapacity = null
      newActivity.limitCapacity = null
      newActivity.userId = this.userId
      this.store.dispatch(selectActivity({activity: newActivity }))
      // this.store.dispatch(getActivity({id: null}))
      // this.selectedActivity = new Activity()
    }
    
  }


}
