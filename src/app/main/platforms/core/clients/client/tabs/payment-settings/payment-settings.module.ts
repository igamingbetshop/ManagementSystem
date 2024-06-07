import { RouterModule, Routes } from "@angular/router";
import { PaymentSettingsComponent } from "./payment-settings.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";

import { MatGridListModule } from "@angular/material/grid-list";
import { AgGridModule } from "ag-grid-angular";
import { AddBlockedPaymentsComponent } from './add-blocked-payments/add-blocked-payments.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";

import { TranslateModule } from "@ngx-translate/core";


const routes: Routes = [
  {
    path: '',
    component: PaymentSettingsComponent
  }
];

@NgModule({
  declarations: [PaymentSettingsComponent, AddBlockedPaymentsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatGridListModule,
    MatDialogModule,
    AgGridModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule
  ]
})

export class PaymentSettingsModule {

}
