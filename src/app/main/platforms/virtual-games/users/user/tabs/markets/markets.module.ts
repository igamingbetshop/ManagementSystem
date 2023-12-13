import {RouterModule, Routes} from "@angular/router";
import {MarketsComponent} from "./markets.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatGridListModule} from "@angular/material/grid-list";
import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: MarketsComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [MarketsComponent]
})

export class MarketsModule {
}
