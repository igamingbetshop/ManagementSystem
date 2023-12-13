import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MapRegionsComponent } from './regions.component';



const routes: Routes = [
  {
    path:'',
    component:MapRegionsComponent,
    children:
      [
        {
          path: 'map-regions',
          loadChildren:() => import('./tabs/map-regions/map-regions.module').then(m => m.MapRegionsModule),
        },
        {
          path: 'mapped-regions',
          loadChildren:() => import('./tabs/mapped-regions/mapped-regions.module').then(m => m.MappedRegionsModule),
        },
        {
          path: '',
          redirectTo: 'map-regions',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionsRoutingModule
{

}
