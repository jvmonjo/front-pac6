import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivitiesComponent } from 'src/app/activities/components/activities/activities.component'
import { ActivityDetailsComponent } from 'src/app/activities/components/activity-details/activity-details.component'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [ActivitiesComponent, ActivityDetailsComponent, ActivityCardComponent],
  imports: [
    MatSnackBarModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule,
    MatChipsModule
  ],
  exports: [
    ActivitiesComponent, ActivityDetailsComponent, ActivityCardComponent
  ]
})
export class ActivitiesModule { }
