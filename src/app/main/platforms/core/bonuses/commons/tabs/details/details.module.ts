import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from "ag-grid-angular";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatInputModule } from "@angular/material/input";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { ViewCommonComponent } from './view-common/view-common.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from '@angular/material/chips';

import { BonusesService } from "../../../bonuses.service";
import { CurrencySettingsComponent } from "../../../currency-settings/currency-settings.component";
import { MatDialogModule } from '@angular/material/dialog';
import { IdToNamePipe } from "../../../../../../../core/pipes/id-to-name-pipe";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';
import { MatTableModule } from '@angular/material/table';
import { CampaignSelectorComponent } from "./campaign-selector/campaign-selector.component";

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  },
  {
    path: ':id',
    component: ViewCommonComponent
  }
];

@NgModule({
    declarations: [DetailsComponent, ViewCommonComponent],
    providers: [DatePipe, BonusesService],
    imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    MatSelectModule,
    CurrencySettingsComponent,
    MatDialogModule,
    MatChipsModule,
    IdToNamePipe,
    DateTimePickerComponent,
    MatTableModule,
    CampaignSelectorComponent
]
})
export class DetailsModule {
}
