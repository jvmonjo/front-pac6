import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsCompanyGuard } from 'src/app/login/guards/is-company.guard';
import { LoggedInGuard } from 'src/app/login/guards/logged-in.guard';
import { AdminComponent } from 'src/app/profile/components/admin/admin.component';
import { EducationComponent } from 'src/app/profile/components/education/education.component';
import { FavoritesComponent } from './views/favorites/favorites.component';
import { HomeComponent } from './views/home/home.component';
import { LanguagesComponent } from 'src/app/profile/components/languages/languages.component';
import { LoginFormComponent } from 'src/app/login/components/login-form/login-form.component';
import { MyActivitiesComponent } from 'src/app/profile/components/my-activities/my-activities.component';
import { ProfilePageComponent } from 'src/app/profile/components/profile-page/profile-page.component';
import { SignupComponent } from 'src/app/profile/components/signup/signup.component';


const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'signin', component: LoginFormComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [LoggedInGuard], },
  { path: 'education', component: EducationComponent, canActivate: [LoggedInGuard], },
  { path: 'education/:id', component: EducationComponent, canActivate: [LoggedInGuard], },
  { path: 'language', component: LanguagesComponent, canActivate: [LoggedInGuard], },
  { path: 'language/:id', component: LanguagesComponent, canActivate: [LoggedInGuard], },
  { path: 'favorites', component: FavoritesComponent, canActivate: [LoggedInGuard], },
  { path: 'my-activities', component: MyActivitiesComponent, canActivate: [LoggedInGuard], },
  { path: 'admin', component: AdminComponent, canActivate: [IsCompanyGuard], }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
