import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginInitiated } from 'src/app/login/actions';
import { Credentials } from 'src/app/login/models/Credentials';
import { AppState } from 'src/app/app.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0.2
      })),
      transition('void <=> *', animate(1500))
    ])
  ]
})
export class LoginFormComponent implements OnInit {

  public credentials: Credentials = { email: '', password: ''}
  public email: FormControl
  public password: FormControl
  public loginForm: FormGroup
  public error: string
  public hide: boolean = true


  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ])

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    })

    this.store.select('login').subscribe(state => {
      // console.log(state)
      const error = state.error
      if (error) {
        this._snackBar.open(`Error: ${error}`, 'OK', {
          duration: 2000,
        });
      }
    });
  }


  public async checkLogin(): Promise<void> {
    // console.log(this.credentials)
    this.credentials.email = this.email.value
    this.credentials.password = this.password.value
    this.store.dispatch(loginInitiated({credentials: this.credentials}))
  }

}
