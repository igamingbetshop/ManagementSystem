import {RouterModule, Routes} from "@angular/router";
import {BannersComponent} from "./banners.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {AgGridModule} from "ag-grid-angular";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { AddBannerComponent } from './add-banner/add-banner.component';
import {MatSelectModule} from "@angular/material/select";

import {MatSnackBarModule} from "@angular/material/snack-bar";

import 'ag-grid-enterprise';
import {MatButtonModule} from "@angular/material/button";

import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: BannersComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule
  ],
  providers: [DatePipe],
  declarations: [BannersComponent, AddBannerComponent]
})
export class BannersModule {

}
