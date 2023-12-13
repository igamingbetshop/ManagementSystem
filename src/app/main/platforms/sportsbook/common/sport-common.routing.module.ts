import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SportCommonComponent } from './sport-common.component';
import {CommonDataResolver} from '../../core/resolvers/common-data.resolver';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';



const routes: Routes = [

  {
    path: '',
    component: SportCommonComponent,
    children: [
      {
        path: 'currencies',
        loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
      },
      {
        path: 'permissible-odds',
        loadChildren: () => import('./permissible-odds/permissible-odds.module').then(m => m.PermissibleOddsModule),
      },
      {
        path: 'coins',
        loadChildren: () => import('./coins/coins.module').then(m => m.CoinsModule),
        resolve:{commonData: CommonDataResolver, filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'currencies',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportCommonRoutingModule {

}
