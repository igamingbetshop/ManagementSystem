import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';


import {FilterOptionsResolver } from 'src/app/core/services';
import { ProvidersComponent } from './providers.component';

const routes: Routes = [

  {
    path:'',
    component:ProvidersComponent,
    children:[
      {
        path: 'provider',
        loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: 'payment-systems',
        loadChildren: () => import('../providers/payment-systems/payment-systems.module').then(m => m.PaymentSystemsModule)
      },
      {
        path: 'affiliates',
        loadChildren: () => import('../providers/affiliates/affiliates.module').then(m => m.AffiliatesModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../providers/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'all-providers',
        loadChildren: () => import('./all-providers/all-providers.module').then(m => m.AllProvidersModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-providers',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvidersRoutingModule
{

}
