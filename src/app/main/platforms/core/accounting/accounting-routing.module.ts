import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FilterOptionsResolver } from 'src/app/core/services';
import { AccountingComponent } from './accounting.component';


const routes: Routes = [

  {
    path:'',
    component:AccountingComponent,
    children:[
      {
        path: 'betshop-calculation',
        loadChildren: () => import('./betshop-calculation/betshop-calculation.module').then(m => m.BetshopCalculationModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: 'betshop-states',
        loadChildren: () => import('./betshop-states/betshop-states.module').then(m => m.BetshopStatesModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule
{

}
