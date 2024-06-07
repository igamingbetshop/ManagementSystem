import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ReportByAgentTransfersComponent } from "./report-by-agent-transfers.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { FormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { MatButtonModule } from "@angular/material/button";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatInputModule } from "@angular/material/input";

import { MatSelectModule } from "@angular/material/select";

import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ReportByAgentTransfersComponent,

  }
];

@NgModule({
  declarations: [ReportByAgentTransfersComponent],
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
    MatDialogModule,
    TranslateModule,
    PartnerDateFilterComponent
  ]
})


export class ReportByAgentTransfersModule {
}
