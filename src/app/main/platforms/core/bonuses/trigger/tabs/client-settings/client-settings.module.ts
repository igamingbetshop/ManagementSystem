import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { ClientSettingsComponent } from './client-settings.component';
import { RouterModule, Routes } from '@angular/router';
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: ClientSettingsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [ClientSettingsComponent],
  providers: [DatePipe]
})
export class ClientSettingsModule { }
