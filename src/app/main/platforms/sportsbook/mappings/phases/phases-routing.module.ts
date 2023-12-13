import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MapPhasesComponent } from './phases.component';





const routes: Routes = [
  {
    path:'',
    component: MapPhasesComponent,
    children:
      [
        {
          path: 'map-phases',
          loadChildren:() => import('./tabs/map-phases/map-phases.module').then(m => m.MapPhasesTabModule),
        },
        {
          path: 'mapped-phases',
          loadChildren:() => import('./tabs/mapped-phases/mapped-phases.module').then(m => m.MappedPhasesTabModule),
        },
        {
          path: '',
          redirectTo: 'map-phases',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPhasesRoutingModule
{

}
