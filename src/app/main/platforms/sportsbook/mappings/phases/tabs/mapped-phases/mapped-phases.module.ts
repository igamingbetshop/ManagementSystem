import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MappedPhasesTabComponent } from './mapped-phases.component';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


const routes: Routes = [
  {
    path: '',
    component: MappedPhasesTabComponent
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
  declarations: [MappedPhasesTabComponent]
})
export class MappedPhasesTabModule { }
