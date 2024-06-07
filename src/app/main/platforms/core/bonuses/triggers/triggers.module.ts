import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggersComponent } from './triggers.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import { CreateTriggerSettingComponent } from './create-trigger-setting/create-trigger-setting.component';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { BonusesService } from "../bonuses.service";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

const routes: Routes = [
  {
    path: '',
    component: TriggersComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatCheckboxModule,
    DateTimePickerComponent
  ],
  declarations: [TriggersComponent, CreateTriggerSettingComponent],
  providers: [
    BonusesService
  ],
})
export class TriggersModule { }
