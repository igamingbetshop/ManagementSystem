import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AgGridModule } from "ag-grid-angular";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";

import { ReportByBetComponent } from "./report-by-bet.component";
import { OddsTypePipe } from "../../../../../core/pipes/odds-type.pipe";
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ReportByBetComponent
  },
  // {
  //   path: ':id',
  //   component: ViewMainComponent
  // }
]

@NgModule({
    declarations: [ReportByBetComponent],
    providers: [DatePipe, OddsTypePipe],
    imports: [
        CommonModule,
        FormsModule,
        AgGridModule,
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        TranslateModule,
        PartnerDateFilterComponent
    ]
})

export class ReportByBetModule {
}
