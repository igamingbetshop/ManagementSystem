import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleBonusesComponent } from './multiple-bonuses.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: MultipleBonusesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    AgGridModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatSelectModule,
    MatButtonModule
  ],
  declarations: [MultipleBonusesComponent]
})
export class MultipleBonusesModule { }
