import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MappedResultTypesTabComponent } from './mapped-result-types.component';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';



const routes: Routes = [
  {
    path: '',
    component: MappedResultTypesTabComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [MappedResultTypesTabComponent]
})
export class MappedResultTypesTabModule { }
