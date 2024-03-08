import {RouterModule, Routes} from "@angular/router";
import {TransactionsComponent} from "./transactions.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";

import {MatNativeDateModule} from "@angular/material/core";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent
  }
];
@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    AgGridModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  providers: [DatePipe]
})
export class TransactionsModule {

}
