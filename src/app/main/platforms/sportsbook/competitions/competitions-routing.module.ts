import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CompetitionsComponent } from './competitions.component';


const routes: Routes = [

  {
    path:'',
    component:CompetitionsComponent,
    children:[
      {
        path: 'competition',
        loadChildren: () => import('./competition-category/competition.module').then(m => m.CompetitionModule)
      },
      {
        path: 'all-competitions',
        loadChildren: () => import('./all-competitions/all-competitions.module').then(m => m.AllCompetitionsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'favorites',
        loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-competitions',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetitionsRoutingModule
{

}
