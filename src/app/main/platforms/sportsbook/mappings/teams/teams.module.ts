import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MapTeamsComponent } from './teams.component';
import { MapTeamsRoutingModule } from './teams-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  imports: [
    CommonModule,
    MapTeamsRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MapTeamsComponent]
})
export class MapTeamsModule { }
