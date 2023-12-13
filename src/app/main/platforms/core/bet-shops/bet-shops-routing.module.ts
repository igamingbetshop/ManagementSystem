import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FilterOptionsResolver } from 'src/app/core/services';
import { BetShopsComponent } from './bet-shops.component';


const routes: Routes = [
  {
    path:'',
    component:BetShopsComponent,
    children:[
      {
        path: 'bet-shop',
        loadChildren: () => import('./bet-shop/bet-shop.module').then(m => m.BetShopModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: 'view-bet-shop',
        loadChildren: () => import('./bet-shop/view-bet-shop/view-bet-shop.module').then(m => m.ViewBetShopModule)

      },
      {
        path: 'all-bet-shops',
        loadChildren: () => import('./all-bet-shops/all-bet-shops.module').then(m => m.AllBetShopsModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-bet-shops',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetShopsRoutingModule
{

}
