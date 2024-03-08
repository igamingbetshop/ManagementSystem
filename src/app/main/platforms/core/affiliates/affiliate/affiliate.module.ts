import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliateComponent } from './affiliate.component';
import {MatTabsModule} from "@angular/material/tabs";
import { AffiliateRoutingModule } from './affiliate-routing.module';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";




@NgModule({
  imports: [
    CommonModule,
    AffiliateRoutingModule,
    MatTabsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [AffiliateComponent]
})
export class affiliateModule { }
