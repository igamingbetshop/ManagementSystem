import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliateComponent } from './affiliate.component';
import { MatTabsModule } from "@angular/material/tabs";
import { AffiliateRoutingModule } from './affiliate-routing.module';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  imports: [
    CommonModule,
    AffiliateRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [AffiliateComponent]
})
export class affiliateModule { }
