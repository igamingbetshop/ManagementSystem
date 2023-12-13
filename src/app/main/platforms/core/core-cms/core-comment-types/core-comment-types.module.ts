import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommentTypesComponent } from './core-comment-types.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: CoreCommentTypesComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [CoreCommentTypesComponent]
})
export class CoreCommentTypesModule { }
