import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PaymentFormsComponent} from './payment-forms.component';
import {RouterModule, Routes} from '@angular/router';
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {MatDialogModule} from "@angular/material/dialog";
import {AddDepositFormComponent} from './add-deposit-form/add-deposit-form.component';
import {AddWithdrawFormComponent} from './add-withdraw-form/add-withdraw-form.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { MapTransactionsConfirmComponent } from './map-transactions-confirm/map-transactions-confirm.component';
import { RejectTransactionsConfirmComponent } from './reject-transactions-confirm/reject-transactions-confirm.component';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: PaymentFormsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    FormsModule,
    AgGridModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [PaymentFormsComponent, AddDepositFormComponent, AddWithdrawFormComponent, MapTransactionsConfirmComponent, RejectTransactionsConfirmComponent],
  providers: [DatePipe],
})
export class PaymentFormsModule {
}
