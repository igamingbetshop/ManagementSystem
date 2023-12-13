import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawalsComponent } from './withdrawals.component';
import { RouterModule, Routes } from '@angular/router';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";

const routes: Routes = [
  {
    path: '',
    component: WithdrawalsComponent,
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
    RouterModule.forChild(routes),
    FormsModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [WithdrawalsComponent]
})
export class WithdrawalsModule { }
