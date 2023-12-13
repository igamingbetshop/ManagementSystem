import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";

import { PlayerCategoriesComponent, } from './player-categories.component';
import { PlayerCategoriesRoutingModule } from './player-categories-routing.module';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    PlayerCategoriesRoutingModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule,
    TranslateModule,
    AgGridModule,
    MatButtonModule
  ],
  declarations: [PlayerCategoriesComponent]
})
export class PlayerCategoriesModule {
}
