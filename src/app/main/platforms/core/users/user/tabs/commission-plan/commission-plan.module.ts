import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionPlanComponent } from './commission-plan.component';
import { RouterModule, Routes } from '@angular/router';
import {AgGridModule} from "ag-grid-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: CommissionPlanComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    TranslateModule
  ],
  declarations: [CommissionPlanComponent]
})
export class CommissionPlanModule { }
