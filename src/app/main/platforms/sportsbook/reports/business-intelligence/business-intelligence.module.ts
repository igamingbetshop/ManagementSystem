import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessIntelligenceComponent } from './business-intelligence.component';
import { BusinessIntelligenceRoutingModule } from './business-intelligence-routing.module';


@NgModule({
  imports: [
    CommonModule,
    BusinessIntelligenceRoutingModule,
  ],
  declarations: [BusinessIntelligenceComponent]
})
export class BusinessIntelligenceModule { }
