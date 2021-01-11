import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from 'src/app/profile/components/signup/signup.component';
import { ProfilePageComponent } from 'src/app/profile/components/profile-page/profile-page.component';
import { MyActivitiesComponent } from 'src/app/profile/components/my-activities/my-activities.component';
import { EducationComponent } from 'src/app/profile/components/education/education.component'; 
import { LanguagesComponent } from 'src/app/profile/components/languages/languages.component';
import { AdminComponent } from 'src/app/profile/components/admin/admin.component';
import { ActivitiesModule } from 'src/app/activities/activities.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';




@NgModule({
  declarations: [SignupComponent, ProfilePageComponent, MyActivitiesComponent, EducationComponent, LanguagesComponent, AdminComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActivitiesModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  exports: [SignupComponent, ProfilePageComponent, MyActivitiesComponent, EducationComponent, LanguagesComponent, AdminComponent]
})
export class ProfileModule { }
