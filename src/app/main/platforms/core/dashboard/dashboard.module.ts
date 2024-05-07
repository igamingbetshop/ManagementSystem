import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import {FilterOptionsResolver} from "../resolvers/filter-options.resolver";
import {HeaderFilterComponent} from "../../../components/header-filter/header-filter.component";


@NgModule({
    declarations: [DashboardComponent],
    providers: [ FilterOptionsResolver],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HeaderFilterComponent
  ]
})
export class DashboardModule { }
