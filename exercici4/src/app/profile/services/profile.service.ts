import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap, find, switchMap } from 'rxjs/operators';
import { MessageService } from '../../shared/services/message.service';
import { Observable, of, Subject, from } from 'rxjs';
import { User } from '../models/User';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';
import { Education } from 'src/app/profile/models/Education';
import { UserLanguage } from 'src/app/profile/models/UserLanguage';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private usersUrl = 'api/users'
  private loggedIn = false
  public currentUser: User = this.storageService.getItem('user')
  private logger = new Subject<boolean>()
  private userSubject = new Subject<User>()

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router) { 
     }

    getUsers(): Observable<User[]> {
      const usersArray = this.http.get<User[]>(this.usersUrl)
      return usersArray
    }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
  
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
  
    /** Log a UserService message with the MessageService */
    private log(message: string) {
      this.messageService.add(`UserService: ${message}`);
    }

    getUser(id: number): Observable<User> {
      const url = `${this.usersUrl}/${id}`;
      return this.http.get<User>(url).pipe(
        tap(_ => this.log(`fetched user id=${id}`)),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
    }

   
    getCurrentUser(): Observable<User> {
      return this.userSubject.asObservable()
    }

    async addUser(user: User): Promise<User> {
      const dbUsers = await this.getUsers().toPromise()
      const userExists = dbUsers.find(dbUser => dbUser.email === user.email)

      if (userExists) {
        throw new Error("Email already registered");
      } else {
        return this.http.post<User>(this.usersUrl, user, this.httpOptions).toPromise()
      }

        
    }

    deleteUser(user: User | number): Observable<User> {
      const id = typeof user === 'number' ? user : user.id;
      const url = `${this.usersUrl}/${id}`;
    
      return this.http.delete<User>(url, this.httpOptions).pipe(
        tap(_ => this.log(`deleted user id=${id}`)),
        catchError(this.handleError<User>('deleteUser'))
      );
    }

    /** PUT: update the user on the server */
    updateUser(user: User): Observable<any> {
      return this.http.put(this.usersUrl, user, this.httpOptions).pipe(
        tap(_ => {
          this.storageService.addItem('user', user)
          // console.log(user)
          this.currentUser = user
          this.userSubject.next(this.currentUser)
        })
      )
    }

    getEducations(id: number): Observable<Education[]> {
      return this.http.get<Education[]>('api/educations').pipe(
        map(data => data.filter(e => e.userId == id))
      )
    }

    getLanguages(id: number): Observable<UserLanguage[]> {
      return this.http.get<UserLanguage[]>('api/languages').pipe(
        map(data => data.filter(e => e.userId == id))
      )
    }

    getEducation(id: number): Observable<Education> {
      return this.http.get<Education>('api/educations/' + id).pipe()
    }

    updateEducation(education: Education): Observable<any> {
      // console.log('updated education', education)
      return this.http.put('api/educations/' + education.id, education, this.httpOptions).pipe()
    }

    addEducation(education: Education): Observable<any> {
      // console.log('added education', education)
      return this.http.post('api/educations/', education, this.httpOptions).pipe()
    }

    deleteEducation(education: Education | number): Observable<Education> {
      const id = typeof education === 'number' ? education : education.id;
      const url = `api/educations/${id}`;
  
      return this.http.delete<Education>(url, this.httpOptions).pipe(
        // tap(_ => this.log(`deleted Education id=${id}`)),
        // catchError(this.handleError<Education>('deleteEducation'))
      );
    }

    deleteLanguage(language: UserLanguage | number): Observable<UserLanguage> {
      const id = typeof language === 'number' ? language : language.id;
      const url = `api/languages/${id}`;
  
      return this.http.delete<UserLanguage>(url, this.httpOptions).pipe();
    }

    updateLanguage(language: UserLanguage): Observable<any> {
      // console.log('updated language', language)
      return this.http.put('api/languages/' + language.id, language, this.httpOptions).pipe()
    }

    addLanguage(language: UserLanguage): Observable<any> {
      // console.log('added language', language)
      return this.http.post('api/languages/', language, this.httpOptions).pipe()
    }

    getLanguage(id: number): Observable<UserLanguage> {
      return this.http.get<UserLanguage>('api/languages/' + id).pipe()
    }
}
