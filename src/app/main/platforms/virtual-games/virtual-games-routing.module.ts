import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {VirtualGamesComponent} from "./virtual-games.component";
import {VirtualGamesPartnersResolver} from "./resolvers/virtual-games-partners.resolver";
import {VirtualGamesFilterOptionsResolver} from "./resolvers/virtual-games-filter-options.resolver";

const routes: Routes = [
  {
    path: '',
    component: VirtualGamesComponent,
    children: [
      {
        path: 'games',
        loadChildren: () => import('./games/games.module').then(m => m.GamesModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'players',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'player-categories',
        loadChildren: () => import('./player-categories/player-categories.module').then(m => m.PlayerCategoriesModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      // {
      //   path: 'currencies',
      //   loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
      //   resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      // },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'partners',
        loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'market-types',
        loadChildren: () => import('./market-types/market-types.module').then(m => m.MarketTypesModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'bet-shops',
        loadChildren: () => import('./bet-shops/bet-shops.module').then(m => m.BetShopsModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: 'common',
        loadChildren: () => import('./common/vg-common.module').then(m => m.VirtualGamesCommonModule),
        resolve: { partners: VirtualGamesPartnersResolver, filterOptions: VirtualGamesFilterOptionsResolver}
      },
      {
        path: '',
        redirectTo: 'virtualGames',
        pathMatch:'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualGamesRoutingModule {

}
