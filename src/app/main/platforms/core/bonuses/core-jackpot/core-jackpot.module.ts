import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CoreJackPotComponent } from './core-jackpot.component';

const routes: Routes = [
  {
    path: '',
    component: CoreJackPotComponent,
    children: [
      {
        path: 'jackpot',
        loadChildren: () => import('./jakpot/jackpot.module').then(m => m.JackpotModule),
      }
    ]
  },
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
  declarations: [CoreJackPotComponent]
})
export class CoreJackPotModule { }
