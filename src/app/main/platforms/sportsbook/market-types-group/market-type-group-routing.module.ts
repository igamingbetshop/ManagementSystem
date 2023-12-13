import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MarketTypeGroupComponent } from './market-type-group.component';




const routes: Routes = [
  {
    path: '',
    component:MarketTypeGroupComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketTypeGroupRoutingModule
{

}
