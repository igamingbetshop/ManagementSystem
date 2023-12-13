import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusesComponent } from './bonuses.component';
import { BonusesRoutingModule } from './bonuses-routing.module';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';

@NgModule({
  imports: [
    CommonModule,
    BonusesRoutingModule,
  ],
  declarations: [BonusesComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class BonusesModule { }
