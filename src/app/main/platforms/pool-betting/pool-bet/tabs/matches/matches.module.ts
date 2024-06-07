import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatchesComponent } from "./matches.component";
import { AgGridModule } from "ag-grid-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatButtonModule } from "@angular/material/button";

import { MatSelectModule } from "@angular/material/select";

import { MatSnackBarModule } from "@angular/material/snack-bar";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: MatchesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [MatchesComponent]
})
export class MatchesModule { }
