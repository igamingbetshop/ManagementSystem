import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SportsbookComponent} from "./sportsbook.component";
import {SportPartnersResolver} from './resolvers/sport-partners.resolver';
import {SportFilterOptionsResolver} from './resolvers/sport-filter-options.resolver';


const routes: Routes = [
    {
      path: '',
      component: SportsbookComponent,
      children: [
        {
          path: 'sports',
          loadChildren: () => import('./sports/sports.module').then(m => m.SportsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'regions',
          loadChildren: () => import('./regions/regions.module').then(m => m.RegionsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'partners',
          loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'players',
          loadChildren: () => import('./players/players.module').then(m => m.PlayersModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'teams',
          loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'matches',
          loadChildren: () => import('./matches/matches.module').then(m => m.MatchesModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'bonuses',
          loadChildren: () => import('./bonuses/bonuses.module').then(m => m.BonusesModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'comment-types',
          loadChildren: () => import('./comment-types/comment-type.module').then(m => m.CommentTypeModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'competitions-categories',
          loadChildren: () => import('./competitions-categories/competitions-categories.module').then(m => m.CompetitionsCategoriesModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'competitions',
          loadChildren: () => import('./competitions/competitions.module').then(m => m.CompetitionsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'cms',
          loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'players-categories',
          loadChildren: () => import('./player-categories/player-categories.module').then(m => m.PlayerCategoriesModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'mappings',
          loadChildren: () => import('./mappings/mappings.module').then(m => m.MappingsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'market-types-group',
          loadChildren: () => import('./market-types-group/market-type-group.module').then(m => m.MarketTypeGroupModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'market-types',
          loadChildren: () => import('./market-types/market-types.module').then(m => m.MarketTypesModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'business-audit',
          loadChildren: () => import('./reports/business-audit/business-audit.module').then(m => m.BusinessAuditModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'business-intelligence',
          loadChildren: () => import('./reports/business-intelligence/business-intelligence.module').then(m => m.BusinessIntelligenceModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'bet-shops',
          loadChildren: () => import('./bet-shops/bet-shops.module').then(m => m.BetShopsModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'common',
          loadChildren: () => import('./common/sport-common.module').then(m => m.SportCommonModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver,}
        },
        {
          path: 'teasers',
          loadChildren: () => import('./teasers/teasers.module').then(m => m.TeasersModule),
          resolve: {partners: SportPartnersResolver, filterOptions: SportFilterOptionsResolver}
        },
        {
          path: 'result-types',
          loadComponent() {
            return import('./result-types/result-types.component').then(m => m.ResultTypesComponent);
          },
        },
        {
          path: '',
          redirectTo: 'sports',
          pathMatch: 'full'
        }
      ]
    }
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportsbookRoutingModule {
}
