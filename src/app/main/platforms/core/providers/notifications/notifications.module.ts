import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {AgGridModule} from "ag-grid-angular";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {TranslateModule} from "@ngx-translate/core";

import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {AgBooleanFilterComponent} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgBooleanFilterModule,
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  providers: [DatePipe],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }
