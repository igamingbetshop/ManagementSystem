import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { VirtualGamesCommonComponent } from './vg-common.component';
import { CommonDataResolver } from '../../core/resolvers/common-data.resolver';
import { VirtualGamesFilterOptionsResolver } from '../resolvers/virtual-games-filter-options.resolver';



const routes: Routes = [
  {
    path: '',
    component: VirtualGamesCommonComponent,
    children: [
      {
        path: 'currencies',
        loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
      },
      {
        path: 'coins',
        loadChildren: () => import('./coins/coins.module').then(m => m.CoinsModule),
        // resolve:{commonData: CommonDataResolver, filterData:VirtualGamesFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'coins',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualGamesCommonRoutingModule {

}
