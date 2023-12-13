import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MapRegionsTabComponent,} from './map-regions.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import {TranslateModule} from "@ngx-translate/core";
import { MappedRegionsGridComponent } from "./grids/mapped-region-grid/mapped-regions-grid.component";
import { UnmappedRegionsGridComponent } from "./grids/unmapped-region-grid/unmapped-regions-grid.component";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MapRegionsTabComponent
  }
];

@NgModule({
    declarations: [MapRegionsTabComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        MatSelectModule,
        MatGridListModule,
        TranslateModule,
        MatButtonModule,
        MappedRegionsGridComponent,
        UnmappedRegionsGridComponent
    ]
})
export class MapRegionsModule { }
