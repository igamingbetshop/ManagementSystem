import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliateComponent } from './affiliate.component';
import { MatTabsModule } from "@angular/material/tabs";
import { AffiliateRoutingModule } from './affiliate-routing.module';




@NgModule({
  imports: [
    CommonModule,
    AffiliateRoutingModule,
    MatTabsModule,
  ],
  declarations: [AffiliateComponent]
})
export class affiliateModule { }
