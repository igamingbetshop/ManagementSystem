import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FavoritesGridComponent } from './favorites-grid/favorites-grid.component';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent
  }
];

@NgModule({
    declarations: [FavoritesComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatGridListModule,
        AgGridModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        FavoritesGridComponent
    ]
})
export class FavoritesModule { }
