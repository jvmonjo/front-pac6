import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/profile/models/User';
import Countries from 'src/app/shared/helpers/Countries';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { validateSpanishId } from 'spain-id'
import { Education } from 'src/app/profile/models/Education';
import { UserLanguage } from 'src/app/profile/models/UserLanguage';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { getUserProfile, updateUserInitiated } from 'src/app/profile/actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  public loading: boolean
  public user: User
  public name: FormControl
  public surname: FormControl
  public nationality: FormControl
  public birthdate: FormControl
  public phone: FormControl
  public nif: FormControl
  public aboutMe: FormControl
  public companyName: FormControl
  public companyDescription: FormControl
  public cif: FormControl

  public profileForm: FormGroup

  public nationalities = Countries
  public educations: Education[]
  public languages: UserLanguage[]

  public displayedColumnsEducations: string[] = ['type', 'level', 'name', 'university', 'finishDate', 'actions'];
  public displayedColumnsLanguages: string[] = ['level', 'language', 'finishDate', 'actions'];

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private store: Store<AppState>,
    private router: Router,
    private _snackBar: MatSnackBar
    ) {
   }

  ngOnInit(): void {
    this.store.select('login').subscribe(state => {
      this.user = state.user
    })
    this.store.dispatch(getUserProfile({user: this.user}))

    this.store.select('profile').subscribe(state => {
      this.educations = state.education
      this.languages = state.languages
      this.loading = state.loading
      const error = state.error

      if (error) {
        this._snackBar.open(`Error: ${error}`, 'OK', {
          duration: 2000,
        });
      }
    })

    const companyValidators = this.user && this.user.type == 1 ? [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35),
      this.noWhitespaceValidator()
    ] : null

    const cifValidators = this.user && this.user.type == 1 ? [
      Validators.required
    ] : null

    this.name = new FormControl(this.user.name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35),
      Validators.pattern("^[a-zA-Z ]*$"),
      this.noWhitespaceValidator()
    ])

    this.surname = new FormControl(this.user.surname, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35),
      Validators.pattern("^[a-zA-Z ]*$"),
      this.noWhitespaceValidator()
    ])

    this.nationality = new FormControl(this.user.nationality)

    this.birthdate = new FormControl(this.user.birthdate)

    this.nif = new FormControl(this.user.nif, [
      Validators.required,
      this.nifValidator()
    ])

    this.aboutMe = new FormControl(this.user.aboutMe)

    this.phone = new FormControl(this.user.phone)

    this.companyName = new FormControl(this.user.companyName, companyValidators)

    this.companyDescription = new FormControl(this.user.companyDescription)

    this.cif = new FormControl(this.user.cif, cifValidators)


    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      nationality: this.nationality,
      birthdate: this.birthdate,
      nif: this.nif,
      aboutMe: this.aboutMe,
      phone: this.phone,
      companyName: this.companyName,
      companyDescription: this.companyDescription,
      cif: this.cif
    })

    this.onChanges()
  }

  noWhitespaceValidator(): ValidatorFn {
    const nameRe = new RegExp('(^\s+|\s+$)')
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {noWhiteSpace: {value: control.value}} : null;
    }
  }

  nifValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(!control.value) return null
      const valid = validateSpanishId(control.value)
      return !valid ? {nif: {value: control.value}} : null;
    }
  }

  public async save(): Promise<void> {
    this.user.name = this.name.value
    this.user.surname = this.surname.value
    this.user.nationality = this.nationality.value
    this.user.birthdate = this.birthdate.value
    this.user.phone = this.phone.value
    this.user.nif = this.nif.value
    this.user.aboutMe = this.aboutMe.value
    if (this.user.type == 1) {
      this.user.companyName = this.companyName.value
      this.user.companyDescription = this.companyDescription.value
      this.user.cif = this.cif.value
    }

    this.store.dispatch(updateUserInitiated({user: this.user}))
    this._snackBar.open('Profile saved', 'OK', {
      duration: 2000,
    });
    
  }

  onChanges(): void {
    this.profileForm.get('nationality').valueChanges.subscribe(val => {
      if(val == 'ES') {
        this.profileForm.get('nif').setValidators([this.nifValidator()])
      } else {
        this.profileForm.get('nif').clearValidators();
      }
    });
  }

  editEducation(id) {
    this.router.navigateByUrl(`/education/${id}`)
  }

  addEducation() {
    this.router.navigateByUrl(`/education`)
  }

  deleteEducation(id) {
    if (confirm(`Are you sure you want to delete education number ${id}!`)) {
      this.educations = this.educations.filter(e => e.id !== id);
      this.profileService.deleteEducation(id).subscribe()
    } else {
      return
    }
  }

  editLanguage(id) {
    this.router.navigateByUrl(`/language/${id}`)
  }

  addLanguage() {
    this.router.navigateByUrl(`/language`)
  }

  deleteLanguage(id) {
    if (confirm(`Are you sure you want to delete language number ${id}!`)) {
      this.languages = this.languages.filter(e => e.id !== id);
      this.profileService.deleteLanguage(id).subscribe()
    } else {
      return
    }
  }

}
