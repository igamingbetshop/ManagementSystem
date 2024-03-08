import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {AgGridModule} from "ag-grid-angular";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FinishedCashTablesComponent} from "./finished-cash-tables.component";
import {FinishedCashTablesRoutingModule} from "./finished-cash-tables-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FinishedCashTableComponent} from "./finished-cash-table/finished-cash-table.component";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import { AgBooleanFilterModule } from "src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatSnackBarModule,
    FinishedCashTablesRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  declarations: [FinishedCashTablesComponent, FinishedCashTableComponent]
})
export class FinishedCashTablesModule {
}
