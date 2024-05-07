import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AllPoolBettingComponent} from "./all-pool-betting.component";

const routes: Routes = [
  {
    path:'',
    component: AllPoolBettingComponent,
    children: [
      {
        path: 'pool-bet',
        loadChildren: () => import('../pool-bet/pool-bet.module').then(m => m.PoolBetModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPoolBettingRouteModule {}
