import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MapMarketTypesComponent } from './market-types.component';


const routes: Routes = [
  {
    path:'',
    component: MapMarketTypesComponent,
    children:
      [
        {
          path: 'map-market-types',
          loadChildren:() => import('./tabs/map-market-types/map-market-types.module').then(m => m.MapMarketTypesTabModule),
        },
        {
          path: 'mapped-market-types',
          loadChildren:() => import('./tabs/mapped-market-types/mapped-market-types.module').then(m => m.MappedMarketTypesModule),
        },
        {
          path: '',
          redirectTo: 'map-market-types',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapMarketTypesRoutingModule
{

}
