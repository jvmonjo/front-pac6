import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Education } from 'src/app/profile/models/Education';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  public loading: boolean
  public education: Education = new Education()
  public educationForm: FormGroup
  public type: FormControl
  public level: FormControl
  public name: FormControl
  public university: FormControl
  public finishDate: FormControl

  private userId: number

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router) { }

  public levelList: string[]
  public typeList: string[]

  ngOnInit(): void {
    this.store.select('login').subscribe(state => {
      this.userId = state.user ? state.user.id : null
    })
    this.getEducation()
    this.typeList = [
      'Títol universitari',
      'Cicle formatiu'
    ]

    this.type = new FormControl('', [
      Validators.required
    ])
    this.level = new FormControl('')
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35)
    ])
    this.university = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35)
    ])

    this.finishDate = new FormControl('')

    this.educationForm = this.formBuilder.group({
      type: this.type,
      level: this.level,
      name: this.name,
      university: this.university,
      finishDate: this.finishDate,
      userId: this.userId
    })
    this.onChanges()
  }

  async save(): Promise<boolean | Education> {
    this.education.type = this.type.value
    this.education.level = this.level.value
    this.education.name = this.name.value
    this.education.university = this.university.value
    this.education.finishDate = this.finishDate.value
    this.education.userId = this.userId

    if(this.education.id) {
      return this.profileService.updateEducation(this.education).toPromise()
      .then(() => this.router.navigateByUrl('/profile'))
    } else {
      return this.profileService.addEducation(this.education).toPromise()
      .then(() => this.router.navigateByUrl('/profile'))
    }

    
    
  }


  onChanges(): void {
    this.educationForm.get('type').valueChanges.subscribe(val => {
      if(val == 'Títol universitari') {
        this.levelList = ['Grau', 'Diplomat', 'Llicenciat', 'Enginyer', 'Màster', 'Doctorat']
      } else {
        this.levelList = ['Grau superior', 'Grau mitjà']
      }
    });
  }

  getEducation(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (!id) {
      return
    }
    this.profileService.getEducation(id)
      .subscribe(education => {
        // console.log('getEducation', education)
        this.education = education
        this.educationForm.setValue({
          name: education.name,
          type: education.type,
          level: education.level,
          university: education.university,
          finishDate: education.finishDate || '',
          userId: this.userId
        });
      });
  }
}
