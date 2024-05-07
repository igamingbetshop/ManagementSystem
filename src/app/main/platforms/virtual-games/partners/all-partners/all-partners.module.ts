import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AllPartnersComponent } from "./all-partners.component";
import { AllPartnersRoutingModule } from "./all-partners-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { AgBooleanFilterModule } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import { AgGridModule } from "ag-grid-angular";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { MatFormFieldModule } from "@angular/material/form-field";

import { MatSelectModule } from "@angular/material/select";

import { MatButtonModule } from "@angular/material/button";



@NgModule({
  declarations: [AllPartnersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AllPartnersRoutingModule,
    TranslateModule,
    AgBooleanFilterModule,
    MatButtonModule,
    AgGridModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})

export class AllPartnersModule { }
