import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RegionsRoutingModule } from './regions-routing.module';
import { MapRegionsComponent } from './regions.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    RegionsRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MapRegionsComponent]
})
export class RegionsModule { }
