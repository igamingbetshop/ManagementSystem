import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusSettingsComponent } from './bonus-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: BonusSettingsComponent
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
  declarations: [BonusSettingsComponent]
})
export class BonusSettingsModule { }
