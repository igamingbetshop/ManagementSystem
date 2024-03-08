import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";

import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {KeysComponent} from "./keys.component";
import {TranslateModule} from "@ngx-translate/core";
import {AddKeyComponent} from "./add-key/add-key.component";

const routes: Routes = [
  {
    path: '',
    component: KeysComponent,
  }
]

@NgModule({
  declarations: [KeysComponent, AddKeyComponent],
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
    TranslateModule
  ]
})


export class KeysModule {
}
