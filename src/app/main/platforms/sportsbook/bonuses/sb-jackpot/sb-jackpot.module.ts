import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { SBJackPotComponent } from './sb-jackpot.component';

const routes: Routes = [
  {
    path: '',
    component: SBJackPotComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    AgGridModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatButtonModule
  ],
  declarations: [SBJackPotComponent]
})
export class SBJackPotModule { }
