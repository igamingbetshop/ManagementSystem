import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportsComponent } from './sports.component';
import { SportsRoutingModule } from './sports-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SportsRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [SportsComponent]
})
export class SportsModule { }
