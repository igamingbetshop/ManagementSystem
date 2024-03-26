import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { SportsReportComponent } from "./sports-report.component";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule, Routes } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: SportsReportComponent,
  },
];

@NgModule({
    declarations: [SportsReportComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AgGridModule,
        FormsModule,
        MatSelectModule,
        MatButtonModule,
        TranslateModule,
        MatInputModule,
        RouterModule.forChild(routes),
        PartnerDateFilterComponent
    ]
})
export class SportsReportModule { }
