import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";
import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {MatButtonModule} from "@angular/material/button";
import {AgGridModule} from "ag-grid-angular";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {AgBooleanFilterComponent} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {AllPartnersRoutingModule} from "./all-partners-routing.module";
import {AllPartnersComponent} from "./all-partners.component";


@NgModule({
  declarations: [AllPartnersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AllPartnersRoutingModule,
    FlexLayoutModule,
    TranslateModule,
    AgBooleanFilterModule,
    MatButtonModule,
    AgGridModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})

export class AllPartnersModule {}
