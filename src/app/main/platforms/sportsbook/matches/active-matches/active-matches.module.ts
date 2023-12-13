import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveMatchesComponent } from './active-matches.component';
import { ActiveMatchesRoutingModule } from './active-matches-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ActiveMatchesRoutingModule,
  ],
  declarations: [ActiveMatchesComponent]
})
export class ActiveMatchesModule { }
