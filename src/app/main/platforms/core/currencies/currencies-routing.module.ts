import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FilterOptionsResolver } from 'src/app/core/services';
import { CurrenciesComponent } from './currencies.component';

const routes: Routes = [

  {
    path:'',
    component:CurrenciesComponent,
    children:[
      {
        path: 'currency',
        loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule)
      },
      {
        path: 'all-currencies',
        loadChildren: () => import('./all-currencies/all-currencies.module').then(m => m.AllCurrenciesModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-currencies',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrenciesRoutingModule
{

}
