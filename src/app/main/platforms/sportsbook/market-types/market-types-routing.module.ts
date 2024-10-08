import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MarketTypesComponent } from './market-types.component';




const routes: Routes = [
  {
    path: '',
    component: MarketTypesComponent,
    children: [
      {
        path: 'market-type',
        loadChildren: () => import('./market-type/market-type.module').then(m => m.MarketTypeModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketTypesRoutingModule {

}
