import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { TranslateModule } from "@ngx-translate/core";
import { AgGridModule } from "ag-grid-angular";

import { LimitsAndExclusionsComponent } from "./limits-and-exclusions.component";
import { ViewLimitsAndExclusionsChanges } from "./view-limints-and-exclusions-changes/view-limints-and-exclusions-changes.component";

const routes: Routes = [
  {
    path: '',
    component: LimitsAndExclusionsComponent
  },
  {
    path: ':id',
    component: ViewLimitsAndExclusionsChanges
  }
];

@NgModule({
  declarations: [LimitsAndExclusionsComponent, ViewLimitsAndExclusionsChanges],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    AgGridModule
  ]
})

export class LimitsAndExclusionsModule {

}
