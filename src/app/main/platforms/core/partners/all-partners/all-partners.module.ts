import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPartnersComponent } from "./all-partners.component";
import { AllPartnersRoutingModule } from "./all-partners-routing.module";
import { AgGridModule } from "ag-grid-angular";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { TranslateModule } from "@ngx-translate/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatNativeDateModule } from "@angular/material/core";
import { AgBooleanFilterModule } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [AllPartnersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AllPartnersRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule
  ],
})
export class AllPartnersModule {

}
