import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusesComponent } from './bonuses.component';
import { BonusesRoutingModule } from './bonuses-routing.module';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { CommonDataResolver } from '../resolvers/common-data.resolver';

@NgModule({
  declarations: [BonusesComponent],
  imports: [
    CommonModule,
    BonusesRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
    CommonDataResolver,
  ]
})
export class BonusesModule { }
