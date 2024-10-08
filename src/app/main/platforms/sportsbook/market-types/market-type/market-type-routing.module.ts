import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MarketTypeComponent } from './market-type.component';




const routes: Routes = [
  {
    path:'',
    component:MarketTypeComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/market-type-main/market-type-main.module').then(m => m.MarketTypeMainModule),
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
export class MarketTypeRoutingModule
{

}
