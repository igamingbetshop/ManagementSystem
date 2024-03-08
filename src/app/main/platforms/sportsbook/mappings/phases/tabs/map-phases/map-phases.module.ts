import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import { MapPhasesTabComponent } from './map-phases.component';
import {TranslateModule} from "@ngx-translate/core";
import { UnmapedPhasesComponent } from './components/unmaped-phases/unmaped-phases.component';
import { MappedPhasesComponent } from './components/mapped-phases/mapped-phases.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



const routes: Routes = [
  {
    path: '',
    component: MapPhasesTabComponent
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
    TranslateModule,
    MatButtonModule
  ],
  declarations: [
    MapPhasesTabComponent,
    UnmapedPhasesComponent,
    MappedPhasesComponent],
  providers: [DatePipe],
})
export class MapPhasesTabModule { }
