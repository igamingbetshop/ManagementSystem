import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { MarketTypeComponent } from './market-type.component';
import { MarketTypeRoutingModule } from './market-type-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MarketTypeRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MarketTypeComponent]
})
export class MarketTypeModule { }
