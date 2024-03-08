import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {KeysSGComponent} from "./keys.component";
import {AgGridModule} from "ag-grid-angular";
import {OpenerComponent} from "../../../../../../components/grid-common/opener/opener.component";
import {MatButtonModule} from "@angular/material/button";

import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: KeysSGComponent,
  }
]

@NgModule({
  declarations: [KeysSGComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    AgGridModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
  ]
})

export class KeysSGModule {

}
