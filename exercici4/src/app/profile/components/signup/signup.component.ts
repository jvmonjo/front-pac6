import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/profile/models/User';
import { UserType } from 'src/app/profile/models/UserType';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { addUser } from 'src/app/profile/actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public user: User = new User()
  public name: FormControl
  public surname: FormControl
  public type: FormControl
  public email: FormControl
  public password: FormControl
  public confirmPassword: FormControl
  public signupForm: FormGroup

  public error: string

  public types = UserType
  public keys: string[]

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar
    ) { 
    this.keys = Object.keys(this.types).filter(k => !isNaN(Number(k)));
   }

  ngOnInit(): void {

    this.store.select('profile').subscribe(state => {
      const error = state.error
      if (error) {
        this._snackBar.open(`Error: ${error}`, 'OK', {
          duration: 2000,
        });
      }
    })

    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35),
      Validators.pattern("^[a-zA-Z ]*$"),
      this.noWhitespaceValidator()
    ])

    this.surname = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(35),
      Validators.pattern("^[a-zA-Z ]*$"),
      this.noWhitespaceValidator()
    ])

    this.type = new FormControl('', [
      Validators.required
    ])

    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ])

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])

    this.confirmPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])

    this.signupForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      type: this.type,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    })
  }

  noWhitespaceValidator(): ValidatorFn {
    const nameRe = new RegExp('(^\s+|\s+$)')
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {noWhiteSpace: {value: control.value}} : null;
    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  public joinNow(): void {
    this.user.name = this.name.value
    this.user.surname = this.surname.value
    this.user.type = Number(this.type.value)
    this.user.email = this.email.value
    this.user.password = this.password.value
    this._snackBar.open('Profile created', 'OK', {
      duration: 2000,
    });
    return this.store.dispatch(addUser({user: this.user}))
    
  }

}
