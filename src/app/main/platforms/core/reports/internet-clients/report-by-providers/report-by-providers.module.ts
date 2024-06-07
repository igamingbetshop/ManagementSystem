import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";

import { ReportByProvidersComponent } from "./report-by-providers.component";
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ReportByProvidersComponent,

  }
];

@NgModule({
  declarations: [ReportByProvidersComponent],
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


export class ReportByProvidersModule {
}
