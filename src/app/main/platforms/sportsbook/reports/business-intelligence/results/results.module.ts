import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ResultsComponent } from './results.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";




const routes: Routes = [
  {
    path: '',
    component: ResultsComponent,

  }
];

@NgModule({
  declarations: [ResultsComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    PartnerDateFilterComponent
  ]
})
export class ResultsModule { }
