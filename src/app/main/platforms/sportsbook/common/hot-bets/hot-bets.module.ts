import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from '@angular/material/select';

import { MatButtonModule } from '@angular/material/button';
import { HotBetsRoutingModule } from './hot-bets-routing.module';
import { HotBetsComponent } from './hot-bets.component';
import { SelectedHotBetGridComponent } from './selected-hot-bet/selected-hot-bet-grid.component';


@NgModule({
  declarations: [
    HotBetsComponent,
  ],
  imports: [
    CommonModule,
    HotBetsRoutingModule,
    AgGridModule,
    TranslateModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    SelectedHotBetGridComponent,
  ]
})
export class HotBetsModule { }
