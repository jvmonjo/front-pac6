import { Route } from '@angular/compiler/src/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Education } from 'src/app/profile/models/Education';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { Location } from '@angular/common';
import { UserLanguage } from 'src/app/profile/models/UserLanguage';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  public loading: boolean
  public userLanguage: UserLanguage = new UserLanguage()
  public languageForm: FormGroup
  public level: FormControl
  public language: FormControl
  public finishDate: FormControl

  private userId: number

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router) { }

  public levelList: string[]
  public languageList: string[]

  ngOnInit(): void {
    this.store.select('login').subscribe(state => {
      this.userId = state.user ? state.user.id : null
    })
    this.getLanguage()
    this.languageList = [
      'Anglès',
      'Català',
      'Francès',
      'Castellà',
      'Alemany'
    ]

    this.levelList = [
      'A1',
      'A2',
      'B1',
      'B2',
      'C1',
      'C2'
    ]

    this.level = new FormControl('', [
      Validators.required
    ])
    this.language = new FormControl('', [
      Validators.required,
    ])

    this.finishDate = new FormControl('')

    this.languageForm = this.formBuilder.group({
      level: this.level,
      language: this.language,
      finishDate: this.finishDate,
      userId: this.userId
    })

  }

  async save(): Promise<boolean | Education> {
    this.userLanguage.level = this.level.value
    this.userLanguage.language = this.language.value
    this.userLanguage.finishDate = this.finishDate.value
    this.userLanguage.userId = this.userId

    if(this.userLanguage.id) {
      return this.profileService.updateLanguage(this.userLanguage).toPromise()
      .then(() => this.router.navigateByUrl('/profile'))
    } else {
      return this.profileService.addLanguage(this.userLanguage).toPromise()
      .then(() => this.router.navigateByUrl('/profile'))
    }

    
    
  }

  getLanguage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (!id) {
      return
    }
    this.profileService.getLanguage(id)
      .subscribe(language => {
        // console.log('getlanguage', language)
        this.userLanguage = language
        this.languageForm.setValue({
          language: language.language,
          level: language.level,
          finishDate: language.finishDate || '',
          userId: this.userId
        });
      });
  }
}
