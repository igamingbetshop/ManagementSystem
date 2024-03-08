import {CommonModule, DatePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {MatSnackBarModule} from "@angular/material/snack-bar";

import {TranslateModule} from "@ngx-translate/core";
import {AgGridModule} from "ag-grid-angular";

import { AffiliatesComponent } from './affiliates.component';
import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {AgBooleanFilterComponent} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";

const routes: Routes = [
  {
    path: '',
    component: AffiliatesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgBooleanFilterModule,
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  providers: [DatePipe],
  declarations: [AffiliatesComponent]
})
export class AffiliatesModule { }
