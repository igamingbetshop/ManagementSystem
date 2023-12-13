import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TournamentsComponent} from "./tournaments.component";
import {SkillGamesFilterOptionsResolver} from "../resolvers/skill-games-filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: TournamentsComponent,
    children: [
      {
        path: 'active-tournaments',
        loadChildren: () => import('./active-tournaments/active-tournaments.module').then(m => m.ActiveTournamentsModule),
        resolve: {filterData: SkillGamesFilterOptionsResolver},
      },
      {
        path: 'finished-tournaments',
        loadChildren: () => import('./finished-tournaments/finished-tournaments.module').then(m => m.FinishedTournamentsModule),
        resolve: {filterData: SkillGamesFilterOptionsResolver},
      },

      {
        path: '',
        redirectTo: 'active-tournaments',
        pathMatch: 'full'
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentsRoutingModule {
}
