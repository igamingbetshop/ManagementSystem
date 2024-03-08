import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculationComponent } from './calculation.component';
import { RouterModule, Routes } from '@angular/router';
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: CalculationComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    FlexLayoutModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule
  ],
  declarations: [CalculationComponent]
})
export class CalculationModule { }
