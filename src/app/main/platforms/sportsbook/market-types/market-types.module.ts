import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketTypesComponent } from './market-types.component';
import { MarketTypesRoutingModule } from './market-types-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { SelectionsGridComponent } from './selections-grid/selections-grid.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MarketTypesRoutingModule,
    MatGridListModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    AgGridModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule
  ],
  declarations: [MarketTypesComponent, SelectionsGridComponent]
})
export class MarketTypesModule { }
