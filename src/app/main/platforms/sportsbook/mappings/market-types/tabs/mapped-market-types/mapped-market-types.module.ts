import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappedMarketTypesComponent } from './mapped-market-types.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MappedMarketTypesComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    FormsModule,
    MatGridListModule,
    MatDialogModule,
    TranslateModule,
    AgGridModule,
    MatButtonModule
  ],
  declarations: [MappedMarketTypesComponent]
})
export class MappedMarketTypesModule { }
