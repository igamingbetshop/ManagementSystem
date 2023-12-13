import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { MapCompetitionsComponent } from './competitions.component';
import { MapCompetitionsRoutingModule } from './competitions-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  imports: [
    CommonModule,
    MapCompetitionsRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MapCompetitionsComponent]
})
export class MapCompetitionsModule { }
