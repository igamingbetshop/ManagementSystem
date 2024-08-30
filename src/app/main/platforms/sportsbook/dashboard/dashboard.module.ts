import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import {HeaderFilterComponent} from "../../../components/header-filter/header-filter.component";
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarComponent} from "./progress-bar/progress-bar.component";


@NgModule({
    declarations: [DashboardComponent],
    providers: [ ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HeaderFilterComponent,
    ProgressBarComponent,
    TranslateModule
  ]
})
export class DashboardModule { }
