import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerComponent } from './partner.component';
import { PartnerRoutingModule } from './partner-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    PartnerRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [PartnerComponent]
})
export class PartnerModule { }
