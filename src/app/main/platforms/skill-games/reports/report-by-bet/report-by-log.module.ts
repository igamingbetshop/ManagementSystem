import {RouterModule, Routes} from "@angular/router";
import {ReportByLogComponent} from "./report-by-log.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatButtonModule} from "@angular/material/button";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {OddsTypePipe} from "../../../../../core/pipes/odds-type.pipe";
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";


const routes: Routes = [
  {
    path: '',
    component: ReportByLogComponent
  },
]

@NgModule({
    declarations: [ReportByLogComponent],
    providers: [DatePipe, OddsTypePipe],
    imports: [
        CommonModule,
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
        TranslateModule,
        PartnerDateFilterComponent
    ]
})

export class ReportByLogModule {
}
