import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import { ByBetsNotAcceptedComponent } from './by-bets-not-accepted.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


const routes: Routes = [
  {
    path: '',
    component: ByBetsNotAcceptedComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TranslateModule,
    MatSelectModule,
    MatDialogModule,
    MatNativeDateModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AgGridModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [ByBetsNotAcceptedComponent],
  providers: [DatePipe, DecimalPipe],
})
export class ByBetsNotAcceptedModule { }
