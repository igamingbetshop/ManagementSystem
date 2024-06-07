import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { TeamComponent } from './team.component';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  {
    path: '',
    component: TeamComponent
  },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    AgGridModule,
    MatCardModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [TeamComponent],
  providers: [DatePipe],
})
export class TeamModule { }
