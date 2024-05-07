import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {AgGridModule} from "ag-grid-angular";
import {BetsSummaryComponent} from "./bets-summary.component";
import {TranslateModule} from "@ngx-translate/core";
import {AgCustomFilterModule} from "../../../../../../../components/ag-cutsom-filter/ag-custom-filter.component";

const routes: Routes = [
  {
    path: '',
    component: BetsSummaryComponent
  }
];

@NgModule({
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
    AgCustomFilterModule
  ],
  declarations: [BetsSummaryComponent]
})
export class BetsSummaryModule {
}
