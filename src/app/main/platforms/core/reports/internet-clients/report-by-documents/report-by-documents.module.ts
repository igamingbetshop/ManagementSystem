import {RouterModule, Routes} from "@angular/router";
import { ReportByDocumentsComponent} from "./report-by-documents.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
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
import {OddsTypePipe} from "../../../../../../core/pipes/odds-type.pipe";

const routes: Routes = [
  {
    path: '',
    component: ReportByDocumentsComponent,

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
  declarations: [ReportByDocumentsComponent],
  providers: [DatePipe, OddsTypePipe],
})


export class ReportByDocumentsModule {
}
