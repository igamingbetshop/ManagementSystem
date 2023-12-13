import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportBySportsComponent } from './report-by-sports.component';
import { ReportBySportsRoutingModule } from "./report-by-sports-routing.module";
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';

@NgModule({
  declarations: [
    ReportBySportsComponent
  ],
  imports: [
    CommonModule,
    ReportBySportsRoutingModule
  ],
  providers: [
    FilterOptionsResolver
  ]
})

export class ReportBySportsModule {
}
