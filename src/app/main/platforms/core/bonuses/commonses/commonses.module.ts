import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsesComponent } from './commonses.component';
import { CommonsesRoutingModule } from './commonses-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';
import { GeneralSetupComponent } from './general-setup/general-setup.component';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BonusesService } from "../bonuses.service";
import { DialogModule } from "@angular/cdk/dialog";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

@NgModule({
  imports: [
    CommonModule,
    CommonsesRoutingModule,
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
    FormsModule,
    MatNativeDateModule,
    MatCheckboxModule,
    DialogModule,
    DateTimePickerComponent
  ],
  declarations: [CommonsesComponent, GeneralSetupComponent],
  providers: [
    DatePipe,
    BonusesService
  ],
})
export class CommonsesModule { }
