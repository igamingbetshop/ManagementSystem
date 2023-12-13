import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitionComponent } from './competition.component';
import {CompetitionRoutingModule } from './competition-routing.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    CompetitionRoutingModule,
    MatTabsModule,
  ],
  declarations: [CompetitionComponent]
})
export class CompetitionModule { }
