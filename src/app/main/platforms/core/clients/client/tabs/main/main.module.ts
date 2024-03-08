import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {MainComponent} from "./main.component";
import {RouterModule, Routes} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";

import {MatIconModule} from "@angular/material/icon";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AgGridModule} from "ag-grid-angular";
import {ViewMainComponent} from './view-main/view-main.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatRadioModule} from "@angular/material/radio";
import {TranslateModule} from "@ngx-translate/core";
import { HtmlEditorModule } from "src/app/main/components/html-editor/html-editor.component";
import { MatTableModule } from "@angular/material/table";
import { AccountTypesTableComponent } from "./accounts-types-table/account-types-table.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: ':id',
    component: ViewMainComponent
  }
];

@NgModule({
  declarations: [MainComponent, ViewMainComponent, ChangePasswordComponent, AccountTypesTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    HtmlEditorModule,
    MatTableModule

  ],
  providers: [DatePipe]
})
export class MainModule {

}
