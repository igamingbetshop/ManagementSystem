import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { PoolBettingComponent } from './pool-betting.component';

// @ts-ignore
const routes: Routes = [
  {
    path:'',
    component:PoolBettingComponent,
    children: [
      {
        path: 'all-pool-betting',
        loadChildren: () => import('./all-pool-betting/all-pool-betting.module').then(m => m.AllPoolBettingModule),
      },
      {
        path: 'pool-bet',
        loadChildren: () => import('./pool-bet/pool-bet.module').then(m => m.PoolBetModule),
      },
      {
        path: '',
        redirectTo: 'all-pool-betting',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolBettingRoutingModule {}
