import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MapSportsComponent } from './map-sports.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import {TranslateModule} from "@ngx-translate/core";
import { UnmappedSportsGridComponent } from './grids/unmapped-sports-grid/unmapped-sports-grid.component';
import { MappedSportsGridComponent } from './grids/mapped-sports-grid/mapped-sports-grid.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MapSportsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    FormsModule,
    MatGridListModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [MapSportsComponent, UnmappedSportsGridComponent, MappedSportsGridComponent],
  providers: [DatePipe],
})
export class MapSportsModule { }
