import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MapResultTypesRoutingModule } from './result-types-routing.module';
import { MapResultTypesComponent } from './result-types.component';
import { TranslateModule } from '@ngx-translate/core';





@NgModule({
  imports: [
    CommonModule,
    MapResultTypesRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [MapResultTypesComponent]
})
export class MapResultTypesModule { }
