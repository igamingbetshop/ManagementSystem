import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";

import { MapCompetitionsTabComponent } from './map-competitions.component';
import { UnMappedCompetitionsGridComponent } from "./grids/unmapped-competitions-grid/unmapped-competitions-grid.component";
import { MappedCompetitionsGridComponent } from "./grids/mapped-competitons-grid/mapped-competitions-grid.component";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MapCompetitionsTabComponent
  }
];

@NgModule({
  declarations: [MapCompetitionsTabComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
    UnMappedCompetitionsGridComponent,
    MappedCompetitionsGridComponent
  ]
})
export class MapCompetitionsTabModule { }
