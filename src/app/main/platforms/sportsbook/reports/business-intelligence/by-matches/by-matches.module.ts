import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ByMatchesComponent } from './by-matches.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  {
    path: '',
    component: ByMatchesComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    AgGridModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatNativeDateModule,
    MatDatepickerModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [ByMatchesComponent],
  providers: [DatePipe],
})
export class ByMatchesModule { }
