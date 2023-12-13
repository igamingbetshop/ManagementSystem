import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { MappingsComponent } from './mappings.component';

const routes: Routes = [
  {
    path:'',
    component:MappingsComponent,
    children:[
      {
        path: 'sports',
        loadChildren: () => import('./sports/sports.module').then(m => m.SportsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'regions',
        loadChildren: () => import('./regions/regions.module').then(m => m.RegionsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'competitions',
        loadChildren: () => import('./competitions/competitions.module').then(m => m.MapCompetitionsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'teams',
        loadChildren: () => import('./teams/teams.module').then(m => m.MapTeamsModule),
        resolve:{filterData:SportFilterOptionsResolver},

      },
      {
        path: 'phases',
        loadChildren: () => import('./phases/phases.module').then(m => m.MapPhasesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'market-types',
        loadChildren: () => import('./market-types/market-types.module').then(m => m.MapMarketTypesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'result-types',
        loadChildren: () => import('./result-types/result-types.module').then(m => m.MapResultTypesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'sports',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MappingsRoutingModule
{

}
