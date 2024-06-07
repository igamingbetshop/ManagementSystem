import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AgGridModule } from "ag-grid-angular";
import { TranslateModule } from "@ngx-translate/core";
import { CurrenciesRoutingModule } from "./currencies-routing.module";

import { CurrenciesComponent } from "./currencies.component";

@NgModule({
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [CurrenciesComponent]
})


export class CurrenciesModule {
}

