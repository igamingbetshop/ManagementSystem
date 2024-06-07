import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllClientsComponent } from "./all-clients.component";
import { AllClientsRoutingModule } from "./all-clients-routing.module";
import { AgGridModule } from "ag-grid-angular";
import { OpenerComponent } from "../../../../components/grid-common/opener/opener.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { TranslateModule } from "@ngx-translate/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatNativeDateModule } from "@angular/material/core";
import { AgBooleanFilterModule } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

import { MatInputModule } from "@angular/material/input";

import { AgDateTimeFilter } from '../../../../components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { AgDropdownFilter } from '../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";


@NgModule({
    declarations: [AllClientsComponent, OpenerComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AllClientsRoutingModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatDatepickerModule,
        TranslateModule,
        AgBooleanFilterModule,
        AgGridModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        AgDateTimeFilter,
        AgDropdownFilter,
        PartnerDateFilterComponent
    ]
})
export class AllClientsModule {

}
