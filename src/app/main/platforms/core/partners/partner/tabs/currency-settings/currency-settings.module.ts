import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {CurrencySettingsComponent} from "./currency-settings.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {AgGridModule} from "ag-grid-angular";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {TranslateModule} from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  {
    path: '',
    component: CurrencySettingsComponent,
  }
]

@NgModule({
  declarations: [CurrencySettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    MatGridListModule,
    AgGridModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,


  ]
})

export class CurrencySettingsModule {

}
