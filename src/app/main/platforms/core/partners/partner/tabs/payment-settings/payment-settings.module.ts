import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {PaymentSettingsComponent} from "./payment-settings.component";
import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import { AddPaymentSettingComponent } from './add-payment-setting/add-payment-setting.component';
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import { ViewPaymentSettingComponent } from './view-payment-setting/view-payment-setting.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { AddCurrencyRateComponent } from './add-currency-rate/add-currency-rate.component';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: PaymentSettingsComponent,
    children: [
      {
        path: 'main-info',
        component: ViewPaymentSettingComponent,
      }
    ]
  },
  // {
  //   path: ':id',
  //   component: ViewPaymentSettingComponent,
  // }
]

@NgModule({
  declarations: [PaymentSettingsComponent, AddPaymentSettingComponent, ViewPaymentSettingComponent, AddCurrencyRateComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        MatSnackBarModule,
        AgGridModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        TranslateModule
    ],
  providers: [DatePipe]
})

export class PaymentSettingsModule {

}
