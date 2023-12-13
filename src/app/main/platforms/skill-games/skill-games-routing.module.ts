import {RouterModule, Routes} from "@angular/router";
import {SkillGamesComponent} from "./skill-games.component";
import {NgModule} from "@angular/core";
import {SkillGamesPartnersResolver} from "./resolvers/skill-games-partners.resolver";
import {SkillGamesFilterOptionsResolver} from "./resolvers/skill-games-filter-options.resolver";

const routes: Routes = [
  {
    path: '',
    component: SkillGamesComponent,
    children: [
      {
        path: 'players',
        loadChildren: () => import('./players/players.module').then(m => m.PlayersModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesFilterOptionsResolver}
      },
      {
        path: 'currencies',
        loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesFilterOptionsResolver}
      },
      {
        path: 'partners',
        loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesFilterOptionsResolver}
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesFilterOptionsResolver}
      },
      {
        path: 'cash-tables',
        loadChildren: () => import('./cash-tables/cash-table.module').then(m => m.CashTableModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesFilterOptionsResolver}
      },
      {
        path: 'tournaments',
        loadChildren: () => import('./tournaments/tournaments.module').then(m => m.TournamentsModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesFilterOptionsResolver}
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesPartnersResolver}
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        resolve: { partners: SkillGamesPartnersResolver, filterOptions: SkillGamesPartnersResolver}
      },
      {
        path: '',
        redirectTo: 'skillGames',
        pathMatch:'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillGamesRoutingModule {

}
