import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { MatSelectModule } from "@angular/material/select";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { ViewDetailComponent } from './view-detail/view-detail.component';
import { AgGridModule } from "ag-grid-angular";
import { TranslateModule } from "@ngx-translate/core";
import { BonusesService } from "../../../bonuses.service";
import { CurrencySettingsComponent } from "../../../currency-settings/currency-settings.component";
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  },
  {
    path: ':id',
    component: ViewDetailComponent
  }
];

@NgModule({
  declarations: [DetailsComponent, ViewDetailComponent],
  providers: [DatePipe, BonusesService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    MatSelectModule,
    CurrencySettingsComponent,
    MatDialogModule
  ]
})
export class DetailsModule {
}
