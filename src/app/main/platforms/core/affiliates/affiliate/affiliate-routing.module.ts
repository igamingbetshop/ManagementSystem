import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';


import { AffiliateComponent } from './affiliate.component';

const routes: Routes = [
  {
    path:'',
    component: AffiliateComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),

        },
        {
          path: 'commission-plan',
          loadChildren:() => import('./tabs/commission-plan/commission-plan.module').then(m => m.CommissionPlanModule),
        },
        {
          path: 'accounts',
          loadChildren:() => import('./tabs/corrections/corrections.module').then(m => m.CorrectionsModule),
        },
        {
          path: 'transactions',
          loadChildren:() => import('./tabs/transactions/transactions.module').then(m => m.TransactionsModule),
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
export class AffiliateRoutingModule
{

}
