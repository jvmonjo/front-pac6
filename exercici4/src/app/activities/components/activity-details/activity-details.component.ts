import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/activities/models/Activity';
import { User } from 'src/app/profile/models/User';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { addActivity, getActivity, selectActivity, updateActivity } from '../../actions';
import { cancelActivity, signupActivity } from 'src/app/profile/actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnInit {

  public id: number
  @Input() ownerId: number
  @Output() edited = new EventEmitter<boolean>()


  @Input() activity: Activity

  public activityForm: FormGroup
  public name: FormControl
  public category: FormControl
  public subcategory: FormControl
  public description: FormControl
  public date: FormControl
  public language: FormControl
  public price: FormControl
  public minimumCapacity: FormControl
  public limitCapacity: FormControl
  public cancelled: FormControl

  public categoryList: string[]
  public subcategoryList: string[]
  public languageList: any[]

  public peopleRegistered: number
  // public isFavorite: boolean
  public alreadySignedUp: boolean

  public isTourist: boolean
  public isCompany: boolean

  public user: User

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.store.select('login').subscribe(state => {
      this.user = state.user
      this.isTourist = state.user ? state.user.type === 0 : false
      this.isCompany = state.user ? state.user.type === 1 : false
    })

    this.categoryList = [
      'Cultura i patrimoni',
      'Enoturisme',
      'Platges'
    ]

    this.languageList = [
      {
        value: 'ES',
        label: 'Spanish'
      },
      {
        value: 'CA',
        label: 'Catalan'
      },
      {
        value: 'EN',
        label: 'English'
      }
    ]
    this.name = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35)
    ])

    this.description = new FormControl({value: '', disabled: !this.ownerId})

    this.category = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required
    ])

    this.subcategory = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required
    ])

    this.date = new FormControl({value: '', disabled: !this.ownerId})

    this.language = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required
    ])

    this.price = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required,
      Validators.min(0)
    ])

    this.minimumCapacity = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required,
      Validators.min(0)
    ])

    this.limitCapacity = new FormControl({value: '', disabled: !this.ownerId}, [
      Validators.required,
      Validators.min(0)
    ])

    this.cancelled = new FormControl({value: '', disabled: !this.ownerId})

    this.activityForm = this.formBuilder.group({
      name: this.name,
      category: this.category,
      subcategory: this.subcategory,
      description: this.description,
      date: this.date,
      language: this.language,
      price: this.price,
      minimumCapacity: this.minimumCapacity,
      limitCapacity: this.limitCapacity,
      cancelled: this.cancelled,
      userId: this.user ? this.user.id : null
    })
    this.getActivity()
    this.onChanges()
  }

  onChanges(): void {
    this.activityForm.get('category').valueChanges.subscribe(val => {
      if(val == 'Cultura i patrimoni') {
        this.subcategoryList = ['Concert', 'Espectacle', 'Excursió', 'Festivals', 'Visita guiada', 'Museu', 'Monument']
      } else if (val == 'Enoturisme') {
        this.subcategoryList = ['Bodega', 'Tast de productes', 'Excursió', 'Museu de vi', 'Visita guiada']
      } else {
        this.subcategoryList = ['Activitat nàutica', 'Cala', 'Concert', 'Excursió', 'Taller']
      }
    });
  }

  async save(): Promise<void | Activity> {
    this.activity.name = this.name.value
    this.activity.description = this.description.value
    this.activity.category = this.category.value
    this.activity.subcategory = this.subcategory.value
    this.activity.date = this.date.value
    this.activity.language = this.language.value
    this.activity.price = this.price.value
    this.activity.minimumCapacity = this.minimumCapacity.value
    this.activity.limitCapacity = this.limitCapacity.value
    this.activity.cancelled = this.cancelled.value || false
    this.activity.userId = this.user ? this.user.id : null



    if(this.activity && this.activity.id) {
      this.store.dispatch(updateActivity({activity: this.activity}))
      // return this.activitiesService.updateActivity(this.activity).toPromise().then(() => this.edited.emit(true))
    } else {
      this.store.dispatch(addActivity({activity: this.activity}))
      // return this.activitiesService.addActivity(this.activity).toPromise().then(() => this.edited.emit(true))
    }
    
    this.edited.emit()
    this._snackBar.open('Activity saved', 'OK', {
      duration: 2000,
    });
    return this.store.dispatch(selectActivity(null))
  }

  get state() {

    if (this.cancelled.value) {
      return 'Cancelled'
    } else if (this.peopleRegistered == this.limitCapacity.value){
      return 'Complete'
    } else {
      return 'Places available'
    }
  }

  getActivity(): void {
    const id = this.activity ? this.activity.id : null
    if (!id) {
      this.activity = new Activity()
      if (this.activityForm) {
        return this.activityForm.setValue({
          name: '',
          description:  '',
          category: '',
          subcategory: '',
          date: '',
          language: '',
          price: '',
          minimumCapacity: '',
          limitCapacity: '',
          cancelled: false,
          userId: this.user ? this.user.id : null
        })
      }
    }
    

    this.store.dispatch(getActivity({id}))
    this.store.select('activities').subscribe(state => {
      const activity = state.selectedActivity
      if (activity) {
        this.isSignedUp()
      }

      if (activity && this.activityForm) {
        this.activity = activity
        this.activityForm.setValue({
          name: activity.name,
          description: activity.description || '',
          category: activity.category,
          subcategory: activity.subcategory,
          date: activity.date,
          language: activity.language,
          price: activity.price,
          minimumCapacity: activity.minimumCapacity,
          limitCapacity: activity.limitCapacity,
          cancelled: activity.cancelled || false,
          userId: this.user ? this.user.id : null
        })
      }
      
    })

  }

  isSignedUp() {
    const userId = this.user ? this.user.id : null
      if (userId) {
        this.store.select('profile').subscribe(state => {
          const myActivities = state.activities
          const myActivitiesArray = myActivities.map(act => act.activityId)
          this.alreadySignedUp = myActivitiesArray.includes(this.activity.id)
        })
        
      }
  }

  cancel() {
    const userId = this.user ? this.user.id : null
    let myActivity
      if (userId) {
        this.store.select('profile').subscribe(state => {
          const myActivities = state.activities
          myActivity = myActivities.find(a => a.activityId == this.activity.id)
        })
      }

      if(myActivity) {
        this.store.dispatch(cancelActivity({activity: myActivity}))
        this.store.dispatch(getActivity({id: myActivity.activityId}))
      }

      
  }

  signup() {
    this.store.dispatch(signupActivity({userId: this.user.id, activityId: this.activity.id}))
    this.store.dispatch(getActivity({id: this.activity.id}))
  }

}
