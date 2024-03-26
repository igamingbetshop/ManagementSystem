import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { ChartModule } from "angular-highcharts";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {CollapseDirective} from "../../../../core/directives/collapse.directive";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HeaderFilterComponent } from "../../../components/header-filter/header-filter.component";




@NgModule({
    declarations: [DashboardComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        MatSelectModule,
        MatSnackBarModule,
        MatIconModule,
        TranslateModule,
        ChartModule,
        MatProgressSpinnerModule,
        CollapseDirective,
        MatCheckboxModule,
        HeaderFilterComponent
    ]
})
export class DashboardModule { }
