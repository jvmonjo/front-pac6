import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/profile/models/User';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { Credentials } from '../models/Credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public isLoggedIn: boolean = false;
  
  constructor(
    private profileService: ProfileService
  ) { }

  login({email, password}: Credentials): Observable<User>  {
    const dbUsers = this.profileService.getUsers()
    return dbUsers.pipe(
      map(
        users => {
          const user = users.find(user => user.email === email && user.password === password)
            if (user) {
              return user
            } else {
              throw('Wrong email or password')
            }
        })
    )
  }

}
