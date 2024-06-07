import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from "@angular/material/tabs";
import { PoolBetRoutingModule } from "./pool-bet-routing.module";
import { PoolBetComponent } from "./pool-bet.component";

@NgModule({
  imports: [
    CommonModule,
    PoolBetRoutingModule,
    MatTabsModule,
  ],
  declarations: [PoolBetComponent]
})
export class PoolBetModule { }
