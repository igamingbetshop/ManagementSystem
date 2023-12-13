import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MapMarketTypesTabComponent } from './map-market-types.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { UnmappedMarketTypesGridComponent } from './grids/unmapped-market-types-grid/unmapped-market-types-gird.component';
import { MappedMarketTypesGridComponent } from './grids/mapped-market-types-grid/mapped-market-types-gird.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MapMarketTypesTabComponent,

  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    AgGridModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule
  ],
  declarations: [MapMarketTypesTabComponent, UnmappedMarketTypesGridComponent, MappedMarketTypesGridComponent],
  providers: [DatePipe],
})
export class MapMarketTypesTabModule { }
