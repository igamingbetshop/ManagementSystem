import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappedSportsComponent } from './mapped-sports.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MappedSportsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [MappedSportsComponent]
})
export class MappedSportsModule { }
