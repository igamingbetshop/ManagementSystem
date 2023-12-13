import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveComponent } from './active.component';
import { ActiveRoutingModule } from './active-routing.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    ActiveRoutingModule,
    MatTabsModule,
  ],
  declarations: [ActiveComponent]
})
export class ActiveModule { }
