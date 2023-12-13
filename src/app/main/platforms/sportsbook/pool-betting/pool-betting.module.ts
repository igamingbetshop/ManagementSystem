import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { PoolBettingComponent } from './pool-betting.component';
import { PoolBettingRoutingModule } from './pool-betting-routing.module';
import { PoolBettingApiService } from "../services/pool-betting-api.service";

@NgModule({
  imports: [
    CommonModule,
    PoolBettingRoutingModule,
  ],
  declarations: [PoolBettingComponent],
  providers: [
    SportFilterOptionsResolver,
    PoolBettingApiService
  ]
})
export class PoolBettingModule { }
