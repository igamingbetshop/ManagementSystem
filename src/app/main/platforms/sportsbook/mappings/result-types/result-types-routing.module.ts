import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MapResultTypesComponent } from './result-types.component';






const routes: Routes = [
  {
    path:'',
    component: MapResultTypesComponent,
    children:
      [
        {
          path: 'map-result-types',
          loadChildren:() => import('./tabs/map-result-types/map-result-types.module').then(m => m.MapResultTypesTabModule),
        },
        {
          path: 'mapped-result-types',
          loadChildren:() => import('./tabs/mapped-result-types/mapped-result-types.module').then(m => m.MappedResultTypesTabModule),
        },
        {
          path: '',
          redirectTo: 'map-result-types',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapResultTypesRoutingModule
{

}
