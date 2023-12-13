import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {ReportByBetshopsComponent} from "./report-by-betshops.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { ViewReportByBetshopsComponent } from './view-report-by-betshops/view-report-by-betshops.component';
import {TranslateModule} from "@ngx-translate/core";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";

const routes: Routes = [
  {
    path: '',
    component: ReportByBetshopsComponent,
  },
  {
    path: ':id',
    component: ViewReportByBetshopsComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [ReportByBetshopsComponent, ViewReportByBetshopsComponent],
  providers: [DatePipe],
})


export class ReportByBetshopsModule {
}
