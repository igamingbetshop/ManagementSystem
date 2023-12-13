import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { ProvidersTabComponent } from './providers-tab.component';

const routes: Routes = [
  {
    path:'',
    component: ProvidersTabComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./main-provider/main-povider.module').then(m => m.MainProviderModule),

        },
        {
          path: 'provider',
          loadChildren:() => import('./provider/provider.module').then(m => m.ProviderModule),
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
export class ProvidersTabRoutingModule
{

}
