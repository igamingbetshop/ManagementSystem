import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {ReportByClientIdentityComponent} from "./report-by-client-identity.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";

const routes: Routes = [
  {
    path: '',
    component: ReportByClientIdentityComponent,

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
    MatDialogModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [ReportByClientIdentityComponent],
  providers: [DatePipe],
})


export class ReportByClientIdentityModule {
}
