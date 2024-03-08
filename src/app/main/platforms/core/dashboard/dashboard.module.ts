import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { ChartModule } from "angular-highcharts";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {CollapseDirective} from "../../../../core/directives/collapse.directive";
import { MatCheckboxModule } from '@angular/material/checkbox';




@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    ChartModule,
    MatProgressSpinnerModule,
    CollapseDirective,
    MatCheckboxModule
  ],
  providers: [DatePipe]
})
export class DashboardModule { }
