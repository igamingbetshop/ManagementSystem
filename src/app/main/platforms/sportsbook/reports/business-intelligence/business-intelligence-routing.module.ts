import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SportFilterOptionsResolver } from '../../resolvers/sport-filter-options.resolver';
import { BusinessIntelligenceComponent } from './business-intelligence.component';
import { SportPartnersResolver } from '../../resolvers/sport-partners.resolver';

const routes: Routes = [

  {
    path: '',
    component: BusinessIntelligenceComponent,
    children: [
      {
        path: 'by-bets',
        loadChildren: () => import('./by-bets/by-bets.module').then(m => m.ByBetsModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: 'by-bets-not-accepted',
        loadChildren: () => import('./by-bets-not-accepted/by-bets-not-accepted.module').then(m => m.ByBetsNotAcceptedModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: 'by-limits',
        loadChildren: () => import('./by-limits/by-limits.module').then(m => m.ByLimitsModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: 'by-matches',
        loadChildren: () => import('./by-matches/by-matches.module').then(m => m.ByMatchesModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: 'report-by-sports',
        loadChildren: () => import('./by-sports/report-by-sports.module').then(m => m.ReportBySportsModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: 'by-players',
        loadChildren: () => import('./by-players/by-players.module').then(m => m.ByPlayersModule),
        resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}

      },
      {
        path: 'results',
        loadChildren: () => import('./results/results.module').then(m => m.ResultsModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: 'by-bonuses',
        loadChildren: () => import('./by-bonuses/by-bonuses.module').then(m => m.ByBounusesModule),
        resolve: { filterData: SportFilterOptionsResolver },
      },
      {
        path: '',
        redirectTo: 'by-bets',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessIntelligenceRoutingModule {

}
