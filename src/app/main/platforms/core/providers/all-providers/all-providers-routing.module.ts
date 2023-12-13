import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllProvidersComponent } from './all-providers.component';

const routes: Routes = [
  {
    path: '',
    component:AllProvidersComponent,
    children: [
      {
        path: 'provider',
        loadChildren: () => import('../provader-tabs/providers-tab.module').then(m => m.ProvidersTabModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllProvidersRoutingModule
{

}
