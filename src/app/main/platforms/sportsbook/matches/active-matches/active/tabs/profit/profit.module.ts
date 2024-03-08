import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfitComponent } from './profit.component';
import { RouterModule, Routes } from '@angular/router';
import {MatButtonModule} from "@angular/material/button";

import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import { AddSettingComponent } from './add-setting/add-setting.component';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

import {MatCheckboxModule} from "@angular/material/checkbox";
import { ViewProfitInfoComponent } from './view-profit-info/view-profit-info.component';
import {TranslateModule} from "@ngx-translate/core";
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';
import { MatMenuModule } from '@angular/material/menu';

const routes: Routes = [
  {
    path: '',
    component: ProfitComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    TranslateModule,
    DropdownDirective,
    MatMenuModule
  ],
  declarations: [ProfitComponent, AddSettingComponent, ViewProfitInfoComponent]
})
export class ProfitModule { }
