import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ActiveComponent } from './active.component';


const routes: Routes = [
  {
    path:'',
    component:ActiveComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),
        },
        {
          path: 'markets',
          loadChildren:() => import('./tabs/markets/markets.module').then(m => m.MarketsModule),
        },
        {
          path: 'profit',
          loadChildren:() => import('./tabs/profit/profit.module').then(m => m.ProfitModule),
        },
        {
          path: 'market',
          loadChildren:() => import('./tabs/markets/market/market.module').then(m => m.MarketModule),
        },
        {
          path: 'events',
          loadChildren:() => import('./tabs/events/events.module').then(m => m.EventsModule),
        },
        {
          path: 'calculation',
          loadChildren:() => import('./tabs/calculation/calculation.module').then(m => m.CalculationModule),
        },
        {
          path: 'bets',
          loadChildren:() => import('./tabs/bets/bets.module').then(m => m.BetsModule),
        },
        {
          path: 'bets-summary',
          loadChildren:() => import('./tabs/bets-summary/bets-summary.module').then(m => m.BetsSummaryModule),
        },

        {
          path: '',
          redirectTo: 'main',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveRoutingModule
{

}
