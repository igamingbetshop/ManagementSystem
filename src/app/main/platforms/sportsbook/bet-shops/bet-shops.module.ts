import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetShopsComponent } from './bet-shops.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { BetShopsRoutingModule } from './bet-shops-routing.module';
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BetShopsRoutingModule,
    MatDialogModule,
    MatSelectModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [BetShopsComponent]
})
export class BetShopsModule { }
