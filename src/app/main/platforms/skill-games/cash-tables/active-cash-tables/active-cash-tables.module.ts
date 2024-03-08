import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {AgGridModule} from "ag-grid-angular";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {ActiveCashTablesComponent} from "./active-cash-tables.component";
import {CashTablesRoutingModule} from "./active-cash-tables-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActiveCashTableComponent} from "./active-cash-table/active-cash-table.component";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {AddCashTableComponent} from "./add-cash-table/add-cash-table.component";
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
    CashTablesRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  declarations: [ActiveCashTablesComponent, ActiveCashTableComponent, AddCashTableComponent]
})
export class ActiveCashTablesModule {
}
