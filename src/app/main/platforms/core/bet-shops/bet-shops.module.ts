import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { BetShopsComponent } from './bet-shops.component';
import { BetShopsRoutingModule } from './bet-shops-routing.module';



@NgModule({
  declarations: [BetShopsComponent],
  imports: [
    CommonModule,
    BetShopsRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class BetShopsModule { }
