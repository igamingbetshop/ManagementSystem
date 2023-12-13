import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MapPhasesComponent } from './phases.component';
import { MapPhasesRoutingModule } from './phases-routing.module';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  imports: [
    CommonModule,
    MapPhasesRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MapPhasesComponent]
})
export class MapPhasesModule { }
