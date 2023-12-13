import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { PaymentSystemsComponent } from './payment-systems.component';
import { RouterModule, Routes } from '@angular/router';
import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {AgGridModule} from "ag-grid-angular";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: PaymentSystemsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgBooleanFilterModule,
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  providers: [DatePipe],
  declarations: [PaymentSystemsComponent]
})
export class PaymentSystemsModule { }
