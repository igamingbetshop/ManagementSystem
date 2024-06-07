import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinsComponent } from './coins.component';
import { CoinsRoutingModule } from './coins-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoinsRoutingModule,
    MatSelectModule,
    MatDialogModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [CoinsComponent]
})
export class CoinsModule { }
