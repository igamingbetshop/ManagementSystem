import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinishComponent } from './finish.component';
import { FinishRoutingModule } from './finish-routing.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FinishRoutingModule,
    MatTabsModule,
  ],
  declarations: [FinishComponent]
})
export class FinishModule { }
