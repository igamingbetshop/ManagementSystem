import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { ByChangeHistoryComponent } from './by-change-history.component';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  {
    path: '',
    component: ByChangeHistoryComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [ByChangeHistoryComponent],
  providers: [DatePipe],
})
export class ByChangeHistoryModule { }
