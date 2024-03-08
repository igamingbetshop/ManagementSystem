import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AllAgentsComponent} from "./all-agents.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {AgGridModule} from "ag-grid-angular";
import {AllAgentsRoutingModule} from "./all-agents-routing.module";


@NgModule({
  imports: [
    CommonModule,
    AllAgentsRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    FormsModule,
    AgGridModule
  ],
  declarations: [AllAgentsComponent],
  providers:[]

})

export class AllAgentsModule {

}
