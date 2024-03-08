import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AllPlayersRoutingModule} from "./all-players-routing.module";
import {AllPlayersComponent} from "./all-players.component";
import {TranslateModule} from "@ngx-translate/core";
import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {AgGridModule} from "ag-grid-angular";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';




@NgModule({
  imports: [
    CommonModule,
    AllPlayersRoutingModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule
  ],
  declarations: [AllPlayersComponent]
})


export class AllPlayersModule {
}
