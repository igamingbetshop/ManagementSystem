import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { AgGridModule } from "ag-grid-angular";
import { SportsReportComponent } from "./sports-report.component";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule, Routes } from "@angular/router";
import { MatInputModule } from "@angular/material/input";

const routes: Routes = [
  {
    path: '',
    component: SportsReportComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
    MatInputModule,
    RouterModule.forChild(routes),

  ],
  declarations: [SportsReportComponent],
  providers: [DatePipe],
})
export class SportsReportModule { }
