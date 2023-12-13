import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { PaymentsComponent } from './payments.component';



const routes: Routes = [

  {
    path:'',
    component:PaymentsComponent,
    children:[
      {
        path: 'deposits',
        loadChildren: () => import('./deposits/deposits.module').then(m => m.DepositsModule)
      },
      {
        path: 'withdrawals',
        loadChildren: () => import('./withdrawals/withdrawals.module').then(m => m.WithdrawalsModule)
      },
      {
        path: 'payment-forms',
        loadChildren: () => import('./payment-forms/payment-forms.module').then(m => m.PaymentFormsModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule
{

}
