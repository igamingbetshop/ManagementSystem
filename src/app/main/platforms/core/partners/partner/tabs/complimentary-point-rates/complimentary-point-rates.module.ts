import {RouterModule, Routes} from "@angular/router";
import {ComplimentaryPointRatesComponent} from "./complimentary-point-rates.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AgGridModule} from "ag-grid-angular";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {TranslateModule} from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  {
    path: '',
    component: ComplimentaryPointRatesComponent,
  }
]

@NgModule({
  declarations: [ComplimentaryPointRatesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule
  ]
})

export class ComplimentaryPointRatesModule {

}
