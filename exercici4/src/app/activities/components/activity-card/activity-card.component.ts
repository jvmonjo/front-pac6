import { Component, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { EventEmitter } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { StorageService } from 'src/app/shared/services/storage.service';
import { getActivity, selectActivity } from '../../actions';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']

})
export class ActivityCardComponent implements OnInit {

  @Input() activity: Activity
  @Input() isTourist: boolean
  @Input() isUser: boolean
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  public isFavorite: boolean


  constructor(
    private store: Store<AppState>,
    private storageService: StorageService
  ) {

   }

  ngOnInit(): void {
    const favorites = this.storageService.getItem('favorites') || []
        const index = favorites.indexOf(this.activity.id);
          if (index > -1) {
            this.isFavorite = true
          } else {
            this.isFavorite = false
          }
  }

  onSelected(activity: Activity) {
    if (activity) {
      this.store.dispatch(selectActivity({activity}))
      this.store.dispatch(getActivity({id: activity.id}))
      // console.log('selected:', activity)
    }
  }

  toggleFavorite() {
    const favorites = this.storageService.getItem('favorites') || []
    if (favorites.includes(this.activity.id)) {
      const index = favorites.indexOf(this.activity.id);
      if (index > -1) {
        favorites.splice(index, 1);
      }
      this.isFavorite = false
    } else {
      favorites.push(this.activity.id)
      this.isFavorite = true
    }
    this.storageService.addItem('favorites', favorites)
    this.onChange.emit(this.activity.id)
  }


}
