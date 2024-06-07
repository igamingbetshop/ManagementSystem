import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ReportByGamesComponent } from "./report-by-games.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { FormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { MatButtonModule } from "@angular/material/button";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { ViewReportByGamesComponent } from './view-report-by-games/view-report-by-games.component';
import { TranslateModule } from "@ngx-translate/core";
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ReportByGamesComponent,
  },
  {
    path: ':id',
    component: ViewReportByGamesComponent
  }
];

@NgModule({
  declarations: [ReportByGamesComponent, ViewReportByGamesComponent],
  providers: [DatePipe],
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
    PartnerDateFilterComponent
  ]
})

export class ReportByGamesModule {
}
