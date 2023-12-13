import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ByLimitsComponent } from './by-limits.component';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: ByLimitsComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    ReactiveFormsModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [ByLimitsComponent]
})
export class ByLimitsModule { }
