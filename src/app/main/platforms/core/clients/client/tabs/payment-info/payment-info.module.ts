import {RouterModule, Routes} from "@angular/router";
import {PaymentInfoComponent} from "./payment-info.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDialogModule} from "@angular/material/dialog";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";

import { AddAccountComponent } from './add-account/add-account.component';
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from '@angular/material/icon';



const routes: Routes = [
  {
    path: '',
    component: PaymentInfoComponent
  }
];

@NgModule({
  declarations: [PaymentInfoComponent, AddAccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    MatDialogModule,
    AgGridModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
    MatIconModule
  ],
  providers: [DatePipe]
})


export class PaymentInfoModule {

}
