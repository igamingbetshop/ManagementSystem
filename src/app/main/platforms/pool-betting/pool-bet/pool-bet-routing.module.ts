import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PoolBetComponent} from "./pool-bet.component";

const routes: Routes = [
  {
    path: '',
    component: PoolBetComponent,
    children:
      [
        {
          path: 'main',
          loadChildren: () => import('./tabs/main/main.module').then(m => m.MainModule),
        },
        {
          path: 'matches',
          loadChildren: () => import('./tabs/matches/matches.module').then(m => m.MatchesModule),
        },

        {
          path: 'tickets',
          loadChildren: () => import('./tabs/tickets/tickets.module').then(m => m.TicketsModule),
        },
        {
          path: '',
          redirectTo: 'main',
          pathMatch: 'full'
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolBetRoutingModule {

}
