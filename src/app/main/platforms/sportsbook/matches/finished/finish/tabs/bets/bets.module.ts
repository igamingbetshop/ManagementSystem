import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FinishedBetsComponent} from './bets.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";

import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {OddsTypePipe} from "../../../../../../../../core/pipes/odds-type.pipe";

const routes: Routes = [
  {
    path: '',
    component: FinishedBetsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MatDialogModule,
    TranslateModule
  ],
  providers: [DatePipe, OddsTypePipe],
  declarations: [FinishedBetsComponent]
})
export class BetsModule {
}
