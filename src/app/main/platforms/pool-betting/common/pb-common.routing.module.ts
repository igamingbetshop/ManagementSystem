import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PBCommonComponent } from './pb-common.component';

const routes: Routes = [

  {
    path: '',
    component: PBCommonComponent,
    children: [
      {
        path: 'currencies',
        loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
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
export class PBCommonRoutingModule {

}
