import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesComponent } from './favorites.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatGridListModule,
    AgGridModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [FavoritesComponent]
})
export class FavoritesModule { }
