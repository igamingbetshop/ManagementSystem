import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {WithdrawalsComponent} from "./withdrawals.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectModule} from '@angular/material/select';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";


const routes: Routes = [
  {
    path: '',
    component: WithdrawalsComponent
  }
];

@NgModule({
  declarations: [WithdrawalsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  providers: [DatePipe]
})
export class WithdrawalsModule {

}
