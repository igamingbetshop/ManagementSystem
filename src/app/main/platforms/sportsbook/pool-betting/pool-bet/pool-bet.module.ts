import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from "@angular/material/tabs";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { PoolBetRoutingModule } from "./pool-bet-routing.module";
import { PoolBetComponent } from "./pool-bet.component";

@NgModule({
  imports: [
    CommonModule,
    PoolBetRoutingModule,
    MatTabsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
  ],
  declarations: [PoolBetComponent]
})
export class PoolBetModule { }
