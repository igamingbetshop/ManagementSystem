import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MarketTypesComponent } from './market-types.component';




const routes: Routes = [
  {
    path: '',
    component:MarketTypesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketTypeRoutingModule
{

}
