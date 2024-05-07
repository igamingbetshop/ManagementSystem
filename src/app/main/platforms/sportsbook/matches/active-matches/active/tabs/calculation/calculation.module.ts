import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculationComponent } from './calculation.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatSelectModule } from "@angular/material/select";

import { MatInputModule } from "@angular/material/input";

import { MatButtonModule } from "@angular/material/button";

import { AgGridModule } from "ag-grid-angular";
import { TranslateModule } from "@ngx-translate/core";
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  {
    path: '',
    component: CalculationComponent
  }
];

@NgModule({
  declarations: [CalculationComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    ResultsComponent
  ]
})
export class CalculationModule {
}
