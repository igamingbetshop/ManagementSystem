import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MatchesComponent } from './matches.component';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';



const routes: Routes = [

  {
    path:'',
    component: MatchesComponent,
    children:[
      {
        path: 'active-matches',
        loadChildren: () => import('./active-matches/active-matches.module').then(m => m.ActiveMatchesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'favorites',
        loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'finished',
        loadChildren: () => import('./finished/finished.module').then(m => m.FinishedModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesRoutingModule
{

}
