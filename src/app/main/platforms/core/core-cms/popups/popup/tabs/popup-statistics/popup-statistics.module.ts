import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatButtonModule } from "@angular/material/button";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { PartnerDateFilterComponent } from "src/app/main/components/partner-date-filter/partner-date-filter.component";
import { PopupStatisticsComponent } from "./popup-statistics.component";

const routes: Routes = [
  {
    path: '',
    component: PopupStatisticsComponent
  }
];

@NgModule({
  declarations: [PopupStatisticsComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
    PartnerDateFilterComponent
  ]
})

export class PopupStatisticsModule {

}
