import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/activities/models/Activity';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  constructor(
    private storageService: StorageService,
    private store: Store<AppState>) { }

  public favorites: Activity[]
  public loading: boolean
  public isTourist: boolean
  public selectedActivity: Activity

  ngOnInit(): void {
    this.store.select('login').subscribe(state => {
      this.isTourist = state.user && state.user.type === 0
    })
    this.getFavorites()
  }

  getFavorites() {
    return this.store.select('activities').subscribe(state => {
      const favorites = this.storageService.getItem('favorites')
      this.loading = state.loading
      this.selectedActivity = state.selectedActivity
      this.favorites = state.activities.filter(act =>  favorites.includes(act.id))
    })
  }

  onChange(id) {
    this.getFavorites()
  }


}
