import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MarketTypeGroupRoutingModule } from './market-type-group-routing.module';
import { MarketTypeGroupComponent } from './market-type-group.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MarketTypeGroupRoutingModule,
    MatDialogModule,
    MatSelectModule,
    AgGridModule,
    MatButtonModule,
    TranslateModule
  ],
  declarations: [MarketTypeGroupComponent]
})
export class MarketTypeGroupModule { }
