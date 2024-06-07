import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {AllPoolBettingComponent} from "./all-pool-betting.component";
import {AgGridModule} from "ag-grid-angular";
import {AllPoolBettingRouteModule} from "./all-pool-betting-routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatButtonModule} from "@angular/material/button";

import {MatSelectModule} from "@angular/material/select";

import {MatSnackBarModule} from "@angular/material/snack-bar";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';

@NgModule({
  imports: [
    CommonModule,
    AllPoolBettingRouteModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [AllPoolBettingComponent]
})
export class AllPoolBettingModule { }
