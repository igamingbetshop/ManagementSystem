import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarketTypesComponent } from './market-types.component';
import { MapMarketTypesRoutingModule } from './market-types-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    MapMarketTypesRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MapMarketTypesComponent]
})
export class MapMarketTypesModule { }
