import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MapCompetitionsComponent } from './competitions.component';



const routes: Routes = [
  {
    path:'',
    component: MapCompetitionsComponent,
    children:
      [
        {
          path: 'map-competitions',
          loadChildren:() => import('./tabs/map-competitions/map-competitions.module').then(m => m.MapCompetitionsTabModule),
        },
        {
          path: 'mapped-competitions',
          loadChildren:() => import('./tabs/mapped-competitions/mapped-competitions.module').then(m => m.MappedCompetitionsTabModule),
        },
        {
          path: '',
          redirectTo: 'map-competitions',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapCompetitionsRoutingModule
{

}
