import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AgGridModule } from "ag-grid-angular";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";

import { DepositsComponent } from './deposits.component';


const routes: Routes = [
  {
    path: '',
    component: DepositsComponent,
    children: [
      {
        path: 'paymentrequests',
        loadChildren: () => import('../../../../components/deposite/deposite.module').then(m => m.DepositeModule)
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    TranslateModule,
    AgBooleanFilterModule,
    MatDialogModule,
    AgGridModule,
    MatInputModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [DepositsComponent]
})
export class DepositsModule {
}
