import {RouterModule, Routes} from "@angular/router";
import {GamesComponent} from "./games.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {GamesRoutingModule} from "./games-routing.module";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";


const routes: Routes = [
  {
    path: '',
    component: GamesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatGridListModule,
    MatSnackBarModule,
    GamesRoutingModule,
    TranslateModule
  ],
  declarations: [GamesComponent]
})

export class GamesModule {}
