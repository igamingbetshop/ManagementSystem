import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TriggerComponent} from './trigger.component';


const routes: Routes = [
  {
    path: '',
    component: TriggerComponent,
    children:
      [
        {
          path: 'details',
          loadChildren: () => import('./tabs/details/details.module').then(m => m.DetailsModule),
          // resolve:{
          //   documentTypes:DocumentTypesResolver,

          // }
        },
        {
          path: 'client-settings',
          loadChildren: () => import('./tabs/client-settings/client-settings.module').then(m => m.ClientSettingsModule)
        },
        {
          path: 'products',
          loadChildren: () => import('./tabs/products/products.module').then(m => m.ProductsModule)
        },

        {
          path: '',
          redirectTo: 'details',
          pathMatch: 'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriggerRoutingModule {

}
