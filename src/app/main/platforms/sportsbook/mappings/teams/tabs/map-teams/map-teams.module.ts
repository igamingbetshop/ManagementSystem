import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import { MapTeamsTabComponent } from './map-teams.component';
import { TranslateModule } from "@ngx-translate/core";
import { UnmappedTeamsGridComponent } from "./girds/unmapped-teams-grid/unmapped-teams-grid.component";
import { MappedTeamsGridComponent } from './girds/mapped-teams-grid/mapped-teams-grid.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


const routes: Routes = [
  {
    path: '',
    component: MapTeamsTabComponent
  }
];

@NgModule({
  declarations: [MapTeamsTabComponent, UnmappedTeamsGridComponent, MappedTeamsGridComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatSelectModule,
    MatGridListModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ]
})
export class MapTeamsTabModule { }
