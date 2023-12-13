import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessIntelligenceComponent } from './business-intelligence.component';
import { BusinessIntelligenceRoutingModule } from './business-intelligence-routing.module';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";


@NgModule({
  imports: [
    CommonModule,
    BusinessIntelligenceRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
  ],
  declarations: [BusinessIntelligenceComponent]
})
export class BusinessIntelligenceModule { }
