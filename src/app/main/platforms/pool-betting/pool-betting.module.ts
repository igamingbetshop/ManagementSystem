import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoolBettingComponent } from './pool-betting.component';
import { PoolBettingRoutingModule } from './pool-betting-routing.module';
import { SportFilterOptionsResolver } from '../sportsbook/resolvers/sport-filter-options.resolver';
import { PoolBettingApiService } from '../sportsbook/services/pool-betting-api.service';
import { SportsbookApiService } from '../sportsbook/services/sportsbook-api.service';
import { CommonDataResolver } from 'src/app/core/services';
import { PBPartnersResolver } from './resolvers/pb-partners.resolver';

@NgModule({
  imports: [
    CommonModule,
    PoolBettingRoutingModule,
  ],
  declarations: [PoolBettingComponent],
  providers: [
    SportsbookApiService,
    SportFilterOptionsResolver,
    PoolBettingApiService,
    CommonDataResolver,
    PBPartnersResolver
  ]
})
export class PoolBettingModule { }
