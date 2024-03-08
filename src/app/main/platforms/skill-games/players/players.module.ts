import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {AgBooleanFilterModule} from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {AgGridModule} from "ag-grid-angular";
import {OpenerComponent} from "../../../components/grid-common/opener/opener.component";
import {AgBooleanFilterComponent} from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {PlayersRoutingModule} from "./players-routing.module";
import {PlayersComponent} from "./players.component";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatSnackBarModule,
    PlayersRoutingModule
  ],
  declarations: [PlayersComponent]
})
export class PlayersModule {}
