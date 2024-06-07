import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { AgGridModule } from "ag-grid-angular";
import { MatSelectModule } from "@angular/material/select";

import { MarketTypesComponent } from "./market-types.component";
import { MarketTypesRoutingModule } from "./market-types-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { SelectionsGridComponent } from "./selections-grid/selections-grid.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MarketTypesRoutingModule,
    MatDialogModule,
    AgGridModule,
    MatSnackBarModule,
    MatSelectModule,
    TranslateModule
  ],
  declarations: [MarketTypesComponent, SelectionsGridComponent]
})

export class MarketTypesModule { }
