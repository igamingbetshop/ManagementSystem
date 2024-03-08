import {NgModule} from "@angular/core";
import {PlayerCategoriesComponent} from "./player-categories.component";
import {CommonModule} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {PlayerCategoriesRoutingModule} from "./player-categories-routing.module";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [PlayerCategoriesComponent],
  imports: [
    CommonModule,
    PlayerCategoriesRoutingModule,
    AgGridModule,
    MatSnackBarModule,
    TranslateModule,
  ]
})


export class PlayerCategoriesModule {
}
