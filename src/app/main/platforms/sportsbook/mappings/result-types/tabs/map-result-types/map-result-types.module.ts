import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import { MapResultTypesTabComponent } from './map-result-types.component';
import { TranslateModule } from "@ngx-translate/core";
import { UnmappedResultTypesGridComponent } from './grids/unmapped-result-types-grid/unmapped-result-types-grid.component';
import { MappedResultTypesGridComponent } from './grids/mapped-result-types-grid/mapped-result-types-grid.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';




const routes: Routes = [
  {
    path: '',
    component: MapResultTypesTabComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatGridListModule,
    AgGridModule,
    MatButtonModule,
    TranslateModule
  ],
  declarations: [MapResultTypesTabComponent, UnmappedResultTypesGridComponent, MappedResultTypesGridComponent],
  providers: [DatePipe],
})
export class MapResultTypesTabModule { }
