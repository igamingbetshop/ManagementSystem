import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {PaymentInfoComponent} from "./payment-info.component";
import {MatButtonModule} from "@angular/material/button";

import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import { CreateEditAccountComponent } from './create-edit-account/create-edit-account.component';
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from '@angular/material/icon';


const routes: Routes = [
  {
    path: '',
    component: PaymentInfoComponent,
  }
]

@NgModule({
  declarations: [PaymentInfoComponent, CreateEditAccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    MatButtonModule,
    AgGridModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslateModule,
    MatIconModule
  ],
  providers: [DatePipe]
})

export class PaymentInfoModule {

}
